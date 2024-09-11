import {create} from "zustand";
import axios from "axios";

const useEmployeeStore = create((set) => ({
    employees: [],
    error: null,
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
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useEmployeeStore.getState().signInUrl;
                set({ error: "Unauthorized access" });
            } else {
                set({ error: "Error fetching employees!"});
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
            return response.data;
        } catch (error) {
            set({ error: "Error fetching employee, make sure you are logged in!"});
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
        } catch (error) {
            set({ error: "Error adding employee, make sure you are logged in!" });
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
        } catch (error) {
            set({ error: "Error updating employee, make sure you are logged in!" });
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
        } catch (error) {
            set({ error: "Error deleting employee, make sure you are logged in!"});
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
        } catch (error) {
            set({ error: "Error searching employees!" });
        }
    },
}));

export default useEmployeeStore;