import * as React from 'react';

import { Input } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { FaRegCalendarAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill';
import { Box, Button, Typography, IconButton } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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


export function HtmlField({ value, setValue, disabled }) {
  return (
    <Box sx={{ padding: '16px', backgroundColor: 'background.level1', borderRadius: '8px' }}>
      <ReactQuill 
        value={value} 
        onChange={(newValue) => setValue(newValue)}
        readOnly={disabled}
        modules={{
          toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
          ],
        }}
        formats={[
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent',
          'link', 'image', 'video',
          'color', 'background' 
        ]}
        theme="snow" // Choose the Quill theme
      />
    </Box>
  );
};



export function OneToManyField({ defaultItems = [{ id: Date.now(), name: '' }] }) {
  const [items, setItems] = React.useState(defaultItems);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '' }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id, event) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, name: event.target.value } : item
    );
    setItems(updatedItems);
  };

  return (
    <Box sx={{ p: 2 }}>
      {items.map(item => (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Input
            label={`Item ${item.id}`}
            value={item.name}
            onChange={(event) => handleChange(item.id, event)}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <IconButton onClick={() => handleRemoveItem(item.id)} color="danger">
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        startDecorator={<AddIcon />}
        onClick={handleAddItem}
        variant="outlined"
        color="primary"
      >
        Add Item
      </Button>
    </Box>
  );
};
