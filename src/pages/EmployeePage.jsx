import { useEffect } from "react";
import useEmployeeStore from "../state/employeeState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function EmployeePage() {
    const [employees, fetchEmployees] = useEmployeeStore((state) => [state.employees, state.fetchEmployees]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const columns = [
        {"name": "id", "label": "Identification Number", "width": 120},
        {"name": "name", "label": "Full Name", "sort": true},
        {"name": "email", "label": "Email"},
        {"name": "phone", "label": "Phone"},
        {"name": "address", "label": "Address"}
    ]

    if (employees.length === 0) {
        return <div>Loading...</div>;
    }

    const rows = employees.map((employee) => ({
        "id": employee.identificationNumber,
        "name": employee.name,
        "email": employee.email,
        "phone": employee.phone,
        "address": employee.address
    }));

    const listItems = employees.map((employee) => ({
        "id": employee.identificationNumber,
        "avatar": employee.name.charAt(0),
        "title": employee.name,
        "subtitle": employee.email,
        "firstRow": [employee.address, employee.identificationNumber],
        "secondRow": [employee.phone, ""],
        "thirdRow": [employee.email, ""],
        "status": "NEW",
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Employees"/>
            <DataList i18nIsDynamicList={true} listItems={listItems}/>
        </div>
    );
}