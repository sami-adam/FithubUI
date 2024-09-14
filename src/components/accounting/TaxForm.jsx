import { useLocation, useParams } from 'react-router-dom';
import useTaxStore from '../../state/taxState';
import { useEffect, useState } from 'react';
import { CardContent, Checkbox, FormControl, FormLabel, Input } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import Swal from 'sweetalert2';

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
    const { id } = useParams();

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !tax && id !== 'new'){
            fetchTax(id).then((res) => {
              if(res.success){
                setTax(res.data);
              } else {
                Swal.fire({
                  title: t(res.error.message),
                  text: "error",
                  icon: t(res.error.details),
                  confirmButtonText: t('OK')
                });
              }
            }).finally(() => setLoading(false));
        }
        if(tax){
            setName(name=>name||tax.name);
            setCode(code=>code||tax.code);
            setRate(rate=>rate||tax.rate);
            setActive(active=>active||tax.active);
        }
    }, [tax, mode, id, fetchTax]);

    const validateFields = [
      {type: "name", value: name, message: t("Please enter a valid name!")},
      {type: "other", value: code, message: t("Please enter a valid code!")},
      {type: "number", value: rate, message: t("Please enter a valid rate!")},
    ]

    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : tax && tax.id,
      name: name,
      code: code,
      rate: rate,
      active: active
    }
    const addFields = {
      name: name,
      code: code,
      rate: rate,
      active: active
    }

    return (
    <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Tax" mode={mode} setMode={setMode} updateMethod={updateTax} addMethod={addTax} deleteMethod={deleteTax} validateFields={validateFields} 
      updateFields={updateFields} addFields={addFields} setRecord={setTax}>
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