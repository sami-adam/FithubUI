import { useLocation } from 'react-router-dom';
import useBenefitStore from '../../state/benefitState';
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, FormLabel, Input, Typography, useTheme } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';

export default function BenefitForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/benefits';
    }

    const updateBenefit = useBenefitStore((state) => state.updateBenefit);
    const addBenefit = useBenefitStore((state) => state.addBenefit);
    const deleteBenefit = useBenefitStore((state) => state.deleteBenefit);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const benefit = location.state.object;
    const theme = useTheme();
    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    useEffect(() => {
        if(benefit){
            setName(name=>name||benefit.name);
            setDescription(description=>description||benefit.description);
        }
    }, [benefit]);

    const handleSave = () => {
        updateBenefit({id: benefit.id,
            name: name,
            description: description
        });
        setMode('view');

        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Benefit Updated'), message: 'Benefit Updated'});
    }

    const handleAdd = () => {
        addBenefit({
            name: name,
            description: description
        });
        setMode('view');

        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Benefit Added'), message: 'Benefit Added'});
    }

    const handleDelete = () => {
        const result = window.confirm(t('Delete this benefit?'));
        if(result){
            deleteBenefit(benefit.id);
            window.location.href = '/benefits';
        }

        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Benefit Deleted'), message: 'Benefit Deleted'});
    }

    return (
        <div style={{ width: "100%"}}>
    <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        //maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '80%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 5, md: "auto" },
      }}
    >
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            {t("Benefit")}
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
          <Input startDecorator={<InfoOutlinedIcon />} value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input startDecorator={<InfoOutlinedIcon />} value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        </CardContent>
        </Card>
        </div>
    )

}