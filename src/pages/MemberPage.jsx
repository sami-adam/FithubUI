import { useEffect, useState } from "react";
import useMemberStore from "../state/memberState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function MemberPage({ defaultSearch = "" }) {
    const [members, fetchMembers] = useMemberStore((state) => [state.members, state.fetchMembers]);
    const searchMembers = useMemberStore((state) => state.searchMembers);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);

    const {t} = useTranslation();
    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchMembers();
        }
        if (search !== "") {
            searchMembers(search);
        }
    }, [fetchMembers, search, searchMembers, defaultSearch]);

    const columns = [
        {"name": "id", "label": "ID Number", "width": 120},
        {"name": "name", "label": "Full Name", "sort": true, "width": 180},
        {"name": "email", "label": "Email", "width": 220},
        {"name": "phone", "label": "Phone", "width": 120},
        {"name": "gender", "label": "Gender", "width": 80, "sort": true},
        {"name": "status", "label": "Status", "special": "status"},
    ]


    const rows = members.map((member) => ({
        "id": member.identificationNumber,
        "firstName": member.firstName,
        "lastName": member.lastName,
        "name": member.firstName + " " + member.lastName,
        "email": member.email,
        "phone": member.phone,
        "gender": t(member.gender),
        "status": member.status,
        "object": member,
    }));

    const listItems = members.map((member) => ({
        "id": member.identificationNumber,
        "avatar": member.firstName.charAt(0),
        "title": member.firstName + " " + member.lastName,
        "subtitle": member.email,
        "firstRow": [member.gender, member.identificationNumber],
        "status":"NEW",
        "object": member,
    }));
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Members" formUrl="/member-form" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/member-form"/>
        </div>
    );
}