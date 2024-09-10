import useEmployeeStore from '../../state/employeeState';
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Box, Button, CardContent, FormControl, FormLabel, Input, Option, Select, Typography } from '@mui/joy';
import { Add, Email, Person } from '@mui/icons-material';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { AlertCustom, SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import { toast } from 'react-toastify';
import { position } from 'stylis';

export default function EmployeeForm() {
    const location = useLocation();
    
    const { id } = useParams();

    const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
    const addEmployee = useEmployeeStore((state) => state.addEmployee);
    const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee);
    const fetchEmployee = useEmployeeStore((state) => state.fetchEmployee);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [name, setName] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [employeeType, setEmployeeType] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const {t} = useTranslation();

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !employee){
            fetchEmployee(id).then((data) => {
                setEmployee(data);
            }).finally(()=> setLoading(false)) 
        }
        if(employee){
            setName(name=>name||employee.name);
            setIdentificationNumber(identificationNumber=>identificationNumber||employee.identificationNumber);
            setEmail(email=>email||employee.email);
            setPhone(phone=>phone||employee.phone);
            setAddress(address=>address||employee.address);
            setEmployeeType(employeeType=>employeeType||employee.employeeType);
        }
      }, [mode, employee, id, fetchEmployee]);

    const handleSave = () => {
        updateEmployee({
            id: employee.id,
            name: name,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            address: address,
            employeeType: employeeType
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Employee updated successfully'});
    }

    const validateInputs = () => {
        var validationMessages = [];
        if(!name){
          validationMessages.push("Name is required!");
        }
        if(!identificationNumber){
          validationMessages.push("Identification Number is required!");
        }
        if(!email){
          validationMessages.push("Email is required!");
        }
        if(!phone){
          validationMessages.push("Phone is required!");
        }
        if(!employeeType){
          validationMessages.push("Employee Type is required!");
        }
        if(validationMessages.length > 0){
          validationMessages.forEach((message) => {
            toast.error(message, {position: "top-center"});
          });
          return false;
        }
        return true;
      }


    const handleAdd = () => {
        const validInputs = validateInputs();
        if(!validInputs){
          return;
        }
        addEmployee({
            name: name,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            address: address,
            employeeType: employeeType
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Employee added successfully'});
    }

    const handelDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this subscription?");
        if(confirm){
            deleteEmployee(employee.id);
            window.history.back();
        }
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Employee deleted successfully'});
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader>
        {/* <Divider inset="none" /> */}
        <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16, width:"100%"}}>
          <Typography level="title-lg">
              {t("Employee Information")}
          </Typography>
          <div style={{ display: "flex", flexDirection:"row"}}>
            <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
            <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
            <Box flexGrow={1} width={4}/>
            <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
            <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
            <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handelDelete} sx={{display: mode === 'view'? 'none': 'none'}}>{t("DELETE")}</Button>
          </div>
        </div>
        {/* <Divider inset="none" /> */}
      </FormHeader>

      <FormBaseLayout loading={loading}>
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<Person sx={{ fontSize: 18}}/>}>{t("Name")}</Typography></FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<BadgeIcon sx={{ fontSize: 18}}/>}>{t("ID Number")}</Typography></FormLabel>
          <Input value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<Email sx={{ fontSize: 18}}/>}>{t("Email")}</Typography></FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<ContactsIcon sx={{ fontSize: 18}}/>}>{t("Phone")}</Typography></FormLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<LibraryAddCheckIcon sx={{ fontSize: 18}}/>}>{t("Employee Type")}</Typography></FormLabel>
          <Select 
              value={employeeType} 
              placeholder={t("Select Employee Type")}
              onChange={(e, newValue) => setEmployeeType(newValue)}
              disabled={mode === 'view'}
              sx={{ flexGrow: 1, mr: 1}}
              >
              <Option value="EMPLOYEE">{t("Employee")}</Option>
              <Option value="INSTRUCTOR">{t("Instructor")}</Option>
          </Select>
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/-1' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<LocationOnIcon sx={{ fontSize: 18}}/>}>{t("Address")}</Typography></FormLabel>
          <Input type="search" value={address} onChange={(e) => setAddress(e.target.value)} disabled={mode === 'view'} />
        </FormControl>


        </CardContent>
        <Box height={8} sx={{ gridColumn: '1/-1' }} />

        </FormBaseLayout>
        </div>
    );
      
}