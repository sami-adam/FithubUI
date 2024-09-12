import {create} from "zustand";
import axios from "axios";

const useEmployeeStore = create((set) => ({
    employees: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchEmployees: async () => {
        try {
            const response = await axios.get(useEmployeeStore.getState().baseURL + "/employees", {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set({ employees: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useEmployeeStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            } else {
                return { success: false, error: { message: "Error fetching employees!", details: error.message } };
            }
        }
    },
    fetchEmployee: async (id) => {
        try {
            const response = await axios.get(`${useEmployeeStore.getState().baseURL}/employee/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching employee!", details: error.message } };
        }
    },
    addEmployee: async (employee) => {
        try {
            const response = await axios.post(`${useEmployeeStore.getState().baseURL}/employee`, employee, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set((state) => ({ employees: [...state.employees, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding employee!", details: error.message } };
        }
    },
    updateEmployee: async (employee) => {
        try {
            const response = await axios.put(`${useEmployeeStore.getState().baseURL}/employee/${employee.id}`, employee, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set((state) => ({
                employees: state.employees.map((m) => (m.id === employee.id ? response.data : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating employee!", details: error.message } };
        }
    },
    deleteEmployee: async (id) => {
        try {
            await axios.delete(`${useEmployeeStore.getState().baseURL}/employee/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set((state) => ({ employees: state.employees.filter((m) => m.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting employee!", details: error.message } };
        }
    },
    searchEmployees: async (search) => {
        try {
            const response = await axios.get(useEmployeeStore.getState().baseURL + "/employees/search/" + search, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set({ employees: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching employees!", details: error.message } };
        }
    },
}));

export default useEmployeeStore;