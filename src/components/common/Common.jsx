import { Chip, Step, StepButton, StepIndicator, Stepper } from "@mui/joy";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState } from "react";
import { Check } from "@mui/icons-material";
import { FaRegDotCircle } from "react-icons/fa";

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
                onClick={() => setActiveStep(activeStep||index)}>{step}</StepButton>
            </Step>
        ))}
        </Stepper>
    );
    }