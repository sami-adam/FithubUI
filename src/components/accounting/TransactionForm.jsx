import { useLocation, useParams } from "react-router-dom";
import useTransactionStore from "../../state/transactionState";
import useJournalStore from "../../state/journalState";
import useAccountStore from "../../state/accountState";
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, FormLabel, IconButton, Input, Option, Select, Typography } from '@mui/joy';
import { Add, AddCircle } from '@mui/icons-material';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { DeleteOutlined } from "@ant-design/icons";
import FormBaseLayout from "../common/FormBaseLayout";


export default function TransactionForm() {
    const location = useLocation();
    const { id } = useParams();
    const [fetchData, setFetchData] = useState(true);

    const updateTransaction = useTransactionStore((state) => state.updateTransaction);
    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
    const postTransaction = useTransactionStore((state) => state.postTransaction);

    const [journals, fetchJournals] = useJournalStore((state) => [state.journals, state.fetchJournals]);
    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);

    const fetchTransaction = useTransactionStore((state) => state.fetchTransaction);
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState(location.state && location.state.viewMode||'view');

    const [journal, setJournal] = useState(null);
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const {t} = useTranslation();

    useEffect(() => {
        if(id && mode !== 'add' && !transaction){
            fetchTransaction(id).then((data) => {
                setTransaction(data);
            }).finally(() => setLoading(false));
        }
        if(fetchData){
            fetchJournals();
            fetchAccounts();
            setFetchData(false);
        }
        if(transaction){
            setJournal(journal=>journal||transaction.journal);
            setDescription(description=>description||transaction.description);
            setEntries(entries=>entries.length > 0 ? entries :transaction.entries);
        }
      }, [mode, transaction, fetchData, fetchJournals, fetchAccounts]);

    const handleSave = () => {
        updateTransaction({
            id: transaction.id,
            journal: journal,
            description: description,
            entries: entries.map(entry => { return {"id": entry.id,"account": {"id": entry.account.id}, "transaction": {"id": transaction.id}, "type": entry.type, "debit": entry.debit, "credit": entry.credit}}),
            status: 'DRAFT'
        });
        setSnack({type: 'success', title: 'Success', message: 'Transaction updated successfully!'});
        setOpenSnackbar(true);
        setMode('view');
    }

    const handleAdd = async () => {
        const addedTransaction = addTransaction({
            journal: journal,
            description: description,
            timestamp: new Date(),
            entries: entries.map(entry => { return {"account": {"id": entry.account&&entry.account.id},"transaction": {"id": transaction&&transaction.id},  "type": entry.type, "debit": entry.debit, "credit": entry.credit}}),
            status: 'DRAFT'
        });
        setTransaction(await addedTransaction);
        setSnack({type: 'success', title: 'Success', message: 'Transaction added successfully!'});
        setOpenSnackbar(true);
        setMode('view');
    }

    const handleDelete = () => {
        deleteTransaction(transaction.id);
        setSnack({type: 'success', title: 'Success', message: 'Transaction deleted successfully!'});
        setOpenSnackbar(true);
        setMode('view');
    }

    const handleTransactionPost = () => {
        if(!transaction.id){
            setSnack({type: 'error', title: 'Error', message: 'Transaction not found!'});
            setOpenSnackbar(true);
            return;
        }
        postTransaction({"id": transaction.id});
        setSnack({type: 'success', title: 'Success', message: 'Transaction posted successfully!'});
        setOpenSnackbar(true);
        setMode('view');
    }

    const handleAddEntry = () => {
        setEntries([...entries, { id: Date.now(), name: '' }]);
      };
    
    const handleRemoveEntry = (id) => {
      setEntries(entries.filter(entry => entry.id !== id));
    };
  
    const handleChangeEntry = (id, account, type, debit, credit) => {
      const updatedEntries = entries.map(entry => 
          entry.id === id ? { ...entry, account: account||entry.account, type: type||entry.type, debit: debit||entry.debit, credit: credit||entry.credit } : entry
      );
      setEntries(updatedEntries);
    };

    return (
      <FormBaseLayout loading={loading}>
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg">
            {t("Transaction Information")}
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
        <div>
        <Button variant="soft" onClick={handleTransactionPost} 
          startDecorator={<FaMoneyBillTransfer fontSize={18}/>} 
          sx={{display: (mode === 'view'&& transaction && transaction.status === "DRAFT")? 'flex': 'none'}}>{t("POST")}</Button>
        </div>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Journal")}</FormLabel>
          <Autocomplete 
          options={journals} 
          getOptionLabel={(option) => option.name}
          value={journal} onChange={(event, newValue) => setJournal(newValue)}
          disabled={mode === 'view'}
          />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>{t("Entries")}</FormLabel>
          <Box sx={{ p: 2 }}>
            {entries.length > 0 && entries.map(entry => (
                <Box key={entry.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControl sx={{ width: "45%"}}>
                <Autocomplete
                    options={accounts} 
                    getOptionLabel={(account) => account.code + ' - ' + account.name}
                    value={entry.account} onChange={(event, newValue) => handleChangeEntry(entry.id, newValue, null, null, null)}
                    disabled={mode === 'view'}
                    sx={{ mr: 1}}
                    />
                </FormControl>
                <FormControl sx={{ width: "15%"}}>
                <Select 
                    value={entry.type} 
                    onChange={(e, newValue) => handleChangeEntry(entry.id, null, newValue, null, null)}
                    disabled={mode === 'view'}
                    sx={{ flexGrow: 1, mr: 1}}
                    >
                    <Option value="DEBIT">{t("Debit")}</Option>
                    <Option value="CREDIT">{t("Credit")}</Option>
                </Select>
                </FormControl>
                <FormControl sx={{ width: "15%"}}>
                <Input
                    label={`Debit ${entry.id}`}
                    value={entry.debit}
                    onChange={(event) => handleChangeEntry(entry.id, null, null, event.target.value, null)}
                    sx={{ flexGrow: 1, mr: 1}}
                    disabled={mode === 'view'}
                />
                </FormControl>
                <FormControl sx={{ width: "15%"}}>
                <Input
                    label={`Credit ${entry.id}`}
                    value={entry.credit}
                    onChange={(event) => handleChangeEntry(entry.id, null, null, null, event.target.value)}
                    sx={{ flexGrow: 1, mr: 1}}
                    disabled={mode === 'view'}
                    />
                </FormControl>
                <IconButton onClick={() => handleRemoveEntry(entry.id)} color="danger" disabled={mode === 'view'}>
                    <DeleteOutlined />
                </IconButton>
                </Box>
            ))}
            <Button
                startDecorator={<AddCircle />}
                onClick={handleAddEntry}
                variant="outlined"
                color="primary"
                disabled={mode === 'view'}
            >
                {t("Add Entry")}
            </Button>
            </Box>
        </FormControl>

        </CardContent>
        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        </FormBaseLayout>
    );
    
}

