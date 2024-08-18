import {create} from "zustand";
import axios from "axios";

const useNotificationStore = create((set) => ({
    notifications: [],
    readNotifications: [],
    unreadNotifcations: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchNotifications: async () => {
        try {
            const response = await axios.get(useNotificationStore.getState().baseURL + "/notifications", {
                headers: {
                    "Authorization": "Bearer " + useNotificationStore.getState().token,
                },
            });
            set({ notifications: response.data });
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    },
    fetchUserNotifications: async (userId) => {
        try {
            const response = await axios.get(useNotificationStore.getState().baseURL + `/notifications/${userId}`, {
                headers: {
                    "Authorization": "Bearer " + useNotificationStore.getState().token,
                },
            });
            set({ notifications: response.data });
            set({ readNotifications: response.data.filter((n) => n.read) });
            set({ unreadNotifcations: response.data.filter((n) => !n.read) });
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    },
    fetchUserUnreadNotifications: async (userId) => {
        try {
            const response = await axios.get(useNotificationStore.getState().baseURL + `/notifications/unread/${userId}`, {
                headers: {
                    "Authorization": "Bearer " + useNotificationStore.getState().token,
                },
            });
            set({ unreadNotifcations: response.data });
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    },
    addNotification: async (notification) => {
        try {
            const response = await axios.post(`${useNotificationStore.getState().baseURL}/notification`, notification, {
                headers: {
                    "Authorization": "Bearer " + useNotificationStore.getState().token,
                },
            });
            set((state) => ({ notifications: [...state.notifications, response.data] }));
            set((state) => ({ unreadNotifcations: [...state.unreadNotifcations, response.data] }));
        } catch (error) {
            console.error("Error adding notification", error);
        }
    },
    markAsRead: async (id) => {
        try {
            const response = await axios.put(`${useNotificationStore.getState().baseURL}/notification/${id}/mark-read`, {}, {
                headers: {
                    "Authorization": "Bearer " + useNotificationStore.getState().token,
                },
            });
            set((state) => ({
                notifications: state.notifications.map((n) => (n.id === id ? response.data : n)),
                readNotifications: state.readNotifications.concat(response.data),
                unreadNotifcations: state.unreadNotifcations.filter((n) => n.id !== id),
            }));
        } catch (error) {
            console.error("Error updating notification", error);
        }
    },
    markAsUnread: async (id) => {
        try {
            const response = await axios.put(`${useNotificationStore.getState().baseURL}/notification/${id}/mark-unread`, {}, {
                headers: {
                    "Authorization": "Bearer " + useNotificationStore.getState().token,
                },
            });
            set((state) => ({
                notifications: state.notifications.map((n) => (n.id === id ? response.data : n)),
                readNotifications: state.readNotifications.filter((n) => n.id !== id),
                unreadNotifcations: state.unreadNotifcations.concat(response.data),
            }));
        } catch (error) {
            console.error("Error updating notification", error);
        }
    },
}));

export default useNotificationStore;