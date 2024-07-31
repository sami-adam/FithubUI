import * as React from 'react';

import { Button } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { FaRegCalendarAlt } from "react-icons/fa";

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined" color='neutral'
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      sx={{display: "flex", justifyContent: "flex-start", color: 'var(--color-neutral-800)'}}
      onClick={() => setOpen?.((prev) => !prev)} startDecorator={<FaRegCalendarAlt fontSize={18}/>}
    >
      {label ? `${label}` : 'MM/DD/YYYY'}
    </Button>
  );
}

export function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      slots={{ ...props.slots, field: ButtonField }}
      slotProps={{ ...props.slotProps, field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}
