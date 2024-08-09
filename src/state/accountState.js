import {create} from "zustand";
import axios from "axios";

const usAccountStore = create((set) => ({
    accounts: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchAccounts: async () => {
        try {
            const response = await axios.get(usAccountStore.getState().baseURL + "/accounts", {
                headers: {
                    "Authorization": "Bearer " + usAccountStore.getState().token,
                },
            });
            set({ accounts: response.data });
        } catch (error) {
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = usAccountStore.getState().signInUrl;
            } else {
                console.error("Error fetching products", error);
            }
        }
    },
    addAccount: async (account) => {
        try {
            const response = await axios.post(`${usAccountStore.getState().baseURL}/account`, account, {
                headers: {
                    "Authorization": "Bearer " + usAccountStore.getState().token,
                },
            });
            set((state) => ({ accounts: [...state.accounts, response.data] }));
        } catch (error) {
            console.error("Error adding account", error);
        }
    },
    updateAccount: async (account) => {
        try {
            const response = await axios.put(`${usAccountStore.getState().baseURL}/account/${account.id}`, account, {
                headers: {
                    "Authorization": "Bearer " + usAccountStore.getState().token,
                },
            });
            set((state) => ({
                accounts: state.accounts.map((m) => (m.id === account.id ? response.data : m)),
            }));
        } catch (error) {
            console.error("Error updating account", error);
        }
    },
    deleteAccount: async (id) => {
        try {
            await axios.delete(`${usAccountStore.getState().baseURL}/account/${id}`, {
                headers: {
                    "Authorization": "Bearer " + usAccountStore.getState().token,
                },
            });
            set((state) => ({ accounts: state.accounts.filter((m) => m.id !== id) }));
        } catch (error) {
            console.error("Error deleting account", error);
        }
    },
    searchAccounts: async (searchTerm) => {
        try {
            const response = await axios.get(`${usAccountStore.getState().baseURL}/accounts/search/${searchTerm}`, {
                headers: {
                    "Authorization": "Bearer " + usAccountStore.getState().token,
                },
            });
            set({ accounts: response.data });
        } catch (error) {
            console.error("Error searching accounts", error);
        }
    }

}));

export default usAccountStore;