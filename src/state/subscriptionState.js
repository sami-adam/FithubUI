import {create} from "zustand";
import axios from "axios";

const useSubscriptionStore = create((set) => ({
    subscriptions: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_LOGIN_PAGE_URL,
    fetchSubscriptions: async () => {
        try {
            const response = await axios.get(useSubscriptionStore.getState().baseURL + "/subscriptions", {
                headers: {
                    Authorization: "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set({ subscriptions: response.data });
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.replace(useSubscriptionStore.getState().signInUrl);
        }
    },
    addSubscription: async (subscription) => {
        try {
            const response = await axios.post(`${useSubscriptionStore.getState().baseURL}/subscription`, subscription, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set((state) => ({ subscriptions: [...state.subscriptions, response.data] }));
        } catch (error) {
            console.error("Error adding subscription", error);
        }
    },
    updateSubscription: async (subscription) => {
        try {
            const response = await axios.put(`${useSubscriptionStore.getState().baseURL}/subscription/${subscription.id}`, subscription, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === subscription.id ? response.data : s)),
            }));
        } catch (error) {
            console.error("Error updating subscription", error);
        }
    },
    deleteSubscription: async (id) => {
        try {
            await axios.delete(`${useSubscriptionStore.getState().baseURL}/subscription/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set((state) => ({ subscriptions: state.subscriptions.filter((s) => s.id !== id) }));
        } catch (error) {
            console.error("Error deleting subscription", error);
        }
    },
    changeStatus: async (id) => {
        try {
            const response = await axios.put(`${useSubscriptionStore.getState().baseURL}/subscription/status/${id}`, {}, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === id ? response.data : s)),
            }));
        } catch (error) {
            console.error("Error changing status", error);
        }
    },
    searchSubscriptions: async (search) => {
        try {
            const response = await axios.get(`${useSubscriptionStore.getState().baseURL}/subscriptions/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set({ subscriptions: response.data });
        } catch (error) {
            console.error("Error searching subscriptions", error);
        }

    }
}))

export default useSubscriptionStore;