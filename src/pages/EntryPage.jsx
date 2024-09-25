import { useEffect, useState } from "react";
import useEntryStore from "../state/entryState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EntryPage({ defaultSearch="" }) {
    const [entries, fetchEntries] = useEntryStore((state) => [state.entries, state.fetchEntries]);
    const searchEntries = useEntryStore((state) => state.searchEntries);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchEntries();
        }
        if (search !== "") {
            searchEntries(search);
        }
    }, [fetchEntries, search, searchEntries, defaultSearch]);

    const columns = [
        {"name": "transaction", "label": "Transaction", "width": 180, "sort": true},
        {"name": "account", "label": "Account", "width": 280, "sort": true},
        {"name": "type", "label": "Type"},
        {"name": "debit", "label": "Debit", "special": "amount"},
        {"name": "credit", "label": "Credit", "special": "amount"},
    ]

    const rows = entries.map((entry) => ({
        "id": entry.id,
        "transaction": entry.transaction && entry.transaction.reference,
        "account": entry.account && entry.account.code + " - " + entry.account.name,
        "type": entry.type,
        "debit": entry.debit,
        "credit": entry.credit,
        "object": entry
    }));

    const listItems = entries.map((entry) => ({
        "id": entry.id,
        "avatar": entry.account.name.charAt(0),
        "title": entry.account.name,
        "subtitle": entry.type,
        "firstRow": [entry.debit, entry.credit],
        "secondRow": [entry.id],
        "status": "NEW",
        "object": entry
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Entries" formUrl="/entry-form" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/entry-form"/>
        </div>
    );
}
