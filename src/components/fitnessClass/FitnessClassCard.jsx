import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { CardOverflow, Chip, Skeleton } from '@mui/joy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import Carousel from '../common/Carousel';

export default function FitnessClassCard({ fitnessClass }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: { xs: 1, sm: 1 , md: 1 }, height: { xs: 1, sm: 1, md: 1 }, maxWidth: {xs: 1, sm: 1, md:"25%"} }}>
      <div>
        <Typography level="title-lg">{fitnessClass.name}</Typography>
        <Typography level="body-sm">{fitnessClass.intensityLevel}</Typography>
        <Chip
            variant="soft"
            size="sm"
            startDecorator={<AutoAwesomeIcon />}
            color={'neutral'}>
            Trending
        </Chip>
      </div>
        <AspectRatio minHeight="120px" maxHeight="200px">
            {(fitnessClass.images && 
            <Carousel items={fitnessClass.images.split(",").map((image) => ({image: image, title: fitnessClass.name}))} />
        ) 
            || <Skeleton variant="overlay" animation={false}/> }
        </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Intensity Level:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {fitnessClass.intensityLevel} 
          </Typography>
        </div>
        <Button
          variant="soft"
          size="md"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 , width: { xs: '50%', sm: 'auto' } }}
          onClick={() => {navigate("/fitness-class-form", {state: {object: fitnessClass}})}}
        >
          Details
        </Button>
      </CardContent>
    </Card>
  );
}
