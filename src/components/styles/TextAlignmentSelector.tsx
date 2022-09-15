import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TextAlignmentProps } from "cdm/StyleModel";
import { COLUMN_ALIGNMENT_OPTIONS } from "helpers/Constants";

export default function TextAlignmentSelector(props: TextAlignmentProps) {
  const { modal, columnKey } = props;
  const { view } = modal;
  const [alignment, setAlignment] = React.useState("left");

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      // Persist changes
      await view.diskConfig.updateColumnConfig(columnKey, {
        content_alignment: newAlignment,
      });
      modal.enableReset = true;
      setAlignment(newAlignment);
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.LEFT}
          aria-label="left aligned"
        >
          <FormatAlignLeftIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.CENTER}
          aria-label="centered"
        >
          <FormatAlignCenterIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.RIGHT}
          aria-label="right aligned"
        >
          <FormatAlignRightIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
