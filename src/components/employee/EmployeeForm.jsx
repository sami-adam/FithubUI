import { useTheme } from '@emotion/react';
import useEmployeeStore from '../../state/employeeState';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, FormLabel, Input, Option, Select, Typography } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { HiOutlineIdentification } from "react-icons/hi2";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsFilePerson } from "react-icons/bs";
import { LiaPhoneSquareSolid } from "react-icons/lia";
import { FaLocationDot } from "react-icons/fa6";
import { SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';


export default function EmployeeForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/employees';
    }

    const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
    const addEmployee = useEmployeeStore((state) => state.addEmployee);
    const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [name, setName] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [employeeType, setEmployeeType] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const employee = location.state.object;
    const theme = useTheme();
    const {t} = useTranslation();

    useEffect(() => {
        if(employee){
            setName(name=>name||employee.name);
            setIdentificationNumber(identificationNumber=>identificationNumber||employee.identificationNumber);
            setEmail(email=>email||employee.email);
            setPhone(phone=>phone||employee.phone);
            setAddress(address=>address||employee.address);
            setEmployeeType(employeeType=>employeeType||employee.employeeType);
        }
      }, [mode, employee]);

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

    const handleAdd = () => {
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
        <div style={{ width:"100%"}}>
            <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'vertical',
        width: { xs: '100%', md: '80%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 4, md: "auto" },
      }}
    >
      {/* <Divider inset="none" /> */}
      <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            {t("Employee Information")}
        </Typography>
        <div style={{ display: "flex", flexDirection:"row"}}>
          <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
          <Button variant='soft' startDecorator={<BsSave fontSize={18}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
          <Box flexGrow={1} width={4}/>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
          <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
        </div>
      </div>
      {/* <Divider inset="none" /> */}
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Name")}</FormLabel>
          <Input startDecorator={<BsFilePerson fontSize={18}/>} value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("ID Number")}</FormLabel>
          <Input startDecorator={<HiOutlineIdentification fontSize={18} />} value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Email")}</FormLabel>
          <Input type="email" startDecorator={<MdOutlineMailOutline fontSize={18}/>} value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>{t("Phone")}</FormLabel>
          <Input startDecorator={<LiaPhoneSquareSolid fontSize={22} />} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>{t("Employee Type")}</FormLabel>
          <Select 
              startDecorator={<MdOutlineMailOutline />} 
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
          <FormLabel>{t("Address")}</FormLabel>
          <Input type="search" startDecorator={<FaLocationDot fontSize={18}/>} value={address} onChange={(e) => setAddress(e.target.value)} disabled={mode === 'view'} />
        </FormControl>


        </CardContent>
        <Box height={8} sx={{ gridColumn: '1/-1' }} />

        </Card>
        
        </div>
    );
      
}