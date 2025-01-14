import Relationship from "components/RelationShip";
import { grey, randomColor } from "helpers/Colors";
import React, { useMemo, useState } from "react";
import {
  CellComponentProps,
  RowSelectOption,
  SelectValue,
} from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import CreatableSelect from "react-select/creatable";
import CustomTagsStyles from "components/styles/TagsStyles";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { satinizedColumnOption } from "helpers/FileManagement";
import { ActionMeta, OnChangeValue } from "react-select";
import { ParseService } from "services/ParseService";
import { InputType } from "helpers/Constants";

const SelectCell = (popperProps: CellComponentProps) => {
  const { defaultCell } = popperProps;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const dataActions = tableState.data((state) => state.actions);

  const selectRow = tableState.data((state) => state.rows[row.index]);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const cellValue = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.SELECT,
        configInfo.getLocalSettings()
      ) as string
  );

  const [showSelect, setShowSelect] = useState(false);

  const columnActions = tableState.columns((state) => state.actions);
  const columnOptions = columnsInfo.getColumnOptions(column.id);
  function getColor() {
    const match = columnOptions.find(
      (option: { label: string }) => option.label === cellValue
    );
    if (match) {
      return match.color;
    } else {
      // In case of new select, generate random color
      const color = randomColor();
      columnActions.addOptionToColumn(tableColumn, cellValue, color);
      return color;
    }
  }

  const defaultValue = useMemo(
    () => ({
      label: cellValue?.toString(),
      value: cellValue?.toString(),
      color: cellValue ? getColor() : grey(200),
    }),
    [cellValue]
  );

  const handleOnChange = async (
    newValue: OnChangeValue<SelectValue, false>,
    actionMeta: ActionMeta<RowSelectOption>
  ) => {
    const sanitized = satinizedColumnOption(
      newValue ? newValue.value.toString() : ""
    );

    const newCell = ParseService.parseRowToLiteral(
      selectRow,
      tableColumn,
      sanitized
    );

    // Update on disk & memory
    await dataActions.updateCell(
      row.index,
      tableColumn,
      newCell,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings(),
      true
    );

    // Add new option to column options
    if (actionMeta.action === "create-option") {
      await columnActions.addOptionToColumn(
        tableColumn,
        sanitized,
        randomColor()
      );
    }
  };

  function SelectComponent() {
    return (
      <div className={c("tags")}>
        <CreatableSelect
          defaultValue={defaultValue}
          isSearchable
          autoFocus
          isClearable
          openMenuOnFocus
          menuPosition="fixed"
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          styles={CustomTagsStyles}
          options={columnsInfo.getColumnOptions(column.id)}
          onMenuClose={() => setShowSelect(false)}
          onChange={handleOnChange}
          isMulti={false}
          menuPortalTarget={activeDocument.body}
          menuPlacement="auto"
          menuShouldBlockScroll={true}
          className={`react-select-container ${c(
            "tags-container text-align-center"
          )}`}
          classNamePrefix="react-select"
          key={`${tableColumn.id}-select-open`}
        />
      </div>
    );
  }

  return (
    <>
      {showSelect ? (
        SelectComponent()
      ) : (
        /* Current value of the select */
        <div
          className={c(
            getAlignmentClassname(
              tableColumn.config,
              configInfo.getLocalSettings(),
              ["tabIndex"]
            )
          )}
          onDoubleClick={() => setShowSelect(true)}
          style={{ width: column.getSize() }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setShowSelect(true);
            }
          }}
          tabIndex={0}
        >
          {cellValue ? (
            <Relationship value={cellValue} backgroundColor={getColor()} />
          ) : null}
        </div>
      )}
    </>
  );
};

export default SelectCell;
