import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Chip, Skeleton } from '@mui/joy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <Card sx={{ width: { xs: 1, sm: 1 , md: 1 }, height: { xs: 1, sm: 1, md: 1 } }}>
      <div>
        <Typography level="title-lg">{product.name}</Typography>
        <Typography level="body-sm">{product.category && t(product.category.name) + "(" + t(product.durationType) + ")"}</Typography>
        <Chip
            variant="soft"
            size="sm"
            startDecorator={<AutoAwesomeIcon />}
            color={'neutral'}>
            {t("Trending")}
        </Chip>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        {(product.image && <img src={product.image} loading="lazy" alt={product.name} />) || <Skeleton variant="overlay" animation={false}/> }
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">{t("Total price")}:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {product.price} {t("SAR")}
          </Typography>
        </div>
        <Button
          variant="soft"
          size="md"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 , width: { xs: '50%', sm: 'auto' } }}
          onClick={() => {navigate("/product-form", {state: {object: product}})}}
        >
          {t("Details")}
        </Button>
      </CardContent>
    </Card>
  );
}
