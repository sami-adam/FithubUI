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
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by product", error);
        }
    },
    getSubscriptionsByProductCategory: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-product-category", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by product category", error);
        }
    },
    getSubscriptionsByYear: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year", error);
        }
    },
    getSubscriptionsByYear2: async (year) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year/" + year, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year", error);
        }
    },
    getSubscriptionsByYearAndMonth: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-and-month", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year and month", error);
        }
    },
    getSubscriptionsByYearAndMonth2: async (year) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-and-month/" + year, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year and month", error);
        }
    },
    getSubscriptionsByYearAndMonth3: async (year, month) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-and-month/" + year + "/" + month, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year and month", error);
        }
    },
    getSubscriptionsByYearMonthAndDay: async () => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day", {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year, month, and day", error);
        }
    },
    getSubscriptionsByYearMonthAndDay2: async (year) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day/" + year, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year, month, and day", error);
        }
    },
    getSubscriptionsByYearMonthAndDay3: async (year, month) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day/" + year + "/" + month, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year, month, and day", error);
        }
    },
    getSubscriptionsByYearMonthAndDay4: async (year, month, day) => {
        try {
            const response = await axios.get(useDashboardStore.getState().baseURL + "/dashboard/subscriptions-by-year-month-and-day/" + year + "/" + month + "/" + day, {
                headers: {
                    "Authorization": "Bearer " + useDashboardStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions by year, month, and day", error);
        }
    },
}));

export default useDashboardStore;