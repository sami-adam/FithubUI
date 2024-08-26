import { useEffect, useState } from "react";
import useEmployeeStore from "../state/employeeState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function EmployeePage({ defaultSearch="" }) {
    const [employees, fetchEmployees] = useEmployeeStore((state) => [state.employees, state.fetchEmployees]);
    const searchEmployees = useEmployeeStore((state) => state.searchEmployees);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchEmployees();
        }
        if (search !== "") {
            searchEmployees(search);
        }
    }, [fetchEmployees, search, searchEmployees, defaultSearch]);

    const columns = [
        {"name": "id", "label": "Identification Number", "width": 140},
        {"name": "name", "label": "Full Name", "sort": true, "width": 300, special: "person"},
        {"name": "employeeType", "label": "Employee Type", "width": 120},
        {"name": "phone", "label": "Phone"},
        {"name": "address", "label": "Address", "width": 200},
    ]

    const rows = employees.map((employee) => ({
        "id": employee.identificationNumber,
        "name": employee.name,
        "email": employee.email,
        "phone": employee.phone,
        "address": employee.address,
        "employeeType": t(employee.employeeType),
        "object": employee
    }));

    const listItems = employees.map((employee) => ({
        "id": employee.identificationNumber,
        "avatar": employee.name.charAt(0),
        "title": employee.name,
        "subtitle": employee.email,
        "firstRow": [employee.address, employee.identificationNumber],
        "secondRow": [employee.phone, ""],
        "thirdRow": [employee.email, t(employee.employeeType)],
        "status": "NEW",
        "object": employee
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} setSearch={setSearch} pageTitle="Employees" formUrl="/employee-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/employee-form"/>
        </div>
    );
}