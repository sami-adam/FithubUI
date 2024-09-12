import {create} from "zustand";
import axios from "axios";

const useSubscriptionStore = create((set) => ({
    subscriptions: [],
    totalPages: 0,
    pageSize: 0,
    currentPage: 0,
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_LOGIN_PAGE_URL,
    setCurrentPage: (page) => {
        set({ currentPage: page });
        useSubscriptionStore.getState().fetchSubscriptions(page);
    },
    fetchSubscriptions: async (currentPage=0) => {
        try {
            const response = await axios.get(useSubscriptionStore.getState().baseURL + `/subscriptions?page=${currentPage}&size=10&sort=reference,asc`, {
                headers: {
                    Authorization: "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set({ subscriptions: response.data.content, totalPages: response.data.page.totalPages, pageSize: response.data.page.size, currentPage: response.data.page.number });
            return { success: true, data: response.data.content };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions!", details: error.response.data.message } };
        }
    },
    fetchSubscription: async (id) => {
        try {
            const response = await axios.get(`${useSubscriptionStore.getState().baseURL}/subscription/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscription!", details: error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding subscription!", details: error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating subscription!", details: error.response.data.message } };
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
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting subscription!", details: error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error changing subscription status!", details: error.response.data.message } };
        }
    },
    searchSubscriptions: async (search) => {
        try {
            const response = await axios.get(`${useSubscriptionStore.getState().baseURL}/subscriptions/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set({ subscriptions: response.data.content, totalPages: response.data.page.totalPages, pageSize: response.data.page.size, currentPage: response.data.page.number });
            return { success: true, data: response.data.content };
        } catch (error) {
            return { success: false, error: { message: "Error searching subscriptions!", details: error.response.data.message } };
        }

    },
    getMemberSubscriptions: async (id) => {
        try {
            const response = await axios.get(`${useSubscriptionStore.getState().baseURL}/subscriptions/member/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
            set({ subscriptions: response.data });
            return response.data;
        } catch (error) {
            console.error("Error fetching member subscriptions", error);
        }
    },
    exportExcel: async (ids) => {
        try {
            const response = await axios.get(`${useSubscriptionStore.getState().baseURL}/subscriptions/excel/${ids}`, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Subscriptions.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error printing excel", error);
        }
    },
    generateAccountTransaction: async (id) => {
        try {
            await axios.post(`${useSubscriptionStore.getState().baseURL}/subscription/account-transaction/${id}`, {}, {
                headers: {
                    "Authorization": "Bearer " + useSubscriptionStore.getState().token,
                },
            });
        } catch (error) {
            console.error("Error generating account transaction", error);
        }
    }
}))

export default useSubscriptionStore;