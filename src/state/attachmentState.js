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
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useAttachmentStore.getState().signInUrl;
            } else {
                console.error("Error fetching attachments", error);
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
            return response.data;
        } catch (error) {
            console.error("Error fetching attachment", error);
        }
    }
}));

export default useAttachmentStore;