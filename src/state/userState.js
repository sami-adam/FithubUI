import {create} from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
    user: {},
    baseURL: process.env.REACT_APP_BASE_URL,
    loginPageUrl: process.env.REACT_APP_LOGIN_PAGE_URL,
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
            return { success: true, data: user.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching user!", details: error.response&&error.response.data?error.response.data:error } };
        }
    },
    createUser: async (userDict) => {
        try {
            const response = await axios.post(useUserStore.getState().baseURL + "/auth/signUp", userDict);
            // localStorage.setItem('token', response.data.data.token);
            // if (! localStorage.getItem("refreshToken")) {
            //     localStorage.setItem('refreshToken', response.data.data.refreshToken);
            // }
            // const user = await axios.get(useUserStore.getState().baseURL + "/auth/user", {
            //     headers: {
            //         "Authorization": "Bearer " + localStorage.getItem("token"),
            //     },
            // });
            // localStorage.setItem('user', JSON.stringify(user.data));
            // set({ user: user.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error creating user!", details: error.response&&error.response.data?error.response.data:error } };
        }
    },
}));

export default useUserStore;