import { useLocation, useParams } from "react-router-dom";
import useJournalStore from "../../state/journalState";
import useAccountStore from "../../state/accountState";
import { useEffect, useState } from 'react';
import { CardContent, FormControl, FormLabel, Input, Option, Select } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import FormBaseLayout, { FormHeader } from "../common/FormBaseLayout";
import { ManyToOneField } from "../common/Fields";
import Swal from "sweetalert2";


export default function JournalForm() {
    const location = useLocation();
    const { id } = useParams();

    const updateJournal = useJournalStore((state) => state.updateJournal);
    const addJournal = useJournalStore((state) => state.addJournal);
    const deleteJournal = useJournalStore((state) => state.deleteJournal);
    const fetchJournal = useJournalStore((state) => state.fetchJournal);
    const [journal, setJournal] = useState(null);

    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);
    const [fetchData, setFetchData] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(true);

    const {t} = useTranslation();

    const journalTypes = [
      'SALES', 'PURCHASE', 'PAYMENT', 'RECEIPT', 'JOURNAL'
    ]

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !journal){
            fetchJournal(id).then((res) => {
              if(res.success){
                setJournal(res.data);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: t(res.error.message),
                  text: t(res.error.details)
                });
              }
            }).finally(() => setLoading(false));
        }
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
      }, [mode, journal, fetchData, id, fetchJournal, fetchAccounts]);

      const validateFields = [
        {type: "name", value: name, message: t("Please enter a valid name!")},
        {type: "other", value: code, message: t("Please enter a valid code!")},
        {type: "other", value: type, message: t("Please select a valid type!")},
        {type: "other", value: account, message: t("Please select a valid account!")}
      ]
      const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : journal && journal.id,
      name: name,
      code: code,
      description: description,
      type: type,
      account: account
    }
    const addFields = {
      name: name,
      code: code,
      description: description,
      type: type,
      account: account
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Journal Information" mode={mode} setMode={setMode} validateFields={validateFields} updateFields={updateFields} 
      addFields={addFields} updateMethod={updateJournal} addMethod={addJournal} deleteMethod={deleteJournal} setRecord={setJournal}>
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
           <ManyToOneField options={accounts} optionsFields={["code", "name"]} value={account} setValue={setAccount} mode={mode} url="/accounts" />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        </CardContent>

      </FormBaseLayout>
      </div>
    )
}