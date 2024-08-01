import * as React from 'react';

import { Button } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { FaRegCalendarAlt } from "react-icons/fa";
import Box from '@mui/joy/Box';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill';

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


export function HtmlField() {
  const [value, setValue] = React.useState('');

  return (
    <Box sx={{ padding: '16px', backgroundColor: 'background.level1', borderRadius: '8px' }}>
      <ReactQuill 
        value={value} 
        onChange={setValue} 
        modules={{
          toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            ['clean']
          ],
        }}
        formats={[
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent',
          'link', 'image', 'video'
        ]}
        theme="snow" // Choose the Quill theme
      />
    </Box>
  );
};

