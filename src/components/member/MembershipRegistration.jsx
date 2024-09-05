import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Card, Stack, Typography, Divider } from '@mui/joy';
import VerifiedIcon from '@mui/icons-material/Verified';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useEffect, useState } from 'react';

import useProductCategoryStore from '../../state/productCategoryState';
import useProductStore from '../../state/productState';
import useBenefitStore from '../../state/benefitState';

export default function MembershipRegistration({ setProduct, setAmount }) {
  const [fetchData, setFetchData] = useState(true);
  const [productCategories, fetchProductCategories] = useProductCategoryStore((state) => [state.productCategories, state.fetchProductCategories]);
  const products = useProductStore((state) => state.products);
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
      {/* Product Categories Selection */}
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
          gap: 2,
          flexWrap: 'wrap',
          mb: 4,
          [`& .${radioClasses.checked}`]: {
            [`& .${radioClasses.action}`]: {
              inset: -2,
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
              boxShadow: 'md',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 3,
              minWidth: 240,
              width: 320,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              },
            }}
          >
            <Radio id={productCategory.id} value={productCategory.name} checkedIcon={<CheckCircleRoundedIcon />} />
            <FormLabel sx={{ fontSize: 20, fontWeight: 'bold' }} htmlFor={productCategory.name}>
              {productCategory.name}
            </FormLabel>
            <Stack direction="column" spacing={1} sx={{ display: 'flex', alignItems: "center", justifyContent: "flex-start" }}>
              {productCategory.benefits.map((benefit) => (
                <Typography key={benefit.id} startDecorator={<VerifiedIcon color='primary' sx={{ fontSize: 18 }} />} variant="body1">
                  {benefit.name}
                </Typography>
              ))}
              {benefits.filter(bf => !productCategory.benefits.map(b => b.id).includes(bf.id)).map((benefit) => (
                <Typography key={benefit.id} startDecorator={<RemoveCircleIcon color='danger' sx={{ fontSize: 18 }} />} variant="body1">
                  {benefit.name}
                </Typography>
              ))}
            </Stack>
          </Card>
        ))}
      </RadioGroup>

      <Divider sx={{ mb: 4 }} />

      {/* Product Selection */}
      <RadioGroup
        aria-label="platform"
        defaultValue="Website"
        overlay
        name="platform"
        onChange={handleProductChange}
        sx={{
          flexDirection: 'row',
          gap: 2,
          paddingTop: 2,
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          [`& .${radioClasses.checked}`]: {
            [`& .${radioClasses.action}`]: {
              inset: -2,
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
              boxShadow: 'md',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 3,
              minWidth: 240,
              width: 320,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 'lg',
              },
            }}
          >
            <Radio id={product.id} value={product.name} checkedIcon={<CheckCircleRoundedIcon />} />
            <FormLabel sx={{ fontSize: 20, fontWeight: 'bold' }} htmlFor={product.id}>
              {product.name}
            </FormLabel>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              {product.price && product.price.toLocaleString()} SAR
            </Typography>
          </Card>
        ))}
      </RadioGroup>
    </>
  );
}
