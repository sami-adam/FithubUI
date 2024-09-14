import { useLocation, useParams } from 'react-router-dom';
import useProductStore from '../../state/productState';
import useProductCategoryStore from '../../state/productCategoryState';
import useTaxStore from '../../state/taxState';
import { useEffect, useState } from 'react';
import { Box, CardContent, FormControl, FormLabel, Input, Option, Select, Textarea, Typography } from '@mui/joy';
import ImageIcon from '@mui/icons-material/Image';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import { ManyToOneField } from '../common/Fields';
import { SnackbarCustom } from '../common/Common';
import Swal from 'sweetalert2';

export default function ProductForm() {
    const location = useLocation();
    const { id } = useParams();
    const updateProduct = useProductStore((state) => state.updateProduct);
    const addProduct = useProductStore((state) => state.addProduct);
    const deleteProduct = useProductStore((state) => state.deleteProduct);
    const fetchProduct = useProductStore((state) => state.fetchProduct);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [productCategories, fetchProductCategories] = useProductCategoryStore((state) => [state.productCategories, state.fetchProductCategories]);
    const [taxes, fetchTaxes] = useTaxStore((state) => [state.taxes, state.fetchTaxes]);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(null);
    const [tax, setTax] = useState(null);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [durationType, setDurationType] = useState("");
    const [fetchData, setFetchData] = useState(true);

    const {t} = useTranslation();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !product && id !== 'new'){
            fetchProduct(id).then((res) => {
              if(res.success){
                setProduct(res.data);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: t(res.error.message),
                  text: t(res.error.details),
                });
              }
            }).finally(() => setLoading(false));
        }
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
      }, [mode, fetchData, product, fetchProductCategories, fetchTaxes, id, fetchProduct]);

      const validateFields = [
        {type: "name", value: name, message: t("Please enter a valid name!")},
        {type: "other", value: category, message: t("Please select a valid category!")},
        {type: "other", value: durationType, message: t("Please select a valid duration type!")},
      ]
    
      const updateFields = {
        id: typeof id === 'string' && id !== 'new' ? id : product && product.id,
        category: category && {"id": category.id},
        tax: tax && {"id": tax.id},
        name: name,
        price: price,
        image: image,
        description: description,
        durationType: durationType
      }
      const addFields = {
        category: category && {"id": category.id},
        tax: tax && {"id": tax.id},
        name: name,
        price: price,
        image: image,
        description: description,
        durationType: durationType
      }
      
    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Subscription Type" mode={mode} setMode={setMode} validateFields={validateFields} updateFields={updateFields} addFields={addFields} 
      updateMethod={updateProduct} addMethod={addProduct} deleteMethod={deleteProduct} setRecord={setProduct}>
      </FormHeader>
      <FormBaseLayout loading={loading}>
      <SnackbarCustom open={openSnackbar} setOpen={setOpenSnackbar} type={snack.type} title={snack.title} message={snack.message} />
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
          <FormLabel>{t("Category")}</FormLabel>
          <ManyToOneField options={productCategories} optionsFields={["name"]} value={category} setValue={setCategory} mode={mode} url="/product-categories" />
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
          <ManyToOneField options={taxes} optionsFields={["name"]} value={tax} setValue={setTax} mode={mode} url="/taxes" />
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
      </CardContent>
    </FormBaseLayout>
    </div>
    );

}