import { useLocation, useParams } from "react-router-dom";
import useAccountStore from "../../state/accountState";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, FormLabel, Input, Option, Select, Typography } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';
import FormBaseLayout from "../common/FormBaseLayout";


export default function AccountForm() {
    const { id } = useParams();
    const location = useLocation();

    const updateAccount = useAccountStore((state) => state.updateAccount);
    const addAccount = useAccountStore((state) => state.addAccount);
    const deleteAccount = useAccountStore((state) => state.deleteAccount);
    const fetchAccount = useAccountStore((state) => state.fetchAccount);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState(location.state && location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const {t} = useTranslation();

    const accountTypes = [
      'RECEIVABLE', 'BANk', 'CASH', 'PREPAYMENT', // Assets
      'PAYABLE', 'CREDIT_CARD', 'CURRENT_LIABILITIES', 'NON_CURRENT_LIABILITIES', // Liabilities
      'EQUITY', 'CURRENT_YEAR_EARNINGS', // Equity
      'INCOME', 'OTHER_INCOME', // Income
      'EXPENSE', 'COST_OF_REVENUE' // Expense
    ]

    useEffect(() => {
        if(id && mode !== 'add' && !account){
            fetchAccount(id).then((data) => {
                setAccount(data);
            }).finally(() => setLoading(false));
        }
        if(account){
            setName(name=>name||account.name);
            setCode(code=>code||account.code);
            setType(type=>type||account.type);
        }
      }, [mode, account, id]);

    const handleSave = () => {
        updateAccount({
            id: account.id,
            name: name,
            code: code,
            type: type
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Account updated successfully'});
    }

    const handleAdd = () => {
        addAccount({
            name: name,
            code: code,
            type: type
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Account added successfully'});
    }

    const handleDelete = () => {
        const confirm = window.confirm('Are you sure you want to delete this account?');
        if(confirm){
            deleteAccount(account.id);
            window.location.href = '/accounts';
        }
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Account deleted successfully'});
    }

    return (
      <FormBaseLayout loading={loading}>
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            {t("Account Information")}
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
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Code")}</FormLabel>
          <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Type")}</FormLabel>
          <Select 
            size="sm"
            placeholder={t("Select Type")}
            onChange={(event, newValue) => setType(newValue)}
            disabled={mode === 'view'}
            value={type}
            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}>
            {accountTypes.map((type) => <Option value={type}>{t(type)}</Option>)}
          </Select>
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Balance")}</FormLabel>
          <Input value={((account && account.balance) || 0).toLocaleString() + " " + t("SAR")} disabled />
        </FormControl>

        </CardContent>
        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        </FormBaseLayout>
    )
}