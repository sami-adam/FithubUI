import { useLocation } from "react-router-dom";
import useJournalStore from "../../state/journalState";
import useAccountStore from "../../state/accountState";
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, FormLabel, Input, Option, Select, Typography } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { HiOutlineIdentification } from "react-icons/hi2";
import { BsFilePerson } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


export default function JournalForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/journals';
    }

    const updateJournal = useJournalStore((state) => state.updateJournal);
    const addJournal = useJournalStore((state) => state.addJournal);
    const deleteJournal = useJournalStore((state) => state.deleteJournal);

    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);
    const [fetchData, setFetchData] = useState(true);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [account, setAccount] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const journal = location.state.object;

    const {t} = useTranslation();

    const journalTypes = [
      'SALES', 'PURCHASE', 'PAYMENT', 'RECEIPT', 'JOURNAL'
    ]

    useEffect(() => {
        if(fetchData){
            fetchAccounts();
            setFetchData(false);
        }
        if(journal){
            setName(name=>name||journal.name);
            setCode(code=>code||journal.code);
            setDescription(description=>description||journal.description);
            setType(type=>type||journal.type);
            setAccount(account=>account||journal.account);
        }
      }, [mode, journal, fetchData]);

    const handleSave = () => {
        updateJournal({
            id: journal.id,
            name: name,
            code: code,
            description: description,
            type: type,
            account: account
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Journal updated successfully'});
    }

    const handleAdd = () => {
        addJournal({
            name: name,
            code: code,
            description: description,
            type: type,
            account: account
        });
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Journal added successfully'});
    }

    const handleDelete = () => {
        const confirm = window.confirm('Are you sure you want to delete this journal?');
        if(confirm){
            deleteJournal(journal.id);
            window.location.href = '/journals';
        }
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Journal deleted successfully'});
    }

    return (
        <div style={{ width:"100%"}}>
            <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '80%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 4, md: "auto" },
      }}
    >
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            {t("Journal Information")}
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
          <Input startDecorator={<BsFilePerson fontSize={18}/>} value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Code")}</FormLabel>
          <Input startDecorator={<HiOutlineIdentification fontSize={18} />} value={code} onChange={(e) => setCode(e.target.value)} disabled={mode === 'view'} />
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
            {journalTypes.map((type) => <Option value={type}>{t(type)}</Option>)}
          </Select>
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Account")}</FormLabel>
          <Autocomplete startDecorator={<InfoOutlinedIcon />}  
            options={accounts} getOptionLabel={(option) => `${option.code} - ${option.name}`}
            value={account} 
            onChange={(event, newValue) => setAccount(newValue)}
            disabled={mode === 'view'}
           />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input startDecorator={<InfoOutlinedIcon />} value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        </CardContent>

        </Card>

        </div>
    )
}