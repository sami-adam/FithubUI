import { useEffect, useState } from "react";
import useUsersStore from "../state/usersState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserPage({ defaultSearch="" }) {
    const [users, fetchUsers] = useUsersStore((state) => [state.users, state.fetchUsers]);
    const serchUsers = useUsersStore((state) => state.serchUsers);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchUsers();
        }
        if (search !== "") {
            serchUsers(search);
        }
    }, [fetchUsers, search, serchUsers, defaultSearch]);

    const columns = [
        {"name": "id", "label": "ID", "width": 120},
        {"name": "username", "label": "Username", "sort": true, "width": 200},
        {"name": "company", "label": "Company"},
        {"name": "email", "label": "Email", "width": 300},
        {"name": "role", "label": "Role"}
    ]

    const rows = users.map((user) => ({
        "id": user.id,
        "username": user.username,
        "company": user.company && user.company.name,
        "email": user.email,
        "role": user.role
    }));

    const listItems = users.map((user) => ({
        "id": user.id,
        "avatar": user.username.charAt(0),
        "title": user.username,
        "subtitle": user.email,
        "firstRow": [user.role, user.id],
        "status": "NEW",
    }));
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Users" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems}/>
        </div>
    )
}