import useFitnessClassStore from "../../state/fitnessClassState";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import {  IconButton, Option, Select, useTheme } from '@mui/joy';
import { Box, Button, Card, CardContent, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { Add, AddCircle } from '@mui/icons-material';
import { SnackbarCustom } from '../common/Common';
import { HtmlField } from "../common/Fields";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormBaseLayout from "../common/FormBaseLayout";


export default function FitnessClassForm() {
    const location = useLocation();
    const { id } = useParams();

    const updateFitnessClass = useFitnessClassStore((state) => state.updateFitnessClass);
    const addFitnessClass = useFitnessClassStore((state) => state.addFitnessClass);
    const deleteFitnessClass = useFitnessClassStore((state) => state.deleteFitnessClass);
    const fetchFitnessClass = useFitnessClassStore((state) => state.fetchFitnessClass);
    const [fitnessClass, setFitnessClass] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState(location.state && location.state.viewMode||'view');
    const {t} = useTranslation();

    const [name, setName] = useState('');
    const [intensityLevel, setIntensityLevel] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const theme = useTheme();

    useEffect(() => {
        if(id && mode !== 'add' && !fitnessClass){
            fetchFitnessClass(id).then((data) => {
                setFitnessClass(data);
            }).finally(() => setLoading(false));
        }
        if(fitnessClass){
            setName(name=>name||fitnessClass.name);
            setIntensityLevel(intensityLevel=>intensityLevel||fitnessClass.intensityLevel);
            setDescription(description=>description||fitnessClass.description);
            setImages(images=> images.length > 0 ? images : fitnessClass.images);
        }
    }, [mode, fitnessClass]);

    const handleSave = () => {
        updateFitnessClass({
            id: fitnessClass.id,
            name: name,
            intensityLevel: intensityLevel,
            description: description,
            images: images.map(image => { return {"id": image.id, "url": image.url}}),
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
            images: images.map(image => { return {"url": image.url}}),
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

    const handleAddImage = () => {
      setImages([...images, { url: '' }]);
      };
    
    const handleRemoveImage = (id) => {
      setImages(images.filter(image => image.id !== id));
    };

    const handleChangeImage = (id, url) => {
      const updatedImages = images.map(image => 
          image.id === id ? { ...image, url: url||image.url } : image
      );
      setImages(updatedImages);
    };

    return (
      <FormBaseLayout loading={loading}>
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg">
            {t("Fitness Class Information")}
        </Typography>
        <div style={{ display: "flex", flexDirection:"row"}}>
          <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
          <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
          <Box flexGrow={1} width={4}/>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
          <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
        </div>
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
          <FormLabel>{t("Name")}</FormLabel>
          <Input value={t(name)} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Intensity Level")}</FormLabel>
          <Select value={intensityLevel} onChange={(e, newValue) => setIntensityLevel(newValue)} disabled={mode === 'view'}>
            <Option value="LOW">{t("Low")}</Option>
            <Option value="MEDIUM">{t("Medium")}</Option>
            <Option value="HIGH">{t("High")}</Option>
        </Select>
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <HtmlField value={description} setValue={setDescription} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>{t("Images")}</FormLabel>
          <Box sx={{ p: 2 }}>
            {typeof(images) === "object" && images.length > 0 && images.map(image => (
                <Box key={image.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                
                <FormControl sx={{ width: "50%"}}>
                <Input
                    label={`URL ${image.id}`}
                    value={image.url}
                    onChange={(event) => handleChangeImage(image.id, event.target.value)}
                    sx={{ flexGrow: 1, mr: 1}}
                    disabled={mode === 'view'}
                />
                </FormControl>
      
                <IconButton onClick={() => handleRemoveImage(image.id)} color="danger" disabled={mode === 'view'}>
                    <DeleteOutlineIcon />
                </IconButton>
                </Box>
            ))}
            <Button
                startDecorator={<AddCircle />}
                onClick={handleAddImage}
                variant="outlined"
                color="primary"
                disabled={mode === 'view'}
            >
                {t("Add Image")}
            </Button>
            </Box>
        </FormControl>

        </CardContent>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />

      </FormBaseLayout>
    )


}
