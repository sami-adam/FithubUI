import { useLocation, useParams } from "react-router-dom";
import useAccountStore from "../../state/accountState";
import { useEffect, useState } from 'react';
import { Box, CardContent, FormControl, FormLabel, Input, Option, Select } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import FormBaseLayout, { FormHeader } from "../common/FormBaseLayout";
import Swal from "sweetalert2";


export default function AccountForm() {
    const { id } = useParams();
    const location = useLocation();

    const updateAccount = useAccountStore((state) => state.updateAccount);
    const addAccount = useAccountStore((state) => state.addAccount);
    const deleteAccount = useAccountStore((state) => state.deleteAccount);
    const fetchAccount = useAccountStore((state) => state.fetchAccount);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode)||'view');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState('');
    const {t} = useTranslation();

    const accountTypes = [
      'RECEIVABLE', 'BANk', 'CASH', 'PREPAYMENT', // Assets
      'PAYABLE', 'CREDIT_CARD', 'CURRENT_LIABILITIES', 'NON_CURRENT_LIABILITIES', // Liabilities
      'EQUITY', 'CURRENT_YEAR_EARNINGS', // Equity
      'INCOME', 'OTHER_INCOME', // Income
      'EXPENSE', 'COST_OF_REVENUE' // Expense
    ]

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !account && id !== 'new'){
            fetchAccount(id).then((res) => {
              if(res.success){
                setAccount(res.data);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: t(res.error.message),
                  text: t(res.error.details)
                });
              }
            }).finally(() => setLoading(false));
        }
        if(account){
            setName(name=>name||account.name);
            setCode(code=>code||account.code);
            setType(type=>type||account.type);
        }
      }, [mode, account, id, fetchAccount]);

    const validateFields = [
      {type: "name", value: name, message: t("Please enter a valid name!")},
      {type: "number", value: code, message: t("Please enter a valid code!")},
      {type: "other", value: type, message: t("Please select a valid type!")}
    ]

    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : account && account.id,
      name: name,
      code: code,
      type: type
    }
   
    const addFields = {
      name: name,
      code: code,
      type: type
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Account Information" mode={mode} setMode={setMode} updateMethod={updateAccount} addMethod={addAccount} 
      deleteMethod={deleteAccount} updateFields={updateFields} addFields={addFields} setRecord={setAccount} validateFields={validateFields}>
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
      </div>
    )
}