import {create} from "zustand";
import axios from "axios";

const useTransactionStore = create((set) => ({
    transactions: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchTransactions: async () => {
        try {
            const response = await axios.get(useTransactionStore.getState().baseURL + "/transactions", {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set({ transactions: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useTransactionStore.getState().signInUrl;
                return { success: false, error: { message: "Invalid token!", details: error.message } };
            } else {
                return { success: false, error: { message: "Error fetching transactions!", details: error.message } };
            }
        }
    },
    fetchTransaction: async (id) => {
        try {
            const response = await axios.get(`${useTransactionStore.getState().baseURL}/transaction/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching transaction!", details: error.message } };
        }
    },
    addTransaction: async (transaction) => {
        try {
            const response = await axios.post(`${useTransactionStore.getState().baseURL}/transaction`, transaction, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set((state) => ({ transactions: [...state.transactions, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding transaction!", details: error.message } };
        }
    },
    updateTransaction: async (transaction) => {
        try {
            const response = await axios.put(`${useTransactionStore.getState().baseURL}/transaction/${transaction.id}`, transaction, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set((state) => ({
                transactions: state.transactions.map((m) => (m.id === transaction.id ? response.data : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating transaction!", details: error.message } };
        }
    },
    deleteTransaction: async (id) => {
        try {
            await axios.delete(`${useTransactionStore.getState().baseURL}/transaction/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set((state) => ({ transactions: state.transactions.filter((m) => m.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting transaction!", details: error.message } };
        }
    },
    searchTransactions: async (searchTerm) => {
        try {
            const response = await axios.get(`${useTransactionStore.getState().baseURL}/transactions/search/${searchTerm}`, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set({ transactions: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching transactions!", details: error.message } };
        }
    },
    postTransaction: async (transaction) => {
        try {
            const response = await axios.get(`${useTransactionStore.getState().baseURL}/transaction/post/${transaction.id}`, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set((state) => ({
                transactions: state.transactions.map((m) => (m.id === transaction.id ? { ...m, status: "POSTED" } : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error posting transaction!", details: error.message } };
        }
    }
}));

export default useTransactionStore;