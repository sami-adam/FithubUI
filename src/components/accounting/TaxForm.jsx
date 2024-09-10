import { useLocation, useParams } from 'react-router-dom';
import useTaxStore from '../../state/taxState';
import { useEffect, useState } from 'react';
import { Box, Button, CardContent, Checkbox, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';

export default function TaxForm(){
    const location = useLocation();
    const updateTax = useTaxStore((state) => state.updateTax);
    const addTax = useTaxStore((state) => state.addTax);
    const deleteTax = useTaxStore((state) => state.deleteTax);
    const fetchTax = useTaxStore((state) => state.fetchTax);
    const [tax, setTax] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [rate, setRate] = useState(0);
    const [active, setActive] = useState(true);

    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
    const { id } = useParams();

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !tax){
            fetchTax(id).then((data) => {
                setTax(data);
            }).finally(() => setLoading(false));
        }
        if(tax){
            setName(name=>name||tax.name);
            setCode(code=>code||tax.code);
            setRate(rate=>rate||tax.rate);
            setActive(active=>active||tax.active);
        }
    }, [tax, mode, id, fetchTax]);

    const handleSave = () => {
        updateTax({id: tax.id,
            name: name,
            code: code,
            rate: rate,
            active: active
        });
        setMode('view');

        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Tax Updated'), message: 'Tax Updated'});
    }

    const handleAdd = () => {
        addTax({
            name: name,
            code: code,
            rate: rate,
            active: active
        });
        setMode('view');

        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Tax Added'), message: 'Tax Added'});
    }

    const handleDelete = () => {
        const result = window.confirm(t('Delete this tax?'));
        if(result){
            deleteTax(tax.id);
            window.location.href = '/taxes';
        }

        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Tax Deleted'), message: 'Tax Deleted'});
    }

    return (
    <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading}>
        {/* <Divider inset="none" /> */}
        <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
          <Typography level="title-lg">
              {t("Tax")}
          </Typography>
          <div style={{ display: "flex", flexDirection:"row"}}>
            <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
            <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
            <Box flexGrow={1} width={4}/>
            <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
            <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
            <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handleDelete} sx={{display: mode === 'view' && tax? 'flex': 'none'}}>{t("DELETE")}</Button>
          </div>
        </div>
        {/* <Divider inset="none" /> */}
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
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Code")}</FormLabel>
          <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Rate")}</FormLabel>
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Active")}</FormLabel>
          <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)} disabled={mode === 'view'} />
        </FormControl>

    </CardContent>
    </FormBaseLayout>
    </div>
    )

}