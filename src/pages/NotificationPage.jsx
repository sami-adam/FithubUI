import { useEffect } from "react";
import useNotificationStore from "../state/notificationState";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Button, Card, CardActions, IconButton, List, ListItem, ListItemDecorator, Tooltip, Typography } from "@mui/joy";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MarkEmailReadOutlined } from "@mui/icons-material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { MarkEmailUnreadOutlined } from "@mui/icons-material";

export default function NotificationPage({ defaultSearch="" }) {
    const [notifications, fetchNotifications] = useNotificationStore((state) => [state.notifications, state.fetchNotifications]);
    const fetchUserUnreadNotifications = useNotificationStore((state) => state.fetchUserUnreadNotifications);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const markAsUnread = useNotificationStore((state) => state.markAsUnread);
    const {t} = useTranslation();
    const user = localStorage.getItem("user");

    useEffect(() => {
        fetchNotifications(user && JSON.parse(user).id);
        fetchUserUnreadNotifications(user && JSON.parse(user).id);
    }, [fetchNotifications, fetchUserUnreadNotifications]);

    const handleMarkRead = (id) => {
        markAsRead(id);
        fetchNotifications();
        fetchUserUnreadNotifications(user && JSON.parse(user).id);
    }

    const handleMarkUnread = (id) => {
        markAsUnread(id);
        fetchNotifications();
        fetchUserUnreadNotifications(user && JSON.parse(user).id);
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: {xs:"100%", sm:"80%"} }}>
        <Box sx={{marginTop: {xs:"45px", sm:"25px"}, paddingInlineStart: {xs:0, sm:8}}}>
            <Typography level="h2" component="h1">
                {t("Notifications")}
            </Typography>
        </Box>

        <Box sx={{ width: "100%", marginTop: "30px", paddingLeft: {xs: 2, sm:8} }}>  
            <List
                component="nav"
                sx={{
                    maxWidth: "100%",
                    width: "100%",
                }}
                >
                {notifications.map((notification) => (
                <ListItem sx={{borderRadius: 2, mb: 1}}>
                    <Card sx={{width:{xs: "100%", "sm": "80%"}, border: "1px solid", borderColor:"divider",
                        '&:hover': {
                            borderColor: "primary.main"
                        }
                        }} variant="soft">
                        <ListItemDecorator>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                            
                                <Typography gutterBottom level="title-md" startDecorator={<Avatar size="sm" className="w-12 h-12 rounded-full border-2 border-white shadow-lg"><NotificationsIcon color={notification.read ? "disabled" : "primary"} sx={{ fontSize:24 }}/></Avatar>} component="div">{notification.title}</Typography>
                                <div style={{ display: "flex", flexDirection: "row"}}>
                                    {notification.read ? null :
                                    <Tooltip title={t("Mark as read")}>
                                        <IconButton onClick={()=> handleMarkRead(notification.id)} variant="plain"><MarkEmailReadOutlined sx={{opacity:0.8}}/></IconButton>
                                    </Tooltip> }
                                    {!notification.read ? null :
                                    <Tooltip title={t("Mark as Unread")}>
                                        <IconButton variant="plain" onClick={()=> handleMarkUnread(notification.id)}><MarkEmailUnreadOutlined sx={{opacity:0.8}}/></IconButton>
                                    </Tooltip> }
                                    <Tooltip title={t("Delete")}>
                                        <IconButton variant="plain"><DeleteOutlineOutlined sx={{opacity:0.8}}/></IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        </ListItemDecorator>
                        <Typography variant="body2">{notification.message}</Typography>
                    </Card>
                </ListItem>
                ))}
            </List>
        </Box>
        </Box>
    );
}
