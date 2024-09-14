import { useLocation, useParams } from 'react-router-dom';
import useProductCategoryStore from '../../state/productCategoryState';
import useBenefitStore from '../../state/benefitState';
import useAccountStore from '../../state/accountState';
import { useEffect, useState } from 'react';
import { Autocomplete, Box, CardContent, Chip, FormControl, FormLabel, Input } from '@mui/joy';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FaTags } from "react-icons/fa";
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import { ManyToOneField } from '../common/Fields';
import Swal from 'sweetalert2';

export default function ProductCategoryForm() {
    const location = useLocation();
    const { id } = useParams();
    const [fetchData, setFetchData] = useState(true);

    const updateProductCategory = useProductCategoryStore((state) => state.updateProductCategory);
    const addProductCategory = useProductCategoryStore((state) => state.addProductCategory);
    const deleteProductCategory = useProductCategoryStore((state) => state.deleteProductCategory);
    const fetchProductCategory = useProductCategoryStore((state) => state.fetchProductCategory);
    const [productCategory, setProductCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const [benefits, fetchBenefits] = useBenefitStore((state) => [state.benefits, state.fetchBenefits]);
    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [benefs, setBenefs] = useState([]);
    const [incomeAccount, setIncomeAccount] = useState(null);
    const [expenseAccount, setExpenseAccount] = useState(null);

    console.log(productCategory);
    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !productCategory && id !== 'new'){
            fetchProductCategory(id).then((res) => {
              if(res.success){
                setProductCategory(res.data);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: t(res.error.message),
                  text: t(res.error.details),
                });
              }
            }).finally(() => setLoading(false));
        }
        if(fetchData){
            fetchBenefits();
            fetchAccounts();
            setFetchData(false);
        }
        if(productCategory){
            setName(name=>name||productCategory.name);
            setDescription(description=>description||productCategory.description);
            setBenefs(benefs=>benefs.length !== 0 ? benefs : productCategory.benefits);
            setIncomeAccount(incomeAccount=>incomeAccount||productCategory.incomeAccount);
            setExpenseAccount(expenseAccount=>expenseAccount||productCategory.expenseAccount);
        }
    }, [productCategory, fetchData, fetchBenefits, fetchAccounts, id, mode, fetchProductCategory]);

    const validateFields = [
      {type: "name", value: name, message: t("Please enter a valid name!")},
    ]

    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : productCategory && productCategory.id,
      name: name,
      description: description,
      benefits: benefs.map(benefit => {return {id: benefit.id}}),
      incomeAccount: incomeAccount && {id: incomeAccount.id},
      expenseAccount: expenseAccount && {id: expenseAccount.id}
    }
    const addFields = {
      name: name,
      description: description,
      benefits: benefs.map(benefit => {return {id: benefit.id}}),
      incomeAccount: incomeAccount && {id: incomeAccount.id},
      expenseAccount: expenseAccount && {id: expenseAccount.id}
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Subscription Category" mode={mode} setMode={setMode} validateFields={validateFields} updateFields={updateFields} addFields={addFields} 
      updateMethod={updateProductCategory} addMethod={addProductCategory} deleteMethod={deleteProductCategory} setRecord={setProductCategory}>
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
          <FormLabel>{t("Income Account")}</FormLabel>
          <ManyToOneField options={accounts} optionsFields={["code", "name"]} value={incomeAccount} setValue={setIncomeAccount} mode={mode} url="/accounts" />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Expense Account")}</FormLabel>
          <ManyToOneField options={accounts} optionsFields={["code", "name"]} value={expenseAccount} setValue={setExpenseAccount} mode={mode} url="/accounts" />
        </FormControl>


        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel>{t("Benefits")}</FormLabel>
          <Autocomplete 
            startDecorator={<FaTags />}
            multiple
            placeholder=""
            limitTags={4}
            options={benefits}
            getOptionLabel={(benefit) => benefit.name}
            //defaultValue={[]}
            disabled={mode === 'view'}
            onChange={(event, newValue) => setBenefs(newValue)}
            value={benefs}
            //sx={{ width: '500px' }}
            renderTags={(tags, getTagProps) =>
              tags.map((item, index) => (
                <Chip
                  variant="soft"
                  color="primary"
                  endDecorator={<Close fontSize="sm" />}
                  sx={{ minWidth: 0 }}
                  {...getTagProps({ index })}
                >
                  {item.name}
                </Chip>
              ))
            }
          />
        </FormControl>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        </CardContent>
      </FormBaseLayout> 
      </div>
    );
}