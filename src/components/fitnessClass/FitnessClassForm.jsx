import useFitnessClassStore from "../../state/fitnessClassState";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import {  IconButton, Option, Select } from '@mui/joy';
import { Box, Button, CardContent, FormControl, FormLabel, Input } from '@mui/joy';
import { AddCircle } from '@mui/icons-material';
import { HtmlField } from "../common/Fields";
import { useTranslation } from "react-i18next";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormBaseLayout, { FormHeader } from "../common/FormBaseLayout";
import Swal from "sweetalert2";


export default function FitnessClassForm() {
    const location = useLocation();
    const { id } = useParams();

    const updateFitnessClass = useFitnessClassStore((state) => state.updateFitnessClass);
    const addFitnessClass = useFitnessClassStore((state) => state.addFitnessClass);
    const deleteFitnessClass = useFitnessClassStore((state) => state.deleteFitnessClass);
    const fetchFitnessClass = useFitnessClassStore((state) => state.fetchFitnessClass);
    const [fitnessClass, setFitnessClass] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');
    const {t} = useTranslation();

    const [name, setName] = useState('');
    const [intensityLevel, setIntensityLevel] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !fitnessClass && id !== 'new'){
            fetchFitnessClass(id).then((res) => {
              if(res.success){
                setFitnessClass(res.data);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: t(res.error.message),
                  text: t(res.error.details),
                });
              }
            }).finally(() => setLoading(false));
        }
        if(fitnessClass){
            setName(name=>name||fitnessClass.name);
            setIntensityLevel(intensityLevel=>intensityLevel||fitnessClass.intensityLevel);
            setDescription(description=>description||fitnessClass.description);
            setImages(images=> images.length > 0 ? images : fitnessClass.images);
        }
    }, [mode, fitnessClass, id, fetchFitnessClass]);

    const validateFields = [
      {type: "name", value: name, message: t("Please enter a valid name!")},
      {type: "other", value: intensityLevel, message: t("Please select a valid intensity level!")},
    ]
    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : fitnessClass && fitnessClass.id,
      name: name,
      intensityLevel: intensityLevel,
      description: description,
      images: images.map(image => { return {"id": image.id, "url": image.url}}),
    }
    const addFields = {
      name: name,
      intensityLevel: intensityLevel,
      description: description,
      images: images.map(image => { return {"url": image.url}}),
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
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Fitness Class Information" mode={mode} setMode={setMode} validateFields={validateFields} updateFields={updateFields} addFields={addFields} 
      updateMethod={updateFitnessClass} addMethod={addFitnessClass} deleteMethod={deleteFitnessClass} setRecord={setFitnessClass}>
      </FormHeader>
      <FormBaseLayout loading={loading}>
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
      </div>
    )


}
