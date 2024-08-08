import { Button, Chip, Stack, Step, StepButton, StepIndicator, Stepper } from "@mui/joy";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState } from "react";
import { Check } from "@mui/icons-material";
import { FaRegDotCircle } from "react-icons/fa";
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Snackbar from '@mui/joy/Snackbar';
import PDFPrint from "./ReportTools";
import { useTranslation } from "react-i18next";

export function SnackbarCustom({type, title, message, open, setOpen, duration}) {
    //const [open, setOpen] = React.useState(false);
    const {t} = useTranslation();

    const types = {
        "success": {color: 'success', icon: <CheckCircleIcon /> },
        "info": {color: 'success', icon: <InfoIcon /> },
        "warning": {color: 'warning', icon: <WarningIcon /> },
        "error": {color: 'danger', icon: <ReportIcon /> },
      }
    const {color, icon} = types[type];
    return (
      <>
        <Snackbar
          variant="soft"
          color={color}
          open={open}
          autoHideDuration={duration || 6000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            zIndex: 9999,
            position: "fixed",
            top: {xs: 12, sm: 16},
            left: {xs: "-30%", sm:"40%"},
          }}
          startDecorator={icon}
          endDecorator={
            <Button
              onClick={() => setOpen(false)}
              size="sm"
              variant="soft"
              color={color}
            >
              {t("Dismiss")}
            </Button>
          }
        >
          {t(message)}
        </Snackbar>
      </>
    );
  }

export function AlertCustom({ type, title, message}) {
  const types = {
    "success": {color: 'success', icon: <CheckCircleIcon /> },
    "info": {color: 'success', icon: <InfoIcon /> },
    "warning": {color: 'warning', icon: <WarningIcon /> },
    "error": {color: 'danger', icon: <ReportIcon /> },
  }
  
  const {color, icon} = types[type];

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: 'column' }}>
        <Alert
            key={title}
            sx={{ alignItems: 'flex-start' }}
            startDecorator={icon}
            variant="soft"
            color={color}
            endDecorator={
            <IconButton variant="soft" color={color}>
                <CloseRoundedIcon />
            </IconButton>
            }
        >
            <div>
            <div>{title}</div>
            <Typography level="body-sm" color={color}>
                {message}
            </Typography>
            </div>
        </Alert>
    </Box>
  );
}


export default function StatusChip({ status }) {
    return (
        <Chip
            variant="soft"
            size="sm"
            startDecorator={
                {
                    NEW: <AutoAwesomeIcon />,
                    PAID: <CheckRoundedIcon />,
                    SENT: <CheckRoundedIcon />,
                    ACTIVE: <PublishedWithChangesIcon />,
                    EXPIRED: <SyncDisabledIcon />,
                    FAILED: <BlockIcon />,
                    CANCELLED: <BlockIcon />,
                }[status]
            }
            color={
                {
                    NEW: 'neutral',
                    PAID: 'primary',
                    ACTIVE: 'success',
                    SENT: 'success',
                    EXPIRED: 'danger',
                    FAILED: 'danger',
                    CANCELLED: 'warning',
                }[status]
            }
            >
            {status}
            </Chip>
    )}


export function HorozontalStepper({ stages = ["NEW", "DONE"], currentStage = 1 }) {
    const [activeStep, setActiveStep] = useState(currentStage);
    const {t} = useTranslation();
    return (
        <Stepper sx={{ width: '100%', overflow:"clip"}}>
        {stages.map((step, index) => (
            <Step
                key={step}
                indicator={
                    <StepIndicator
                    variant={activeStep <= index ? 'soft' : 'soft'}
                    color={activeStep < index ? 'neutral' : 'primary'}
                    >
                    {activeStep < index ? index + 1 : (activeStep === index? <FaRegDotCircle fontSize="small"/> : <Check fontSize="small"/>)}
                    </StepIndicator>
                }
                sx={{
                    '&::after': {
                    ...(activeStep > index &&
                        index !== 2 && { bgcolor: 'primary.solidBg' }),
                    },
                }}
                >
                <StepButton sx={{fontSize:{xs:"0.7rem", sm:"0.8rem"}, fontWeight: activeStep === index ? "bold" : "normal", color: activeStep === index ? "primary.main" : "neutral"}}
                onClick={() => setActiveStep(activeStep||index)}>{t(step)}</StepButton>
            </Step>
        ))}
        </Stepper>
    );
    }

export function DocumentSnackbar({document, fileName, title, open, setOpen}) {
  const {t} = useTranslation();

  return (
    <div>
      <Snackbar
        autoHideDuration={5000}
        variant="soft"
        color="neutral"
        size="lg"
        invertedColors
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={(theme) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%})`,
          maxWidth: 360,
          zIndex: 9999,
          position: "fixed",
          top: {xs: 12, sm: 16},
          left: {xs: "-30%", sm:"40%"},
          //paddingTop: { xs: 14, sm: 3 },
        })}
      >
        <div>
          <Typography sx={{ mt: 1, mb: 2 }}>
            {t("Proceed To Download?")}
          </Typography>
          <Stack direction="row" spacing={1}>
            <PDFPrint document={document} fileName={fileName} title={title} setOpen={setOpen}/>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpen(false)}
            >
              {t("Cancel")}
            </Button>
          </Stack>
        </div>
      </Snackbar>
    </div>
  );
}