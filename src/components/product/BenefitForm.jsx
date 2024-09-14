import { useLocation, useParams } from 'react-router-dom';
import useBenefitStore from '../../state/benefitState';
import { useEffect, useState } from 'react';
import { Box, CardContent, FormControl, FormLabel, Input } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import Swal from 'sweetalert2';

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
    const { id } = useParams();

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !benefit && id !== 'new'){
            fetchBenefit(id).then((res) => {
              if(res.success){
                setBenefit(res.data);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: t(res.error.message),
                  text: t(res.error.details),
                });
              }
            }).finally(() => setLoading(false));
        }
        if(benefit){
            setName(name=>name||benefit.name);
            setDescription(description=>description||benefit.description);
        }
    }, [benefit, mode, id, fetchBenefit]);

    const validateFields = [
      {type: "name", value: name, message: t("Please enter a valid name!")},
    ]
    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : benefit && benefit.id,
      name: name,
      description: description
    }
    const addFields = {
      name: name,
      description: description
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Benefit" mode={mode} setMode={setMode} validateFields={validateFields} updateFields={updateFields} addFields={addFields} 
        updateMethod={updateBenefit} addMethod={addBenefit} deleteMethod={deleteBenefit} setRecord={setBenefit}>
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

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        </CardContent>
      </FormBaseLayout>
      </div>
    )

}