import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Box, Table } from '@mui/joy';
import { useEffect, useRef, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";

import useMemberStore from '../../state/memberState';
import useProductStore from '../../state/productState';
import useSubscriptionStore from '../../state/subscriptionState';
import { ButtonDatePicker, ManyToOneField } from '../common/Fields';
import dayjs from 'dayjs';
import { Add, Person } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import { Link, useLocation, useParams } from 'react-router-dom';
import { DocumentSnackbar, HorozontalStepper, SnackbarCustom } from '../common/Common';
import SubscriptionInvoice from '../../reports/SubscriptionInvoice';
import { MdPictureAsPdf } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import EventIcon from '@mui/icons-material/Event';
import PaymentsIcon from '@mui/icons-material/Payments';
import { FormBackButton } from '../common/Buttons';
import FormBaseLayout, { FormFooter, FormHeader } from '../common/FormBaseLayout';
import { FaMoneyBills } from "react-icons/fa6";

export default function SubscriptionForm() {
  const location = useLocation();
  const { id } = useParams();
  const [members, fetchMembers] = useMemberStore((state) => [state.members, state.fetchMembers]);
  const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);
  const updateSubscription = useSubscriptionStore((state) => state.updateSubscription);
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const deleteSubscription = useSubscriptionStore((state) => state.deleteSubscription);
  const fetchSubscription = useSubscriptionStore((state) => state.fetchSubscription);
  const generateAccountTransaction = useSubscriptionStore((state) => state.generateAccountTransaction);
  const [subscription, setSubscription] = useState(null);
  const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');
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
  const [transaction, setTransaction] = useState(null);
  const [openDownload, setOpenDownload] = useState(false);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef(null);
  const {t} = useTranslation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
  
  const stages = ['NEW', 'PAID', "ACTIVE", "EXPIRED"];

  useEffect(() => {
    if(mode === 'add'){
      setLoading(false);
    }
    if(id && mode !== 'add' && !subscription){
      fetchSubscription(id).then((data) => {
        setSubscription(data);
      }).finally(() => setLoading(false));
    }
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
      setUnitPrice(unitPrice=>(product && product.price)||(subscription.product && subscription.product.price));
      setQuantity(quantity=>quantity ? quantity : subscription.subscriptionQty);
      setSubtotal(unitPrice * quantity);
      setTax(subtotal * ((product&&(((product.tax&&product.tax.rate)||0) / 100)) || 0));
      setDiscount(discount=> discount || subscription.discountAmount);
      setTotal(subtotal + tax - discount);
      setTransaction(subscription.transaction);
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
    discount, fetchData, fetchMembers, fetchProducts, fetchSubscription, id]);

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

  const handelAccountTransactionCreation = () => {
    setLoading(true);
    generateAccountTransaction(subscription&&subscription.id).then((data) => {
      console.log(data);
    }).finally(() => {
    fetchSubscription(id).then((data) => {
      setSubscription(data);
      setOpenSnackbar(true);
      setSnack({type: 'success', title: 'Success', message: 'Transaction created successfully!'});
    }).finally(() => setLoading(false));
  });
  }

  return (
    <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
    <FormHeader loading={loading}>
    <HorozontalStepper stages={stages} currentStage={(stages.indexOf(subscription&&subscription.status)||0)} />
      <SnackbarCustom open={openSnackbar} setOpen={setOpenSnackbar} type={snack.type} title={snack.title} message={snack.message} />
      {/* <Divider inset="none" /> */}
      <div style={{paddingTop:16}}>
        <Button variant="soft" startDecorator={<MdPictureAsPdf fontSize={18}/>} onClick={() => setOpenDownload(true)}>
            <Typography fontSize="small">{t("INVOICE")}</Typography>
        </Button>
      </div>
      <FormBackButton/>
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:0}}>
        <div style={{display:"flex", flexDirection:"row"}}>
          <Typography level="title-md" >
          {(subscription&&subscription.reference)|| t("New Subscription")}
          </Typography>
          {subscription && 
          <DocumentSnackbar document={<SubscriptionInvoice subscription={subscription} />} fileName="subscription-invoice" title={t("Subscription Invoice")} 
          open={openDownload} setOpen={setOpenDownload}
          />
          }
        </div>
        <div style={{ display: "flex", flexDirection:"row"}}>
          <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
          <Button variant='soft' startDecorator={<BsSave fontSize={20}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
          <Box flexGrow={1} width={4}/>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
          <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handelDelete} sx={{display: mode === 'view' && subscription? 'none': 'none'}}>{t("DELETE")}</Button>
        </div>
        
      </div>
      {/* <Divider inset="none" /> */}
    </FormHeader>
    <FormBaseLayout loading={loading}>
      <CardContent
        sx={{
          display: 'grid',
          paddingTop: 2,
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<Person sx={{ fontSize: 18}}/>}>{t("Member")}</Typography></FormLabel>
          <ManyToOneField options={members} optionsFields={["firstName", "lastName"]} value={member} setValue={setMember} mode={mode} url={"/members"}/>
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<CalendarMonthIcon sx={{ fontSize: 18}}/>}>{t("Subscription")}</Typography></FormLabel>
          <ManyToOneField options={products} optionsFields={["name"]} value={product} setValue={setProduct} mode={mode} url={"/products"}/>
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<Grid3x3Icon sx={{ fontSize: 18}}/>}>{t("Quantity")}</Typography></FormLabel>
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
            value={quantity} onChange={(e) => setQuantity(e.target.value)}
            disabled={mode === 'view'}
          />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<PaymentsIcon sx={{ fontSize: 18 }} fill='text.secondary'/>}>{t("Unit Price")}</Typography></FormLabel>
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
          <FormLabel><Typography level='h5' startDecorator={<EventIcon sx={{ fontSize: 18}}/>}>{t("Start Date")}</Typography></FormLabel>
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
          <FormLabel><Typography level='h5' startDecorator={<EventIcon sx={{ fontSize: 18}}/>}>{t("End Date")}</Typography></FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker
              label={endDate == null ? null : endDate.format('MM/DD/YYYY')}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              disabled={mode === 'view'}
            />
          </LocalizationProvider>
        </FormControl>

        {/* <Divider sx={{ gridColumn: '1/-1' }} /> */}
        
        {/* <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
            <Table>
              <tbody>
                <tr>
                  <th>{subscription && subscription.company && subscription.company.company_name}</th>
                </tr>
              </tbody>
            </Table>
        </FormControl>
      
        <Box height={8} sx={{ gridColumn: '1/-1' }} /> */}
      </CardContent>
    </FormBaseLayout>
    <FormFooter loading={loading}>
    <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
    <Table variant="outlined" sx={{ borderRadius: 8, borderColor: "divider", width: '100%', mt: 2 }}>
        <tbody>
          {[
            { label: "Subtotal", value: subtotal && subtotal.toLocaleString() },
            { label: "Taxes", value: tax },
            { label: "Discount", component: (
              <NumericFormat
                value={discount}
                thousandSeparator
                customInput={Input} 
                sx={{fontSize: 'inherit' }}
                onChange={(e) => setDiscount(e.target.value.replace(',', ''))}
                disabled={mode === 'view'}
              />
            )},
            { label: "Total", value: total && total.toLocaleString() }
          ].map(({ label, value, component }, index) => (
            <tr key={index}>
              <td style={{ width: 120, padding: '8px 16px', border: "none"}}>{t(label)}</td>
              <td style={{ border: "none", padding: '8px 16px' }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ paddingInlineEnd: 1.5 }}>{t("SAR")}</Typography>
                  {component || <Typography variant="body2">{value}</Typography>}
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ padding: '16px 16px', textAlign: 'center' }}>
              <Button
                variant='outlined'
                color='primary'
                sx={{ borderColor: "divider", display: (mode === 'add' || transaction) ? "none" : "flex" }}
                startDecorator={<FaMoneyBills fontSize={18} />}
                onClick={handelAccountTransactionCreation}
              >
                {t("Generate Transaction")}
              </Button>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: '8px' }}>
                <Typography variant="body2">{t("Transaction")}</Typography>
                <Box width={"4%"} />
                {transaction && (
                  <Link to={`/transactions/${transaction.id}`} style={{ textDecoration: 'none' }}>
                    <Typography sx={{ fontWeight: "bold", marginLeft: 1 }}>{transaction.reference}</Typography>
                  </Link>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </Table>

        </FormControl>
    </FormFooter>
    </div>
  );
}
