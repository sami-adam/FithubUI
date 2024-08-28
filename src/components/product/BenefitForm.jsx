import { useLocation, useParams } from 'react-router-dom';
import useBenefitStore from '../../state/benefitState';
import { useEffect, useState } from 'react';
import { Box, Button, CardContent, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import FormBaseLayout from '../common/FormBaseLayout';

export default function BenefitForm() {
    const location = useLocation();
    const updateBenefit = useBenefitStore((state) => state.updateBenefit);
    const addBenefit = useBenefitStore((state) => state.addBenefit);
    const deleteBenefit = useBenefitStore((state) => state.deleteBenefit);
    const fetchBenefit = useBenefitStore((state) => state.fetchBenefit);
    const [benefit, setBenefit] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
    const { id } = useParams();

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !benefit){
            fetchBenefit(id).then((data) => {
                setBenefit(data);
            }).finally(() => setLoading(false));
        }
        if(benefit){
            setName(name=>name||benefit.name);
            setDescription(description=>description||benefit.description);
        }
    }, [benefit, mode, id, fetchBenefit]);

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
      <FormBaseLayout loading={loading}>
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg">
            {t("Benefit")}
        </Typography>
        <div style={{ display: "flex", flexDirection:"row"}}>
          <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
          <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
          <Box flexGrow={1} width={4}/>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
          <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handleDelete} sx={{display: mode === 'view' && benefit? 'flex': 'none'}}>{t("DELETE")}</Button>
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
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        </CardContent>
      </FormBaseLayout>
    )

}