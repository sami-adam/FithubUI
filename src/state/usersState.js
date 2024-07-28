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
        } catch (error) {
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useUsersStore.getState().signInUrl;
            } else {
                console.error("Error fetching users", error);
            }
        }
    }
}));

export default useUsersStore;