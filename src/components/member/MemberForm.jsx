import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useMemberStore from '../../state/memberState';
import useSubscriptionStore from '../../state/subscriptionState';
import useAttachmentStore from '../../state/attachmentState';
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormLabel, Input, Modal, ModalDialog, Radio, Typography } from '@mui/joy';
import { Add, Email } from '@mui/icons-material';
import { HorozontalStepper, SnackbarCustom } from '../common/Common';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InputFileUpload from '../common/InputFileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const stages = ["NEW", "ACTIVE", "EXPIRING", "EXPIRED"]
export default function MemberForm() {
    const location = useLocation();
    const { id } = useParams();

    const updateMember = useMemberStore((state) => state.updateMember);
    const addMember = useMemberStore((state) => state.addMember);
    const deleteMember = useMemberStore((state) => state.deleteMember);
    const fetchAttachment = useAttachmentStore((state) => state.fetchAttachment);
    const [subscriptions, fetchSubscriptions] = useSubscriptionStore((state) => [state.subscriptions, state.fetchSubscriptions]);
    const fetchMember = useMemberStore((state) => state.fetchMember);
    const [member, setMember] = useState(null);
    const [fetchData, setFetchData] = useState(true);
    const {t} = useTranslation();

    const [mode, setMode] = useState(location.state && location.state.viewMode||'view');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
    const [openPictureEdit, setOpenPictureEdit] = useState(false);
    const [profileSrc, setProfileSrc] = useState("");

    const navigate = useNavigate();
    
    const memberSubscriptions = member&&subscriptions.filter(subscription => subscription.member.id === member.id);

    useEffect(() => {
        if(id && mode !== 'add' && !member){
            fetchMember(id).then((member) => {
                setMember(member);
            });
        }
        if(member){
            setFirstName(firstName=>firstName||member.firstName);
            setLastName(lastName=>lastName||member.lastName);
            setIdentificationNumber(identificationNumber=>identificationNumber||member.identificationNumber);
            setEmail(email=>email||member.email);
            setPhone(phone=>phone||member.phone);
            setGender(gender=>gender||member.gender);
        }
        async function fetchData(){
            fetchSubscriptions();
            setFetchData(false);
        }
        if(fetchData){
            fetchData();
        }
    }, [mode, member, fetchData, fetchSubscriptions, fetchAttachment, fetchMember, id]);

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
        <div style={{ width: "100%" }}>
        <Card
        variant="outlined"
        sx={{
            maxHeight: 'max-content',
            //maxWidth: '100%',
            mx: 'auto',
            // to make the demo resizable
            overflow: 'auto',
            resize: 'vertical',
            width: { xs: '100%', md: '80%' },
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
                    <Typography fontSize="small">{t("SUBSCRIPTIONS")}</Typography>
            </Button>}
        </div>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:0}}>
            <Typography level="title-lg">
                {t("Member Information")}
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
                <FormLabel><Typography level='h5' startDecorator={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18}}/>}>{t("First Name")}</Typography></FormLabel>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={mode === 'view'} />
            </FormControl>
            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='h5' startDecorator={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18}}/>}>{t("Last Name")}</Typography></FormLabel>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
                <FormLabel><Typography level='h5' startDecorator={<BadgeIcon sx={{ fontSize: 18}}/>}>{t("ID Number")}</Typography></FormLabel>
                <Input value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='h5' startDecorator={<RadioButtonCheckedIcon sx={{ fontSize: 18}}/>}>{t("Gender")}</Typography></FormLabel>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Radio 
                        checked={gender === "MALE"}
                        onChange={() => setGender("MALE")}
                        value={"MALE"}
                        name="radio-buttons"
                        slotProps={{ input: { 'aria-label': 'Male' } }}
                        label={t("Male")}
                        disabled={mode === 'view'}
                    />
                    <Radio 
                        checked={gender === "FEMALE"}
                        onChange={() => setGender("FEMALE")}
                        value={"FEMALE"}
                        name="radio-buttons"
                        slotProps={{ input: { 'aria-label': 'Female' } }}
                        label={t("Female")}
                        disabled={mode === 'view'}
                    />
                </Box>
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
            <FormLabel><Typography level='h5' startDecorator={<Email sx={{ fontSize: 18}}/>}>{t("Email")}</Typography></FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
            <FormLabel><Typography level='h5' startDecorator={<ContactsIcon sx={{ fontSize: 18}}/>}>{t("Phone")}</Typography></FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            </CardContent>
            <Box height={8} sx={{ gridColumn: '1/-1' }} />
            {member &&
            <>
            <a onClick={()=> setOpenPictureEdit(true)}>
            <img src={profileSrc || member.profilePicture && member.profilePicture.url || "https://via.placeholder.com/300"}  alt="Profile" style={{width: 100, height: 100, borderRadius: 50}}/>
            </a>
            
            <ProfilePictureEdit open={openPictureEdit} setOpen={setOpenPictureEdit} src={profileSrc} setSrc={setProfileSrc} defaultSrc={profileSrc} memberId={member.id}/>
            </>
            }
        </Card>
        </div>
    )

}

export function ProfilePictureEdit({open, setOpen, src, setSrc, defaultSrc=null, memberId=null}){
    const [profileUrl, setProfileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const uploadProfilePicture = useMemberStore((state) => state.uploadProfilePicture);
    const deleteProfilePicture = useMemberStore((state) => state.deleteProfilePicture);
    const handleFileChange = (file) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setProfileUrl(url);
            setSrc(url);
            setFile(file);
        }
    };
    const handleUpload = () => {
        const response = uploadProfilePicture(memberId, file);
        setOpen(false);
    }
    const handleDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this profile picture?");
        if(confirm){
            deleteProfilePicture(memberId);
            setSrc("https://via.placeholder.com/300");
        }
        setOpen(false);
    }
    console.log(src);
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Profile Picture
          </DialogTitle>
          <Divider />
          <DialogContent>
          <Button sx={{ display: "flex", position:"absolute" }} variant='soft' onClick={handleDelete}><DeleteIcon color='danger' sx={{ fontSize: 24 }}/></Button>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <img src={defaultSrc&&defaultSrc.data || src}  alt="Profile" style={{width: 300, height: 300, borderRadius: 10}}/>
          </div>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent:"space-between"}}>
            <div style={{ width: "50%" }}>
                <InputFileUpload file={src} setFile={handleFileChange} />
            </div>
            <Button variant="solid" color="primary" onClick={handleUpload}>
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    )
}