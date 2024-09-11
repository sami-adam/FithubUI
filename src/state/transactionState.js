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
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useTransactionStore.getState().signInUrl;
            } else {
                console.error("Error fetching transactions", error);
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
            return response.data;
        } catch (error) {
            console.error("Error fetching transaction", error);
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
            return response.data;
        } catch (error) {
            console.error("Error adding transaction", error);
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
        } catch (error) {
            console.error("Error updating transaction", error);
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
        } catch (error) {
            console.error("Error deleting transaction", error);
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
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    },
    postTransaction: async (transaction) => {
        try {
            await axios.get(`${useTransactionStore.getState().baseURL}/transaction/post/${transaction.id}`, {
                headers: {
                    "Authorization": "Bearer " + useTransactionStore.getState().token,
                },
            });
            set((state) => ({
                transactions: state.transactions.map((m) => (m.id === transaction.id ? { ...m, status: "POSTED" } : m)),
            }));
        } catch (error) {
            console.error("Error posting transaction", error);
        }
    }
}));

export default useTransactionStore;