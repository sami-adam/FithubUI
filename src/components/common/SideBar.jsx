import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { closeSidebar } from './../../utils';
import DarkMode from './DarkMode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import { BsFillPersonVcardFill } from "react-icons/bs";
import { Button, ListSubheader } from '@mui/joy';
import { BiNews } from "react-icons/bi";
//import useEmailStore from "../../state/emailState";
import { FaUsersRectangle } from "react-icons/fa6";
import { SiFitbit } from "react-icons/si";
import LanguageSwitch from './LanguageSwitch';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { MenuToggler } from './Menus';
import DatasetIcon from '@mui/icons-material/Dataset';

export default function Sidebar({children}) {
  //const [emails, fetchEmails] = useEmailStore((state) => [state.emails, state.fetchEmails]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }


  useEffect(() => {
    //fetchEmails();
    if (user && !user.name && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, [user]);
  return (
    <div style={{display:"flex",flexDirection:"row"}}>
      {user && user.name &&
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: i18n.language === 'en'? 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))' : 'translateX(calc(-100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: i18n.language === 'en'? 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))':
            'translateX(calc(-100% * (var(--SideNavigation-slideIn, 0) - 1) - var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' , justifyContent:"space-between"}}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">FitHub</Typography>
        <DarkMode sx={{ ml: 'auto' }} />
      </Box>
      <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder={t("Search")} />
      <Box className="sidebar-overlay"
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => navigate("/home")} selected={"/home" === window.location.pathname}>
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">{t("Home")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => navigate("/dashboard")} selected={"/dashboard" === window.location.pathname}>
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">{t("Dashboard")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton role="menuitem" onClick={() => navigate("/subscriptions")} selected={"/subscriptions" === window.location.pathname}>
              <CalendarMonthIcon />
              <ListItemContent>
                <Typography level="title-sm">{t("Subscriptions")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton role="menuitem" onClick={() => navigate("/fitness-classes")} selected={"/fitness-classes" === window.location.pathname}>
              <SiFitbit fontSize={18}/>
              <ListItemContent>
                <Typography level="title-sm">{t("Fitness Classes")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton role="menuitem" onClick={() => navigate("/employees")} selected={"/employees" === window.location.pathname}>
              <BsFillPersonVcardFill fontSize={18}/>
              <ListItemContent>
                <Typography level="title-sm">{t("Employees")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton role="menuitem" onClick={() => navigate("/members")} selected={"/members" === window.location.pathname}>
              <GroupsIcon />
              <ListItemContent>
                <Typography level="title-sm">{t("Members")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem nested>
          </ListItem>
          <ListItem>
            <ListItemButton  onClick={() => navigate("/emails")} selected={"/emails" === window.location.pathname}>
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">{t("Emails")}</Typography>
              </ListItemContent>
              <Chip size="sm" color="primary" variant="solid">
                {14}
              </Chip>
            </ListItemButton>
          </ListItem>
          <ListItem nested>
            <ListSubheader>{t("Master Data")}</ListSubheader>
            <MenuToggler mainMenu={"Master Data"} icon={<DatasetIcon/>}>
            <List>
              <ListItem>
                <ListItemButton role="menuitem" onClick={() => navigate("/products")} selected={"/products" === window.location.pathname}>
                  <BiNews />
                  <ListItemContent>
                    <Typography level="title-sm">{t("Subscription Types")}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton role="menuitem" onClick={() => navigate("/users")} selected={"/users" === window.location.pathname}>
                  <FaUsersRectangle />
                  <ListItemContent>
                    <Typography level="title-sm">{t("Users")}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
            </MenuToggler>
          </ListItem>
          
          <ListItem nested>
    
          </ListItem>
        </List>
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => navigate("/support")} selected={"/support" === window.location.pathname}>
              <SupportRoundedIcon />
              {t("Support")}
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <NotificationsIcon />
              {t("Notifications")}
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              {t("Settings")}
            </ListItemButton>
          </ListItem>
        </List>

        <LanguageSwitch />
        
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
        >{user.name[0]}</Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{user.name}</Typography>
          <Typography level="body-xs">{user.email}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={handleLogout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>}
    <div style={{display:"flex",justifyContent:"center", alignItems:"start", width:"80%"}}>
        {children}
    </div>
    <div style={{paddingTop:{xs: 36, sm:14}, display: window.location.pathname.includes("form")? "block": "none"}}>
      <Button variant='contained' onClick={() => window.history.back()}
      ><Typography>{t("Back")}</Typography></Button>
    </div>
    </div>
  );
}
