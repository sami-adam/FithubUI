import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";

export default function UserCreatedPage() {
  const { t } = useTranslation();

  return (
    <main style={{ width: "100%" }}>
      <CssBaseline />
      <div style={{ paddingInlineStart: 80, paddingBlockStart: 30 }} dir={i18n.dir()}>
        <Sheet
          sx={{
            width: "50%",
            mx: 'auto',
            my: 6,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
            textAlign: 'center'
          }}
          variant="outlined"
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography level="h1" component="h1">FitHub</Typography>
          </div>
          <div>
            <Typography level="h4" component="h1" color='success'>
              <b>{t("Account Created!")}</b>
            </Typography>
            <Typography level="body-sm">
              {t("Your account has been successfully created.")}
            </Typography>
          </div>
          <Button 
            component={Link} 
            href="/login" 
            variant="solid" 
            sx={{ mt: 2 }} 
          >
            {t("Go to Login")}
          </Button>
        </Sheet>
      </div>
    </main>
  );
}
