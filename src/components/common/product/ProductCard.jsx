import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Chip, Skeleton } from '@mui/joy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function ProductCard({ product }) {
  return (
    <Card sx={{ width: { xs: 1, sm: 1 , md: 1 }, height: { xs: 1, sm: 1, md: 1 } }}>
      <div>
        <Typography level="title-lg">{product.name}</Typography>
        <Typography level="body-sm">{product.category && product.category.name}</Typography>
        <Chip
            variant="soft"
            size="sm"
            startDecorator={<AutoAwesomeIcon />}
            color={'neutral'}>
            Trending
        </Chip>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <Skeleton variant="overlay" animation={false} children={product.category && product.category.name}>
        <img
          src={product.image}
          loading="lazy"
          alt=""
        />
        </Skeleton>
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total price:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {product.price} SR
          </Typography>
        </div>
        <Button
          variant="solid"
          size="md"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 , width: { xs: '50%', sm: 'auto' } }}
        >
          Explore
        </Button>
      </CardContent>
    </Card>
  );
}
