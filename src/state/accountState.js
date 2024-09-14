import {create} from "zustand";
import axios from "axios";

const useAccountStore = create((set) => ({
    accounts: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchAccounts: async () => {
        try {
            const response = await axios.get(useAccountStore.getState().baseURL + "/accounts", {
                headers: {
                    "Authorization": "Bearer " + useAccountStore.getState().token,
                },
            });
            set({ accounts: response.data });
            return {success: true, data: response.data};
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useAccountStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            } else {
                return { success: false, error: { message: "Error fetching accounts!", details: error.response&&error.response.data.message}};
            }
        }
    },
    fetchAccount: async (id) => {
        try {
            const response = await axios.get(`${useAccountStore.getState().baseURL}/account/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useAccountStore.getState().token,
                },
            });
            return {success: true, data: response.data};
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useAccountStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            }
            if (error.response && error.response.status === 404) {
                window.location.href = "/404";
                return { success: false, error: { message: "Account not found!", details: "The account you are looking for does not exist!" } };
            }
            return { success: false, error: { message: "Error fetching account!", details: error.response&&error.response.data.message}};
        }
    },
    addAccount: async (account) => {
        try {
            const response = await axios.post(`${useAccountStore.getState().baseURL}/account`, account, {
                headers: {
                    "Authorization": "Bearer " + useAccountStore.getState().token,
                },
            });
            set((state) => ({ accounts: [...state.accounts, response.data] }));
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error adding account!", details: error.response&&error.response.data.message}};
        }
    },
    updateAccount: async (account) => {
        try {
            const response = await axios.put(`${useAccountStore.getState().baseURL}/account/${account.id}`, account, {
                headers: {
                    "Authorization": "Bearer " + useAccountStore.getState().token,
                },
            });
            set((state) => ({
                accounts: state.accounts.map((m) => (m.id === account.id ? response.data : m)),
            }));
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error updating account!", details: error.response&&error.response.data.message}};
        }
    },
    deleteAccount: async (id) => {
        try {
            await axios.delete(`${useAccountStore.getState().baseURL}/account/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useAccountStore.getState().token,
                },
            });
            set((state) => ({ accounts: state.accounts.filter((m) => m.id !== id) }));
            return {success: true};
        } catch (error) {
            return { success: false, error: { message: "Error deleting account!", details: error.response&&error.response.data.message}};
        }
    },
    searchAccounts: async (searchTerm) => {
        try {
            const response = await axios.get(`${useAccountStore.getState().baseURL}/accounts/search/${searchTerm}`, {
                headers: {
                    "Authorization": "Bearer " + useAccountStore.getState().token,
                },
            });
            set({ accounts: response.data });
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error searching accounts!", details: error.response&&error.response.data.message}};
        }
    }

}));

export default useAccountStore;