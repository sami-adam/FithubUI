import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Card, Stack, Typography } from '@mui/joy';
import { Check } from '@mui/icons-material';
import useProductCategoryStore from '../../state/productCategoryState';
import useProductStore from '../../state/productState';
import useMembershipStore from '../../state/membershipState';
import useBenefitStore from '../../state/benefitState';
import { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function MembershipRegistration({ setProduct, setAmount}) {
  const [fetchData, setFetchData] = useState(true);
  const [productCategories, fetchProductCategories] = useProductCategoryStore((state) => [state.productCategories, state.fetchProductCategories]);
  const products = useProductStore((state) => state.products);
  const [productCategory, setProductCategory] = useState('');
  //const [product, setProduct] = useState('');
  const [benefits, fetchBenefits] = useBenefitStore((state) => [state.benefits, state.fetchBenefits]);

  const searchProducts = useProductStore((state) => state.searchProducts);

  useEffect(() => {
    if (fetchData) {
      fetchProductCategories();
      searchProducts("XZ");
      fetchBenefits();
      setFetchData(false);
    }
  }, [fetchData, fetchProductCategories, searchProducts, fetchBenefits]);
    const handleProductChange = (event) => {
      setProduct(event.target.value);
      setAmount(products.find((p) => p.name === event.target.value).price);
    }


  return (
    <>
    <RadioGroup
      aria-label="platform"
      defaultValue="Website"
      overlay
      name="platform"
      onChange={(event) => searchProducts(event.target.value)}
      sx={{
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: '3px solid',
            borderColor: 'primary.500',
          },
        },
        [`& .${radioClasses.radio}`]: {
          display: 'contents',
          '& > svg': {
            zIndex: 2,
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            bgcolor: 'background.surface',
            borderRadius: '50%',
          },
        },
      }}
    >
      {productCategories.map((productCategory) => (
        <Card
          key={productCategory.id}
          variant="outlined"
          sx={{
            borderRadius: 'md',
            boxShadow: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            //gap: 1.5,
            //p: 2,
            minWidth: 120,
            width: 300,
          }}
        >
          <Radio id={productCategory.id} value={productCategory.name} checkedIcon={<CheckCircleRoundedIcon/>}/>
          <FormLabel sx={{fontSize:18}} htmlFor={productCategory.name}><Typography fontWeight="bold">{productCategory.name}</Typography></FormLabel>
            <Stack direction="column" spacing={0.5} sx={{ display: 'flex', alignItems: "center", justifyContent: "flex-start" }}>
                <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                  {productCategory.benefits.map((benefit) => 
                <Typography startDecorator={<VerifiedIcon color='text.primary' sx={{ fontSize:18 }}/>} variant="contained" color="text.primary" >{benefit.name}</Typography>
                )}
                  {benefits.filter(bf => !productCategory.benefits.map(b => b.id).includes(bf.id)).map((benefit) =>
                <Typography startDecorator={<RemoveCircleIcon color='danger' sx={{ fontSize:18 }}/>} variant="contained" color="text.primary" >{benefit.name}</Typography>
                )}
                </div>
            </Stack>
        </Card>
      ))}
    </RadioGroup>

    <RadioGroup
      aria-label="platform"
      defaultValue="Website"
      overlay
      name="platform" 
      onChange={handleProductChange}
      sx={{
        flexDirection: 'row',
        gap: 1,
        paddingTop: 2,
        display: 'flex',
        justifyContent: 'center',
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: '3px solid',
            borderColor: 'primary.500',
          },
        },
        [`& .${radioClasses.radio}`]: {
          display: 'contents',
          '& > svg': {
            zIndex: 2,
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            bgcolor: 'background.surface',
            borderRadius: '50%',
          },
        },
      }}
    >
      {products.map((product) => (
        <Card
          key={product.id}
          variant="outlined"
          sx={{
            borderRadius: 'md',
            boxShadow: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            minWidth: 200,
            width: 300,
          }}
        >
          <Radio id={product.id} value={product.name} checkedIcon={<CheckCircleRoundedIcon />} />
          <FormLabel sx={{ fontSize: 18}} htmlFor={product.id}>{product.name}</FormLabel>

          <div>
            <Typography variant="contained" color="primary" startDecorator={<Typography>SAR</Typography>}>
              {product.price&&product.price.toLocaleString()}
            </Typography>
          </div>
        </Card>
      ))}
    </RadioGroup>

    </>
  );
}