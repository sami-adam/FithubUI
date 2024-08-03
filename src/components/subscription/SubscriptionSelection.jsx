import * as React from 'react';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Button, ButtonGroup, Card, Stack, Typography } from '@mui/joy';
import { Check } from '@mui/icons-material';

export default function SubscriptionSelection() {
  return (
    <>
    <RadioGroup
      aria-label="platform"
      defaultValue="Website"
      overlay
      name="platform"
      sx={{
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: '3px solid',
            borderColor: 'primary.500',
          },
        },
        [`& .${radioClasses.radio}`]: {
          display: 'contents',
          '& > svg': {
            zIndex: 2,
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            bgcolor: 'background.surface',
            borderRadius: '50%',
          },
        },
      }}
    >
      {['Silver', 'Gold', 'Perimium'].map((value) => (
        <Card
          key={value}
          variant="soft"
          sx={{
            borderRadius: 'md',
            boxShadow: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            minWidth: 120,
          }}
        >
          <Radio id={value} value={value} checkedIcon={<CheckCircleRoundedIcon />} />
          <FormLabel sx={{fontSize:18}} htmlFor={value}>{value}</FormLabel>
            <Stack direction="column" spacing={0.5} sx={{ display: 'flex', alignItems: "center", justifyContent: "flex-start" }}>
                <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"flex-start"}}>
                <Typography startDecorator={<Check/>} variant="contained" color="text.primary" >Gym Access</Typography>
                <Typography startDecorator={<Check/>} variant="contained" color="text.primary" >Group Classes</Typography>
                <Typography startDecorator={<Check/>} variant="contained" color="text.primary" >Personal Training</Typography>
                <Typography startDecorator={<Check/>} variant="contained" color="text.primary" >Nutrition</Typography>
                </div>
            </Stack>
        </Card>
      ))}
    </RadioGroup>

    <RadioGroup
      aria-label="platform"
      defaultValue="Website"
      overlay
      name="platform"
      sx={{
        flexDirection: 'row',
        gap: 2,
        paddingTop: 2,
        display: 'flex',
        justifyContent: 'center',
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: '3px solid',
            borderColor: 'primary.500',
          },
        },
        [`& .${radioClasses.radio}`]: {
          display: 'contents',
          '& > svg': {
            zIndex: 2,
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            bgcolor: 'background.surface',
            borderRadius: '50%',
          },
        },
      }}
    >
      {['1 Month', "3 Months", "6 Months", "1 Year"].map((value) => (
        <Card
          key={value}
          variant="soft"
          sx={{
            borderRadius: 'md',
            boxShadow: 'sm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            minWidth: 200,
          }}
        >
          <Radio id={value} value={value} checkedIcon={<CheckCircleRoundedIcon />} />
          <FormLabel sx={{ fontSize: 18}} htmlFor={value}>{value}</FormLabel>

          <div>
            <Typography variant="contained" color="primary" startDecorator={<Typography>SAR</Typography>}>3,672</Typography>
          </div>
        </Card>
      ))}
    </RadioGroup>

    </>
  );
}