import useFitnessClassStore from "../../state/fitnessClassState";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Dropdown, Menu, MenuButton, MenuItem, Option, Select, useTheme } from '@mui/joy';
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, FormLabel, IconButton, Input, Typography } from '@mui/joy';
import { Add, MoreHoriz } from '@mui/icons-material';
import { SnackbarCustom } from '../common/Common';
import { BiNews } from "react-icons/bi";
import { GiSaveArrow } from 'react-icons/gi';
import { HtmlField } from "../common/Fields";


export default function FitnessClassForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/fitness-classes';
    }

    const updateFitnessClass = useFitnessClassStore((state) => state.updateFitnessClass);
    const addFitnessClass = useFitnessClassStore((state) => state.addFitnessClass);
    const deleteFitnessClass = useFitnessClassStore((state) => state.deleteFitnessClass);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [intensityLevel, setIntensityLevel] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const fitnessClass = location.state.object;
    const theme = useTheme();

    useEffect(() => {
        if(fitnessClass){
            setName(name=>name||fitnessClass.name);
            setIntensityLevel(intensityLevel=>intensityLevel||fitnessClass.intensityLevel);
            setDescription(description=>description||fitnessClass.description);
            setImages(images=>images||fitnessClass.images);
        }
    }, [mode, fitnessClass]);

    const handleSave = () => {
        updateFitnessClass({
            id: fitnessClass.id,
            name: name,
            intensityLevel: intensityLevel,
            description: description,
            images: images
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Fitness Class updated successfully'});
    }

    const handleAdd = () => {
        addFitnessClass({
            name: name,
            intensityLevel: intensityLevel,
            description: description,
            images: images
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Fitness Class added successfully'});
    }

    const handleDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this subscription?");
        if(confirm){
            deleteFitnessClass(fitnessClass.id);
            window.history.back();
        }
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Fitness Class deleted successfully'});
    }

    return (
    <div>
        <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        maxWidth: { xs: '100%', md: '80%' },
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '100%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 5, md: "auto" },
      }}
    >
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            Fitness Class Info
        </Typography>
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
          >
            <MoreHoriz />
          </MenuButton>
          <Menu size="sm" sx={{ minWidth: 140 }}>
            <MenuItem onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>Edit</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Move</MenuItem>
            <Divider />
            <MenuItem color="danger" onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Dropdown>
      </div>
      {/* <Divider inset="none" /> */}
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>Intensity Level</FormLabel>
          <Select value={intensityLevel} onChange={(e, newValue) => setIntensityLevel(newValue)} disabled={mode === 'view'}>
            <Option value="LOW">Low</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="HIGH">High</Option>
        </Select>
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>Description</FormLabel>
          <HtmlField value={description} setValue={setDescription} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>Images</FormLabel>
          <Input value={images} onChange={(e) => setImages(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        </CardContent>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        <CardActions sx={{ gridColumn: '1/-1' }}>
          {mode === 'add' &&
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<Add />} onClick={handleAdd}>
            Add Fitness Class
          </Button>}
          {mode === 'edit' &&
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<GiSaveArrow />} onClick={handleSave} >
            Save Fitness Class
          </Button>}
        </CardActions>

        </Card>

        </div>
    )


}
