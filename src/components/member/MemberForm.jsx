import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useMemberStore from '../../state/memberState';
import useSubscriptionStore from '../../state/subscriptionState';
import useClassEnrollmentStore from '../../state/classEnrollment';
import useAttachmentStore from '../../state/attachmentState';
import { useEffect, useState } from 'react';
import { Box, Button, CardContent, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormLabel, Input, Modal, ModalDialog, Radio, Typography } from '@mui/joy';
import { Email } from '@mui/icons-material';
import { HorozontalStepper, Required } from '../common/Common';
import { useTranslation } from 'react-i18next';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InputFileUpload from '../common/InputFileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactsIcon from '@mui/icons-material/Contacts';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import Swal from 'sweetalert2';
import { FaCalendarAlt } from 'react-icons/fa';

const stages = ["NEW", "ACTIVE", "EXPIRING", "EXPIRED"]
export default function MemberForm() {
    const location = useLocation();
    const { id } = useParams();

    const updateMember = useMemberStore((state) => state.updateMember);
    const addMember = useMemberStore((state) => state.addMember);
    const deleteMember = useMemberStore((state) => state.deleteMember);
    const fetchAttachment = useAttachmentStore((state) => state.fetchAttachment);
    const fetchMember = useMemberStore((state) => state.fetchMember);
    const error = useMemberStore((state) => state.error);
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchData, setFetchData] = useState(true);
    const {t} = useTranslation();

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(null);

    const [openPictureEdit, setOpenPictureEdit] = useState(false);
    const [profileSrc, setProfileSrc] = useState("");

    const navigate = useNavigate();
    
    const getMemberSubscriptions = useSubscriptionStore((state) => state.getMemberSubscriptions);
    const getMemberClassEnrollments = useClassEnrollmentStore((state) => state.getMemberClassEnrollments);
    const [memberSubscriptionsCount, setMemberSubscriptionsCount] = useState(0);
    const [memberClassEnrollmentsCount, setMemberClassEnrollmentsCount] = useState(0);

    useEffect(() => {
        if(mode === 'add'){
            setLoading(false);
          }
        if(id && mode !== 'add' && !member && id !== 'new'){
            fetchMember(id).then((member) => {
                if(member.success){
                    setMember(member.data);
                } else {
                    Swal.fire({
                        title: t(member.error.message),
                        text: t(member.error.details),
                        icon: 'error',
                        confirmButtonText: t('Ok')
                    });
                }
                
            }).finally(() => setLoading(false));
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
            const subscriptions = await getMemberSubscriptions(id);
            setMemberSubscriptionsCount(subscriptions && subscriptions.length);
            const classEnrollments = await getMemberClassEnrollments(id);
            setMemberClassEnrollmentsCount(classEnrollments && classEnrollments.length);
            setFetchData(false);
        }
        if(fetchData){
            fetchData();
        }
    }, [mode, member, fetchData, getMemberSubscriptions, fetchAttachment, fetchMember, id]);

    const validateFields = [
        {type: "name", value: firstName, message: t("Please enter a valid name!")},
        {type: "name", value: lastName, message: t("Please enter a valid name!")},
        {type: "email", value: email, message: t("Please enter a valid email!")},
        {type: "phone", value: phone, message: t("Please enter a valid phone number!")},
        {type: "id", value: identificationNumber, message: t("Please enter a valid ID number!")},
    ];

    const addFields = {
        firstName: firstName,
        lastName: lastName,
        identificationNumber: identificationNumber,
        email: email,
        phone: phone,
        gender: gender
    }
    const updateFields = {
        id: typeof id === 'string' && id !== 'new' ? id : member && member.id,
        firstName: firstName,
        lastName: lastName,
        identificationNumber: identificationNumber,
        email: email,
        phone: phone,
        gender: gender,
    }

    return (
        <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
        <FormHeader loading={loading} title="Member Details" mode={mode} setMode={setMode} addMethod={addMember} addFields={addFields} setRecord={setMember}
        updateMethod={updateMember} updateFields={updateFields} deleteMethod={deleteMember} validateFields={validateFields} error={error} stateStore={useMemberStore}>
            <HorozontalStepper stages={stages} currentStage={(stages.indexOf(member&&member.status)||0)} />
            <div style={{ paddingTop: 16}}>
                {member && 
                <div style={{display:"flex", flexDirection:"row"}}>
                <Button variant="soft"  sx={{mx: 1}} className='shadow-inner'
                    startDecorator={<FaCalendarAlt/>} 
                    endDecorator={<Typography fontSize="small" >{memberSubscriptionsCount}</Typography>}
                    onClick={() => navigate(`/subscriptions/member/${member.id}`)}
                    >
                        <Typography fontSize="small">{t("SUBSCRIPTIONS")}</Typography>
                </Button>

                <Button variant="soft" className='shadow-inner' sx={{mx: 1}}
                    startDecorator={<FaCalendarAlt/>}
                    endDecorator={<Typography fontSize="small" >{memberClassEnrollmentsCount}</Typography>}
                    onClick={() => navigate(`/class-enrollments/member/${member.id}`)}
                    >
                        <Typography fontSize="small">{t("CLASS ENROLLMENTS")}</Typography>
                </Button>
                </div>
                }
            </div>
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
                <FormLabel><Typography level='body-sm' startDecorator={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("First Name")}</Typography></FormLabel>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={mode === 'view'} />
            </FormControl>
            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Last Name")}</Typography></FormLabel>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<BadgeIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("ID Number")}</Typography></FormLabel>
                <Input type="number" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<RadioButtonCheckedIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Gender")}</Typography></FormLabel>
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
            <FormLabel><Typography level='body-sm' startDecorator={<Email sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Email")}</Typography></FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
            <FormLabel><Typography level='body-sm' startDecorator={<ContactsIcon sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Phone")}</Typography></FormLabel>
            <Input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={mode === 'view'} />
            </FormControl>

            </CardContent>
            <Box height={8} sx={{ gridColumn: '1/-1' }} />
            {member &&
            <>
            <a onClick={()=> setOpenPictureEdit(true)}>
            <img className='w-12 h-12 rounded-full border-2 border-white shadow-lg' src={profileSrc || (member.profilePicture && member.profilePicture.url) || "https://via.placeholder.com/300"}  alt="Profile" style={{width: 100, height: 100, borderRadius: 50}}/>
            </a>
            
            <ProfilePictureEdit open={openPictureEdit} setOpen={setOpenPictureEdit} src={profileSrc} setSrc={setProfileSrc} defaultSrc={profileSrc} memberId={member.id}/>
            </>
            }
        </FormBaseLayout>
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
          <img src={(defaultSrc&&defaultSrc.data) || src}  alt="Profile" style={{width: 300, height: 300, borderRadius: 10}}/>
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