import { useLocation } from 'react-router-dom';
import useProductStore from '../../state/productState';
import useProductCategoryStore from '../../state/productCategoryState';
import useTaxStore from '../../state/taxState';
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Divider, Dropdown, FormControl, FormLabel, IconButton, Input, Menu, MenuButton, MenuItem, Option, Select, Textarea, Typography, useTheme } from '@mui/joy';
import { Add, MoreHoriz } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import ImageIcon from '@mui/icons-material/Image';
import { GiSaveArrow } from "react-icons/gi";
import { NumericFormat } from 'react-number-format';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';

export default function ProductForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/products';
    }
    const updateProduct = useProductStore((state) => state.updateProduct);
    const addProduct = useProductStore((state) => state.addProduct);
    const deleteProduct = useProductStore((state) => state.deleteProduct);

    const [productCategories, fetchProductCategories] = useProductCategoryStore((state) => [state.productCategories, state.fetchProductCategories]);
    const [taxes, fetchTaxes] = useTaxStore((state) => [state.taxes, state.fetchTaxes]);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(null);
    const [tax, setTax] = useState(null);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [durationType, setDurationType] = useState("");
    const [fetchData, setFetchData] = useState(true);

    const product = location.state.object;
    const theme = useTheme();
    const {t} = useTranslation();

    useEffect(() => {
        if(mode !== 'view' && fetchData){
          fetchProductCategories();
          fetchTaxes();
          setFetchData(false);
        }
    
        if(product){
          console.log(product.durationType, typeof product.durationType);
            setName(name=>name||product.name);
            setImage(image=>image||product.image);
            setPrice(price=>price||product.price);
            setCategory(category=>category||product.category);
            setTax(tax=>tax||product.tax);
            setDescription(description=>description||product.description);
            setDurationType(durationType=>durationType||product.durationType);
        }
      }, [mode, fetchData, product, fetchProductCategories, fetchTaxes]);
    
    const handleSave = () => {
        updateProduct({
            id: product.id,
            category: category && {"id": category.id},
            tax: tax && {"id": tax.id},
            name: name,
            price: price,
            image: image,
            description: description,
            durationType: durationType
        });
        setMode('view');
    }

    const handleAdd = () => {
        addProduct({
            category: category && {"id": category.id},
            tax: tax && {"id": tax.id},
            name: name,
            price: price,
            image: image,
            description: description,
            durationType: durationType
        });
        setMode('view');
    }

    const handelDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this subscription?");
        if(confirm){
        deleteProduct(product.id);
        window.history.back();
        }
    }

    return (
        <>
    {/* <div>
      <IconButton onClick={() => window.history.back()}><ArrowBack/></IconButton>
    </div> */}
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
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            {t("Subscription Type")}
        </Typography>
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
          >
            <MoreHoriz />
          </MenuButton>
          <Menu size="sm" sx={{ minWidth: 140 }}>
            <MenuItem onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("Edit")}</MenuItem>
            <Divider />
            <MenuItem color="danger" onClick={handelDelete}>{t("Delete")}</MenuItem>
          </Menu>
        </Dropdown>
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
          <Input startDecorator={<InfoOutlinedIcon />} value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Category")}</FormLabel>
          <Autocomplete startDecorator={<InfoOutlinedIcon />}  
          options={productCategories} getOptionLabel={(option) => option.name}
          value={category} 
          onChange={(event, newValue) => setCategory(newValue)}
          disabled={mode === 'view'}
           />
        </FormControl>
        
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Price")}</FormLabel>
          <NumericFormat
            value={price}
            thousandSeparator
            customInput={Input} 
            startDecorator={<Typography variant="body2">SAR</Typography>}
            disabled={mode === 'view'}
            sx={{ border: 'none' }}
            onChange={(e) => setPrice(e.target.value.replace(',', ''))}
          />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Tax")}</FormLabel>
          <Autocomplete startDecorator={<BiNews />} 
          options={taxes} 
          getOptionLabel={(option) => option.name}
          value={tax} onChange={(event, newValue) => setTax(newValue)}
          disabled={mode === 'view'}
          />
        </FormControl>
        
        <FormControl></FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
            <FormLabel>{t("Description")}</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
            <FormLabel>{t("Duration")}</FormLabel>
            <Select value={durationType} onChange={(event, newValue) => setDurationType(newValue)} disabled={mode === 'view'} >
                <Option value="DAY">{t("Day")}</Option>
                <Option value="WEEK">{t("Week")}</Option>
                <Option value="MONTH">{t("Month")}</Option>
                <Option value="YEAR">{t("Year")}</Option>
            </Select>
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
            <FormLabel>{t("Image")}</FormLabel>
            <Input startDecorator={<ImageIcon />} value={image} onChange={(e) => setImage(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

      
        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        <CardActions sx={{ gridColumn: '1/-1' }}>
          {mode === 'add' &&
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<Add />} onClick={handleAdd}>
            {t("Add Subscription Type")}
          </Button>}
          {mode === 'edit' &&
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<GiSaveArrow />} onClick={handleSave} >
            {t("Save Subscription type")}
          </Button>}
        </CardActions>
      </CardContent>
    </Card>
    </div>
    </>
    );

}