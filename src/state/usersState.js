import {create} from "zustand";
import axios from "axios";

const useUsersStore = create((set) => ({
    "users": [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchUsers: async () => {
        try {
            const response = await axios.get(useUsersStore.getState().baseURL + "/auth/users", {
                headers: {
                    "Authorization": "Bearer " + useUsersStore.getState().token,
                },
            });
            set({ users: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useUsersStore.getState().signInUrl;
                return { success: false, error: { message: "Invalid token!", details: error.response.data.message } };
            } else {
                return { success: false, error: { message: "Error fetching users!", details: error.response.data.message } };
            }
        }
    },
    serchUsers: async (search) => {
        try {
            const response = await axios.get(useUsersStore.getState().baseURL + "/auth/users/search/" + search, {
                headers: {
                    "Authorization": "Bearer " + useUsersStore.getState().token,
                },
            });
            set({ users: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching users!", details: error.response.data.message } };
        }

    }
}));

export default useUsersStore;