import { useTheme } from '@emotion/react';
import useEmployeeStore from '../../state/employeeState';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Card, CardContent, Divider, Dropdown, FormControl, FormLabel, IconButton, Input, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import { MoreHoriz } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { HiOutlineIdentification } from "react-icons/hi2";
import { MdOutlineMailOutline } from "react-icons/md";


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

    const employee = location.state.object;
    const theme = useTheme();

    useEffect(() => {
        if(employee){
            setName(name=>name||employee.name);
            setIdentificationNumber(identificationNumber=>identificationNumber||employee.identificationNumber);
            setEmail(email=>email||employee.email);
            setPhone(phone=>phone||employee.phone);
            setAddress(address=>address||employee.address);
        }
      }, [mode, employee]);

    const handleSave = () => {
        updateEmployee({
            id: employee.id,
            name: name,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            address: address
        });
        setMode('view');
    }

    const handleAdd = () => {
        addEmployee({
            name: name,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            address: address
        });
        setMode('view');
    }

    const handelDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this subscription?");
        if(confirm){
            deleteEmployee(employee.id);
            window.history.back();
        }
    }

    return (
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
        width: { xs: '80%', md: '100%' },
        mt: { xs: 10, md: 4 },
        ml: { xs: 8, md: "auto" },
      }}
    >
      {/* <Divider inset="none" /> */}
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:16}}>
        <Typography level="title-lg" startDecorator={<BiNews />}>
            Employee Info
        </Typography>
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
          >
            <MoreHoriz />
          </MenuButton>
          <Menu size="sm" sx={{ minWidth: 140 }}>
            <MenuItem onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>Edit</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Move</MenuItem>
            <Divider />
            <MenuItem color="danger" onClick={handelDelete}>Delete</MenuItem>
          </Menu>
        </Dropdown>
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
          <FormLabel>Name</FormLabel>
          <Input startDecorator={<InfoOutlinedIcon />} value={name} onChange={(e) => setName(e.target.value)} disabled={mode === 'view'} />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>ID Number</FormLabel>
          <Input startDecorator={<HiOutlineIdentification fontSize={24} />} value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel>Email</FormLabel>
          <Input startDecorator={<MdOutlineMailOutline fontSize={24}/>} value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel>Phone</FormLabel>
          <Input startDecorator={<InfoOutlinedIcon />} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
        </FormControl>

        </CardContent>


        </Card>
        
        </div>
    );
      
}