import {create} from "zustand";
import axios from "axios";

const useDashboardStore = create((set) => ({
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    getSubscriptionsByProduct: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-product", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by product!", details: error.message } };
        }
    },
    getSubscriptionsByProductCategory: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-product-category", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by product category!", details: error.message } };
        }
    },
    getSubscriptionsByYear: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year!", details: error.message } };
        }
    },
    getSubscriptionsByYear2: async (year) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year/" + year, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year!", details: error.message } };
        }
    },
    getSubscriptionsByYearAndMonth: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-and-month", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year and month", details: error.message } };
        }
    },
    getSubscriptionsByYearAndMonth2: async (year) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-and-month/" + year, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year and month", details: error.message } };
        }
    },
    getSubscriptionsByYearAndMonth3: async (year, month) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-and-month/" + year + "/" + month, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year and month", details: error.message } };
        }
    },
    getSubscriptionsByYearMonthAndDay: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year, month, and day", details: error.message } };
        }
    },
    getSubscriptionsByYearMonthAndDay2: async (year) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day/" + year, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year, month, and day", details: error.message } };
        }
    },
    getSubscriptionsByYearMonthAndDay3: async (year, month) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day/" + year + "/" + month, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year, month, and day", details: error.message } };
        }
    },
    getSubscriptionsByYearMonthAndDay4: async (year, month, day) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day/" + year + "/" + month + "/" + day, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching subscriptions by year, month, and day", details: error.message } };
        }
    },
}));

export default useDashboardStore;