import { useLocation, useParams } from 'react-router-dom';
import useProductCategoryStore from '../../state/productCategoryState';
import useBenefitStore from '../../state/benefitState';
import useAccountStore from '../../state/accountState';
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, CardContent, Chip, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { Add, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import { FaTags } from "react-icons/fa";
import FormBaseLayout from '../common/FormBaseLayout';

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
        if(id && mode !== 'add' && !productCategory){
            fetchProductCategory(id).then((data) => {
                setProductCategory(data);
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

    const handleSave = () => {
        updateProductCategory({id: productCategory.id,
            name: name,
            description: description,
            benefits: benefs.map(benefit => {return {id: benefit.id}}),
            incomeAccount: incomeAccount && {id: incomeAccount.id},
            expenseAccount: expenseAccount && {id: expenseAccount.id}
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Product Category Updated'), message: 'Product Category Updated'});
    }

    const handleAdd = () => {
        addProductCategory({
            name: name,
            description: description,
            benefits: benefs.map(benefit => {return {id: benefit.id}}),
            incomeAccount: incomeAccount && {id: incomeAccount.id},
            expenseAccount: expenseAccount && {id: expenseAccount.id}
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Product Category Added'), message: 'Product Category Added'});
    }

    const handleDelete = () => {
        const confirmDelete = window.confirm(t('Are you sure you want to delete this product category?'));
        if(confirmDelete){
            deleteProductCategory(productCategory.id);
            window.location.href = '/product-categories';
        }
        setOpenSnackbar(true);
        setSnack({type: 'success', title: t('Product Category Deleted'), message: 'Product Category Deleted'});
    }

    return (
      <FormBaseLayout loading={loading}>
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg">
            {t("Subscription Type")}
        </Typography>
        <div style={{ display: "flex", flexDirection:"row"}}>
          <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
          <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
          <Box flexGrow={1} width={4}/>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
          <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handleDelete} sx={{display: mode === 'view' && productCategory? 'none': 'none'}}>{t("DELETE")}</Button>
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
          <FormLabel>{t("Income Account")}</FormLabel>
          <Autocomplete 
          options={accounts} 
          getOptionLabel={(account) => account.code + ' - ' + account.name}
          value={incomeAccount} onChange={(event, newValue) => setIncomeAccount(newValue)}
          disabled={mode === 'view'}
          />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Expense Account")}</FormLabel>
          <Autocomplete 
          options={accounts} 
          getOptionLabel={(account) => account.code + ' - ' + account.name}
          value={expenseAccount} onChange={(event, newValue) => setExpenseAccount(newValue)}
          disabled={mode === 'view'}
          />
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
    );
}