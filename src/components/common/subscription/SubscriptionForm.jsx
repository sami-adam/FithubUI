import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PortraitIcon from '@mui/icons-material/Portrait';
import { AiOutlineNumber } from "react-icons/ai";
import { Autocomplete } from '@mui/joy';
import { BiNews } from "react-icons/bi";
import { useEffect, useRef, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import useMemberStore from '../../../state/memberState';
import useProductStore from '../../../state/productState';
import { ButtonDatePicker } from '../Fields';
import dayjs from 'dayjs';
import { useTheme } from '@emotion/react';
import { Add } from '@mui/icons-material';


export default function SubscriptionForm() {
  const [members, fetchMembers] = useMemberStore((state) => [state.members, state.fetchMembers]);
  const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);

  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(null);

  const inputRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    fetchMembers();
    fetchProducts();
  }, [fetchMembers, fetchProducts]);

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        //maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '50%' },
        mt: { xs: 8, md: 4 },
        ml: { xs: 8, md: "auto" },
      }}
    >
      <Typography level="title-lg" startDecorator={<InfoOutlined />}>
        Add Subscription
      </Typography>
      <Divider inset="none" />
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl  size="sm" sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>Member</FormLabel>
          <Autocomplete startDecorator={<PortraitIcon />}  options={members} getOptionLabel={(option) => option.firstName + " " + option.lastName} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>Subscription</FormLabel>
          <Autocomplete startDecorator={<BiNews />} options={products} getOptionLabel={(option) => option.name}/>
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>Quantity</FormLabel>
          <Input
            type="number"
            defaultValue={1}
            slotProps={{
              input: {
                ref: inputRef,
                min: 1,
                max: 11,
                step: 1,
              },
            }} 
            startDecorator={<AiOutlineNumber />}
          />
        </FormControl>
        <FormControl></FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>Start Date</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker
              label={startDate == null ? null : startDate.format('MM/DD/YYYY')}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>End Date</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker
              label={endDate == null ? null : endDate.format('MM/DD/YYYY')}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>
        </FormControl>
      
        <CardActions sx={{ gridColumn: '1/-1' }}>
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<Add />} >
            Add Subscription
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
