import {create} from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
    user: {},
    baseURL: process.env.REACT_APP_BASE_URL,
    loginPageUrl: process.env.REACT_APP_LOGIN_PAGE_URL,
    error: null,
    fetchUser: async (userDict) => {
        try {
            const response = await axios.post(useUserStore.getState().baseURL + "/auth/signIn", userDict);
            localStorage.setItem('token', response.data.data.token);
            if (! localStorage.getItem("refreshToken")) {
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            const user = await axios.get(useUserStore.getState().baseURL + "/auth/user", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            });
            localStorage.setItem('user', JSON.stringify(user.data));
            set({ user: user.data });
        } catch (error) {
            set({ error: error.response&&error.response.data?error.response.data:error });
        }
    }
}));

export default useUserStore;