import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import PortraitIcon from '@mui/icons-material/Portrait';
import { AiOutlineNumber } from "react-icons/ai";
import { Autocomplete, Box, Dropdown, IconButton, Menu, MenuButton, MenuItem, Table } from '@mui/joy';
import { BiNews } from "react-icons/bi";
import { useEffect, useRef, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import useMemberStore from '../../state/memberState';
import useProductStore from '../../state/productState';
import useSubscriptionStore from '../../state/subscriptionState';
import { ButtonDatePicker } from '../common/Fields';
import dayjs from 'dayjs';
import { useTheme } from '@emotion/react';
import { Add, MoreHoriz } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import { useLocation } from 'react-router-dom';
import { DocumentSnackbar, HorozontalStepper, SnackbarCustom } from '../common/Common';
import { GiSaveArrow } from "react-icons/gi";
import SubscriptionInvoice from '../../reports/SubscriptionInvoice';
import { MdPictureAsPdf } from "react-icons/md";
import { useTranslation } from 'react-i18next';


export default function SubscriptionForm() {
  const location = useLocation();
  const [members, fetchMembers] = useMemberStore((state) => [state.members, state.fetchMembers]);
  const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);
  const updateSubscription = useSubscriptionStore((state) => state.updateSubscription);
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const deleteSubscription = useSubscriptionStore((state) => state.deleteSubscription);
  const [mode, setMode] = useState(location.state.viewMode||'view');
  const [fetchData, setFetchData] = useState(true);

  const [member, setMember] = useState(null);
  const [product, setProduct] = useState(null);
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(null);
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [openDownload, setOpenDownload] = useState(false);

  const inputRef = useRef(null);
  const theme = useTheme();
  const {t} = useTranslation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
  
  const subscription = location.state.object;
  const stages = ['NEW', 'PAID', "ACTIVE", "EXPIRED"];

  useEffect(() => {
    if(mode !== 'view' && fetchData){
      fetchMembers();
      fetchProducts();
      setFetchData(false);
    }

    if(!subscription){
      //setMode('add');
      setUnitPrice(product&&product.price);
      setSubtotal(unitPrice * quantity);
      setTax(subtotal * ((product&&(((product.tax&&product.tax.rate)||0) / 100)) || 0));
      setTotal(subtotal + tax - discount);
    } else {
      setMember(member=>member||subscription.member);
      setProduct(product=>product||subscription.product);
      setStartDate(startDate=>dayjs(startDate||subscription.startDate));
      setEndDate(endDate=>dayjs(endDate||subscription.endDate));
      setUnitPrice(unitPrice=>unitPrice||subscription.subscriptionUnitPrice);
      setQuantity(quantity=>quantity ? quantity : subscription.subscriptionQty);
      setSubtotal(unitPrice * quantity);
      setTax(subtotal * ((product&&(((product.tax&&product.tax.rate)||0) / 100)) || 0));
      setDiscount(discount=> discount || subscription.discountAmount);
      setTotal(subtotal + tax - discount);
    }
    if(product && product.durationType && mode !== 'view'&&startDate){
      switch(product.durationType){
        case 'DAY':
          setEndDate(startDate.add(quantity, 'day'));
          break;
        case 'WEEK':
          setEndDate(startDate.add(quantity, 'week'));
          break;
        case 'MONTH':
          setEndDate(startDate.add(quantity, 'month'));
          break;
        case 'YEAR':
          setEndDate(startDate.add(quantity, 'year'));
          break;
        default:
          setEndDate(startDate);
          break;
      }
    }
  }, [members, products, subscription, mode, product, unitPrice, quantity, subtotal, tax, 
    discount, fetchData, fetchMembers, fetchProducts]);

  const handleSave = () => {
    updateSubscription({
      id: subscription.id,
      member: member && {"id": member.id},
      product: product && {"id": product.id},
      startDate: startDate,
      endDate: endDate,
      subscriptionQty: quantity,
      discountAmount: discount
    });
    setMode('view');
    setOpenSnackbar(true);
    setSnack({type: 'success', title: 'Success', message: 'Subscription updated successfully!'});
  }

  const handleAdd = () => {
    addSubscription({
      member: member && {"id": member.id},
      product: product && {"id": product.id, "price": product.price},
      startDate: startDate,
      endDate: endDate,
      subscriptionQty: quantity,
      discountAmount: discount
    });
    setMode('view');
    setOpenSnackbar(true);
    setSnack({type: 'success', title: 'Success', message: 'Subscription added successfully!'});
  }

  const handelDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this subscription?");
    if(confirm){
    deleteSubscription(subscription.id);
    setOpenSnackbar(true);
    setSnack({type: 'success', title: 'Success', message: 'Subscription deleted successfully!'});
    window.history.back();
    }
  }

  return (
    <>
    <div>
    <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        //maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '60%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 5, md: "auto" },
      }}
    >
      <HorozontalStepper stages={stages} currentStage={(stages.indexOf(subscription&&subscription.status)||0)} />
      <SnackbarCustom open={openSnackbar} setOpen={setOpenSnackbar} type={snack.type} title={snack.title} message={snack.message} />
      {/* <Divider inset="none" /> */}
      <div style={{paddingTop:16}}>
        <Button variant="soft" startDecorator={<MdPictureAsPdf fontSize={18}/>} onClick={() => setOpenDownload(true)}>
            <Typography fontSize="small">{t("INVOICE")}</Typography>
        </Button>
      </div>
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:0}}>
        <div style={{display:"flex", flexDirection:"row"}}>
          <Typography level="title-md" startDecorator={<BiNews />}>
          {(subscription&&subscription.reference)|| t("New Subscription")}
          </Typography>
          {subscription && 
          <DocumentSnackbar document={<SubscriptionInvoice subscription={subscription} />} fileName="subscription-invoice" title={t("Subscription Invoice")} 
          open={openDownload} setOpen={setOpenDownload}
          />
          }
        </div>
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
          >
            <MoreHoriz />
          </MenuButton>
          <Menu size="sm" sx={{ minWidth: 140 }}>
            <MenuItem onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("Edit")}</MenuItem>
            {/* <MenuItem>{t("Rename")}</MenuItem>
            <MenuItem>{t("Move")}</MenuItem> */}
            <Divider />
            <MenuItem color="danger" onClick={handelDelete}>{t("Delete")}</MenuItem>
          </Menu>
        </Dropdown>
      </div>
      {/* <Divider inset="none" /> */}
      <CardContent
        sx={{
          display: 'grid',
          paddingTop: 2,
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Member")}</FormLabel>
          <Autocomplete startDecorator={<PortraitIcon />}  
          options={members} getOptionLabel={(option) => option.firstName + " " + option.lastName}
          value={member} 
          onChange={(event, newValue) => setMember(newValue)}
          disabled={mode === 'view'}
           />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Subscription")}</FormLabel>
          <Autocomplete startDecorator={<BiNews fontSize={18}/>} 
          options={products} 
          getOptionLabel={(option) => option.name}
          value={product} onChange={(event, newValue) => setProduct(newValue)}
          disabled={mode === 'view'}
          />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Quantity")}</FormLabel>
          <Input
            type="number"
            slotProps={{
              input: {
                ref: inputRef,
                //min: 1,
                max: 11,
                step: 1,
              },
            }} 
            startDecorator={<AiOutlineNumber fontSize={18}/>}
            value={quantity} onChange={(e) => setQuantity(e.target.value)}
            disabled={mode === 'view'}
          />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Unit Price")}</FormLabel>
          <NumericFormat
            value={unitPrice&&unitPrice.toLocaleString()}
            thousandSeparator
            customInput={Input} 
            startDecorator={<Typography variant="body2">{t("SAR")}</Typography>}
            disabled 
            sx={{ border: 'none' }}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </FormControl>
        <FormControl></FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Start Date")}</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker
              label={startDate == null ? null : startDate.format('MM/DD/YYYY')}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              disabled={mode === 'view'}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("End Date")}</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker
              label={endDate == null ? null : endDate.format('MM/DD/YYYY')}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              disabled={mode === 'view'}
            />
          </LocalizationProvider>
        </FormControl>

        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        <Divider sx={{ gridColumn: '1/-1' }} />
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <Table variant="outlined">
            <tbody>
            <tr>
              <th style={{ width:80 }}>{t("Subtotal")}</th>
              <td style={{ border: "none" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                  <Typography variant="body2" paddingInlineEnd={1.5}>{t("SAR")}</Typography>
                  <Typography variant="body2">{subtotal&&subtotal.toLocaleString()}</Typography>
                </div>
              </td>
            </tr>
            <tr>
              <th>{t("Taxes")}</th>
              <td style={{ border: "none" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Typography variant="body2" paddingInlineEnd={1.5}>{t("SAR")}</Typography>
                    <Typography variant="body2">{tax}</Typography>
                </div>
              </td>
            </tr>
            <tr>
              <th>{t("Discount")}</th>
              <td style={{ border: "none" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Typography variant="body2" paddingInlineEnd={1.5}>{t("SAR")}</Typography>
                    <NumericFormat
                      value={discount}
                      thousandSeparator
                      customInput={Input} 
                      sx={{ border: 'none' }}
                      onChange={(e) => setDiscount(e.target.value.replace(',', ''))}
                      disabled={mode === 'view'}
                    />
                </div>
              </td>
            </tr>
            <tr>
              <th>{t("Total")}</th>
              <td style={{ border: "none" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Typography variant="body2" paddingInlineEnd={1.5}>{t("SAR")}</Typography>
                    <Typography variant="body2">{total&&total.toLocaleString()}</Typography>
                </div>
              </td>
            </tr>
            </tbody>
          </Table>
        </FormControl>
      
        <Box height={8} sx={{ gridColumn: '1/-1' }} />
        <CardActions sx={{ gridColumn: '1/-1' }}>
          {mode === 'add' &&
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<Add />} onClick={handleAdd}>
            Add Subscription
          </Button>}
          {mode === 'edit' &&
          <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
            '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
            '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
           }} startDecorator={<GiSaveArrow />} onClick={handleSave} >
            Save Subscription
          </Button>}
        </CardActions>
      </CardContent>
    </Card>
    </div>
    </>
  );
}
