import useEmployeeStore from '../../state/employeeState';
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Box, CardContent, FormControl, FormLabel, Input, Option, Select, Typography } from '@mui/joy';
import { Email, Person } from '@mui/icons-material';
import { Required } from '../common/Common';
import { useTranslation } from 'react-i18next';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import Swal from 'sweetalert2';

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

    const {t} = useTranslation();
    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !employee && id !== 'new'){
            fetchEmployee(id).then((res) => {
              if(res.success) {
                setEmployee(res.data);
              } else {
                Swal.fire({
                  title: t(res.error.message),
                  text: t(res.error.details),
                  icon: 'error',
                  confirmButtonText: t('OK')
                });
              }
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

    const validateFields = [
      {type: "name", value: name, message: t("Please enter a valid name!")},
      {type: "email", value: email, message: t("Please enter a valid email!")},
      {type: "phone", value: phone, message: t("Please enter a valid phone number!")},
      {type: "id", value: identificationNumber, message: t("Please enter a valid ID number!")},
    ];
    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : employee?.id,
      name: name,
      identificationNumber: identificationNumber,
      email: email,
      phone: phone,
      address: address,
      employeeType: employeeType
    }

    const addFields = {
      name: name,
      identificationNumber: identificationNumber,
      email: email,
      phone: phone,
      address: address,
      employeeType: employeeType
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
      <FormHeader loading={loading} title="Employee Information" mode={mode} setMode={setMode} setRecord={setEmployee}
      updateMethod={updateEmployee} updateFields={updateFields} addMethod={addEmployee} addFields={addFields} 
      deleteMethod={deleteEmployee} deleteMessage="Employee deleted successfully!" validateFields={validateFields} stateStore={useEmployeeStore}>
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