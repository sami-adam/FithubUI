import { useLocation, useNavigate } from 'react-router-dom';
import useMemberStore from '../../state/memberState';
import useSubscriptionStore from '../../state/subscriptionState';
import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Divider, Dropdown, FormControl, FormLabel, IconButton, Input, Menu, MenuButton, MenuItem, Radio, Typography } from '@mui/joy';
import { Add, MoreHoriz } from '@mui/icons-material';
import { BiNews } from "react-icons/bi";
import { HorozontalStepper, SnackbarCustom } from '../common/Common';
import { HiOutlineIdentification } from "react-icons/hi2";
import { LiaPhoneSquareSolid } from "react-icons/lia";
import { MdOutlineMailOutline } from "react-icons/md";
import { GiSaveArrow } from 'react-icons/gi';
import { FaCalendarAlt } from "react-icons/fa";

const stages = ["NEW", "ACTIVE", "EXPIRING", "EXPIRED"]
export default function MemberForm() {
    const location = useLocation();
    if (!location.state) {
        window.location.href = '/members';
    }

    const updateMember = useMemberStore((state) => state.updateMember);
    const addMember = useMemberStore((state) => state.addMember);
    const deleteMember = useMemberStore((state) => state.deleteMember);
    const [subscriptions, fetchSubscriptions] = useSubscriptionStore((state) => [state.subscriptions, state.fetchSubscriptions]);
    const [fetchData, setFetchData] = useState(true);

    const [mode, setMode] = useState(location.state.viewMode||'view');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(0);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});

    const member = location.state.object;
    const theme = useTheme();
    const navigate = useNavigate();

    const memberSubscriptions = member&&subscriptions.filter(subscription => subscription.member.id === member.id);

    useEffect(() => {
        if(member){
            setFirstName(firstName=>firstName||member.firstName);
            setLastName(lastName=>lastName||member.lastName);
            setIdentificationNumber(identificationNumber=>identificationNumber||member.identificationNumber);
            setEmail(email=>email||member.email);
            setPhone(phone=>phone||member.phone);
            setGender(gender=>gender);
        }
        if(fetchData){
            fetchSubscriptions();
            setFetchData(false);
        }
    }, [mode, member, fetchData, fetchSubscriptions]);

    const handleSave = () => {
        updateMember({
            id: member.id,
            firstName: firstName,
            lastName: lastName,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            gender: gender,
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Member updated successfully'});
    }

    const handleAdd = () => {
        addMember({
            firstName: firstName,
            lastName: lastName,
            identificationNumber: identificationNumber,
            email: email,
            phone: phone,
            gender: gender
        });
        setMode('view');
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Member added successfully'});
    }

    const handleDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this subscription?");
        if(confirm){
            deleteMember(member.id);
            window.history.back();
        }
        setOpenSnackbar(true);
        setSnack({type: 'success', title: 'Success', message: 'Member deleted successfully'});
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
            width: { xs: '100%', md: '100%' },
            mt: { xs: 10, md: 4 },
            ml: { xs: 5, md: "auto" },
        }}
        >
        {/* <Divider inset="none" /> */}
        <HorozontalStepper stages={stages} currentStage={(stages.indexOf(member&&member.status)||0)} />
        <SnackbarCustom type={snack.type} title={snack.title} message={snack.message} open={openSnackbar} setOpen={setOpenSnackbar} />
        <div style={{ paddingTop: 16}}>
            {member &&
            <Button variant="soft" 
                startDecorator={<FaCalendarAlt/>} 
                endDecorator={<Typography fontSize="small" >{memberSubscriptions.length}</Typography>}
                onClick={() => navigate("/subscriptions", {state: {search: member.identificationNumber}})}
                >
                    <Typography fontSize="small">SUBSCRIPTIONS</Typography>
            </Button>}
        </div>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:0}}>
            <Typography level="title-lg" startDecorator={<BiNews />}>
                Member Info
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
                <MenuItem color="danger" onClick={handleDelete}>Delete</MenuItem>
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
                <FormLabel>First Name</FormLabel>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={mode === 'view'} />
            </FormControl>
            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel>Last Name</FormLabel>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
                <FormLabel>ID Number</FormLabel>
                <Input startDecorator={<HiOutlineIdentification fontSize={18}/>} value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel>Gender</FormLabel>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Radio 
                        checked={gender === 0}
                        onChange={() => setGender(0)}
                        value={0}
                        name="radio-buttons"
                        slotProps={{ input: { 'aria-label': 'Male' } }}
                        label="Male"
                        disabled={mode === 'view'}
                    />
                    <Radio 
                        checked={gender === 1}
                        onChange={() => setGender(1)}
                        value={1}
                        name="radio-buttons"
                        slotProps={{ input: { 'aria-label': 'Female' } }}
                        label="Female"
                        disabled={mode === 'view'}
                    />
                </Box>
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
            <FormLabel>Email</FormLabel>
            <Input type="email" startDecorator={<MdOutlineMailOutline fontSize={18}/>} value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
            <FormLabel>Phone</FormLabel>
            <Input startDecorator={<LiaPhoneSquareSolid fontSize={22} />} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            </CardContent>
            <Box height={8} sx={{ gridColumn: '1/-1' }} />
            <CardActions sx={{ gridColumn: '1/-1' }}>
            {mode === 'add' &&
            <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
                '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
                '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
            }} startDecorator={<Add />} onClick={handleAdd}>
                Add Member
            </Button>}
            {mode === 'edit' &&
            <Button variant="solid" sx={{ backgroundColor: theme.colorSchemes.dark.palette.common.black, 
                '&:hover': { backgroundColor: theme.colorSchemes.dark.palette.common.black },
                '&:active': { backgroundColor: theme.colorSchemes.dark.palette.common.black, opacity: 0.8 },
            }} startDecorator={<GiSaveArrow />} onClick={handleSave} >
                Save Member
            </Button>}
            </CardActions>

        </Card>
        </div>
    )

}