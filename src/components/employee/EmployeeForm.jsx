import useEmployeeStore from '../../state/employeeState';
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Box, CardContent, FormControl, FormLabel, Input, Option, Select, Typography, useTheme } from '@mui/joy';
import { Email, Person } from '@mui/icons-material';
import { Required, SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { validateEmail, validateIdentificationNumber, validateName, validatePhone } from '../../utils/validations';

export default function EmployeeForm() {
    const location = useLocation();
    
    const { id } = useParams();

    const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
    const addEmployee = useEmployeeStore((state) => state.addEmployee);
    const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee);
    const fetchEmployee = useEmployeeStore((state) => state.fetchEmployee);
    const error = useEmployeeStore((state) => state.error);
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
    const theme = useTheme();

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !employee && id !== 'new'){
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
        const validInputs = validateInputs();
        if(!validInputs){
          return;
        }
        updateEmployee({
            id: employee.id,
            name: name,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            address: address,
            employeeType: employeeType
        });
        if(error){
          Swal.fire({
            title: t("Error"),
            text: t(error),
            icon: "error",
            confirmButtonText: t("OK"),
          });
          return;
        }
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Employee updated successfully'});
    }

    const validateInputs = () => {
      const message = [];
      !validateName(name) && message.push(t("Please enter a valid name"));
      !validateIdentificationNumber(identificationNumber) && message.push(t("Please enter a valid ID number"));
      !validateEmail(email) && message.push(t("Please enter a valid email"));
      !validatePhone(phone) && message.push(t("Please enter a valid phone number"));
      var duration = 3;
      if(message.length > 0){
        message.forEach((msg) => toast.error(msg, {position: "top-center", autoClose: (duration ++) * 1000}));
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
        if(error){
          Swal.fire({
            title: t("Error"),
            text: t(error),
            icon: "error",
            confirmButtonText: t("OK"),
          });
          return;
        }
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Employee added successfully'});
    }

    const handelDelete = () => {
      Swal.fire({
        title: t("Are you sure?"),
        text: t("You won't be able to revert this!"),
        color: theme.palette.mode === 'dark' ? "white" : "black",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: theme.palette.primary.main,
        cancelButtonColor: theme.palette.mode === 'dark' ? "brown" : "brown",
        confirmButtonText: t("Yes, delete it!"),
        cancelButtonText: t("Cancel"),
        background: theme.palette.mode === 'dark' ? 'black' : '#fff',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteEmployee(id);
          if(error){
            Swal.fire({
              title: t("Error"),
              text: t(error),
              icon: "error",
              confirmButtonText: t("OK"),
            });
            return;
          }
          Swal.fire({
            title: t("Deleted!"),
            text: t("Employee profile has been deleted."),
            icon: "success"
          });
          window.history.back();
        }
      });
        // setOpenSnackbar(true);
        // setSnack({type: 'success', title: 'Success', message: 'Employee deleted successfully'});
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Employee Information" mode={mode} setMode={setMode} handleSave={handleSave} handleAdd={handleAdd} handelDelete={handelDelete}>
        <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
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
          <FormLabel><Typography level='body-sm' startDecorator={<Person sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Full Name")}</Typography></FormLabel>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<BadgeIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("ID Number")}</Typography></FormLabel>
          <Input type="number" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<Email sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Email")}</Typography></FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<ContactsIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Phone")}</Typography></FormLabel>
          <Input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='body-sm' startDecorator={<LibraryAddCheckIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Employee Type")}</Typography></FormLabel>
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