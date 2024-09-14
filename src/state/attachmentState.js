import {create} from "zustand";
import axios from "axios";

const useAttachmentStore = create((set) => ({
    attachments: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchAttachments: async () => {
        try {
            const response = await axios.get(useAttachmentStore.getState().baseURL + "/attachments", {
                headers: {
                    "Authorization": "Bearer " + useAttachmentStore.getState().token,
                },
            });
            set({ attachments: response.data });
            return {success: true, data: response.data};
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useAttachmentStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            } else {
                return { success: false, error: { message: "Error fetching attachments!", details: error.response&&error.response.data.message}};
            }
        }
    },
    fetchAttachment: async (url) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    "Authorization": "Bearer " + useAttachmentStore.getState().token,
                },
            });
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error fetching attachment!", details: error.response&&error.response.data.message}};
        }
    }
}));

export default useAttachmentStore;