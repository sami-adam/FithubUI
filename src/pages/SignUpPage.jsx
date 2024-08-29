import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useEffect, useState } from 'react';
import useUserStore from '../state/userState';
import { SnackbarCustom } from '../components/common/Common';
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const createUser = useUserStore((state) => state.createUser);
  const user = useUserStore((state) => state.user);
  const error = useUserStore((state) => state.error);
  const [open, setOpen] = useState(Boolean(error))

  const {t} = useTranslation();

  const handleSignUp = async () => {
    await createUser({
      "name": name,
      "email": email,
      "username": username,
      "password": password,
      //"phoneNumber": phoneNumber,
    }).then(() => {
      window.location.href = "/user-created";
    });
  }

  useEffect(() => {
    if (user && user.name) {
      window.location.href = "/user-created";
    }
    if (error) {
      setOpen(true);
    }
  }, [user, error]);

  return (
    <main style={{ width: "100%"}}>
      <CssBaseline />
      <div style={{display: "flex", justifyContent: "center", paddingBlockStart:80 , width: "100%"}} dir={i18n.dir()}>
        <Sheet
          sx={{
            //mx: 'auto',
            width: "50%",
            my: 6,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
          variant="outlined"
        >
          <div style={{display:"flex",justifyContent:"center"}}>
            <Typography level="h1" component="h1">FitHub</Typography>
          </div>
          <div>
            {error && <SnackbarCustom type="error" message={error.message} open={open} setOpen={setOpen} />}
            <Typography level="h4" component="h1">
              <b>{t("Join FitHub!")}</b>
            </Typography>
            <Typography level="body-sm">{t("Create your account to get started.")}</Typography>
          </div>
          <FormControl>
            <FormLabel>{t("Name")}</FormLabel>
            <Input
              id="name"
              name="name"
              placeholder="John Doe" 
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("Email")}</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@email.com" 
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("Username")}</FormLabel>
            <Input
              id="username"
              name="username"
              placeholder="john_doe" 
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("Password")}</FormLabel>
            <Input  
              id="password"
              name="password"
              type="password"
              placeholder="********" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("Phone Number")} ({t("Optional")})</FormLabel>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+966 ** *** ****" 
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </FormControl>
          <Button sx={{ mt: 1 }} onClick={handleSignUp} type='button'>{t("Sign Up")}</Button>
          <Typography
            endDecorator={<Link href="/login">{t("Log in")}</Link>}
            fontSize="sm"
            sx={{ alignSelf: 'center' }}
          >
            {t("Already have an account?")}
          </Typography>
        </Sheet>
      </div>
    </main>
  );
}
