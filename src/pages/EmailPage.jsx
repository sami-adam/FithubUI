import { useEffect, useState } from "react";
import useEmailStore from "../state/emailState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EmailPage({ defaultSearch="" }) {
    const [emails, fetchEmails] = useEmailStore((state) => [state.emails, state.fetchEmails]);
    const serachEmails = useEmailStore((state) => state.serachEmails);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchEmails();
        }
        if (search !== "") {
            serachEmails(search);
        }
    }, [fetchEmails, search, serachEmails, defaultSearch]);

    const columns = [
        {"name": "id", "label": "ID", "width": 140},
        {"name": "subject", "label": "Subject", "sort": true, "width": 300},
        {"name": "emailFrom", "label": "From", "width": 220},
        {"name": "emailTo", "label": "To", "width": 220},
        {"name": "scheduledDate", "label": "Scheduled Date", "width": 250},
        {"name": "status", "label": "Status", "special": "status"},
    ]

    const rows = emails.map((email) => ({
        "id": "EM"+`${email.id}`.padStart(6, "0"),
        "subject": email.subject.substring(0, 30) + (email.subject.length > 30 ? "..." : ""),
        "emailFrom": email.emailFrom,
        "emailTo": email.emailTo,
        "scheduledDate": email.scheduledDate,
        "status": email.status,
    }));

    const listItems = emails.map((email) => ({
        "id": email.id,
        "avatar": email.emailFrom.charAt(0),
        "title": email.subject,
        "subtitle": email.emailTo,
        "firstRow": [email.emailFrom, email.scheduledDate],
        "status": email.status,
    }));
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Emails" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems}/>
        </div>
    );
}