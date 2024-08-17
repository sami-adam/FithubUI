import { useLocation } from 'react-router-dom';
import useProductCategoryStore from '../../state/productCategoryState';
import useBenefitStore from '../../state/benefitState';
import useAccountStore from '../../state/accountState';
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Card, CardContent, Chip, FormControl, FormLabel, Input, Typography, useTheme } from '@mui/joy';
import { Add, Close } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import { useTranslation } from 'react-i18next';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { SnackbarCustom } from '../common/Common';
import { PiDotDuotone } from "react-icons/pi";
import { FaTags } from "react-icons/fa";

export default function ProductCategoryForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/product-categories';
    }
    const [fetchData, setFetchData] = useState(true);

    const updateProductCategory = useProductCategoryStore((state) => state.updateProductCategory);
    const addProductCategory = useProductCategoryStore((state) => state.addProductCategory);
    const deleteProductCategory = useProductCategoryStore((state) => state.deleteProductCategory);

    const [benefits, fetchBenefits] = useBenefitStore((state) => [state.benefits, state.fetchBenefits]);
    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [benefs, setBenefs] = useState([]);
    const [incomeAccount, setIncomeAccount] = useState(null);
    const [expenseAccount, setExpenseAccount] = useState(null);

    const productCategory = location.state.object;
    console.log(productCategory);
    const theme = useTheme();
    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    useEffect(() => {
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
    }, [productCategory, fetchData, fetchBenefits, fetchAccounts]);

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
        <div style={{ width: "100%"}}>
    <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        //maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '80%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 5, md: "auto" },
      }}
    >
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            {t("Subscription Type")}
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
          <Input startDecorator={<PiDotDuotone />} value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Income Account")}</FormLabel>
          <Autocomplete startDecorator={<BiNews />} 
          options={accounts} 
          getOptionLabel={(account) => account.code + ' - ' + account.name}
          value={incomeAccount} onChange={(event, newValue) => setIncomeAccount(newValue)}
          disabled={mode === 'view'}
          />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Description")}</FormLabel>
          <Input startDecorator={<PiDotDuotone />} value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Expense Account")}</FormLabel>
          <Autocomplete startDecorator={<BiNews />} 
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
        </Card>
        </div>
    );
}