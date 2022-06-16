import { HeaderActionResponse } from "cdm/HeaderActionModel";
import { AbstractHeaderAction } from "components/headerActions/handlers/AbstractHeaderAction";
import React from "react";
import { ActionTypes, DataTypes, MetadataLabels } from "helpers/Constants";
import CalendarTimeIcon from "components/img/CalendarTime";

export default class DatetimeTypeHeaderAction extends AbstractHeaderAction {
  globalHeaderActionResponse: HeaderActionResponse;
  handle(headerActionResponse: HeaderActionResponse): HeaderActionResponse {
    this.globalHeaderActionResponse = headerActionResponse;
    this.addDatetimeType();
    return this.goNext(this.globalHeaderActionResponse);
  }
  private addDatetimeType() {
    const { hooks } = this.globalHeaderActionResponse;
    const { tableData, column } =
      this.globalHeaderActionResponse.headerMenuProps.headerProps;
    const checkBoxType = {
      onClick: (e: any) => {
        tableData.dispatch({
          type: ActionTypes.UPDATE_COLUMN_TYPE,
          columnId: column.id,
          dataType: DataTypes.CALENDAR_TIME,
        });
        hooks.setShowType(false);
        hooks.setExpanded(false);
      },
      icon: <CalendarTimeIcon />,
      label: MetadataLabels.CALENDAR_TIME,
    };
    this.globalHeaderActionResponse.buttons.push(checkBoxType);
  }
}
