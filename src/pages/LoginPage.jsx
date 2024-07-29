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


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);

  const handleLogin = async () => {
    await fetchUser({ email, password });
  }

  useEffect(() => {
    if (user && user.name) {
      window.location.href = "/home";
    }
  }, [user])


  return (
    <main>
      <CssBaseline />
      <div style={{ paddingInlineStart: 80, paddingBlockStart: 30 }}>
      <Sheet
        sx={{
          width: 300,
          mx: 'auto', // margin left & right
          my: 6, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
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
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@email.com" 
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input  
            id="password"
            name="password"
            type="password"
            placeholder="password" 
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button sx={{ mt: 1 /* margin top */}} onClick={handleLogin} type='button'>Log in</Button>
        <Typography
          endDecorator={<Link href="/sign-up">Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
      </div>
    </main>
  );
}
