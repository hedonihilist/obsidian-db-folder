import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";
import { ParseService } from "services/ParseService";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const formulaRef = useRef<HTMLDivElement>();
  const formulaRow = tableState.data((state) => state.rows[row.index]);
  const dataActions = tableState.data((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const formulaInfo = tableState.automations((state) => state.info);

  useEffect(() => {
    setTimeout(async () => {
      // If formula cell is empty, do nothing
      if (formulaRef.current === null) return;

      const formulaResponse = formulaInfo
        .runFormula(
          tableColumn.config.formula_query,
          formulaRow,
          configInfo.getLocalSettings()
        )
        .toString();

      // If the formula cell is the same as the rendered formula, do nothing
      if (cell.getValue() === formulaRef.current.innerHTML) return;

      await MarkdownService.renderMarkdown(
        defaultCell,
        formulaResponse,
        formulaRef.current,
        5
      );

      // If formula cell is not configured to persist, exit
      if (
        !tableColumn.config.persist_formula ||
        cell.getValue() === formulaResponse
      )
        return;

      // Save formula response on disk
      const newCell = ParseService.parseRowToLiteral(
        formulaRow,
        tableColumn,
        formulaResponse
      );

      await dataActions.updateCell(
        row.index,
        tableColumn,
        newCell,
        columnsInfo.getAllColumns(),
        configInfo.getLocalSettings()
      );
    }, 0);
  }, [row]);

  return (
    <span
      ref={formulaRef}
      className={`${c(
        "md_cell " +
          getAlignmentClassname(
            tableColumn.config,
            configInfo.getLocalSettings()
          )
      )}`}
      key={`formula_${cell.id}`}
    />
  );
};

export default FormulaCell;
