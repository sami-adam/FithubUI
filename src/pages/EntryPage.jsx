import { useEffect } from "react";
import useEntryStore from "../state/entryState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function EntryPage() {
    const [entries, fetchEntries] = useEntryStore((state) => [state.entries, state.fetchEntries]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const columns = [
        {"name": "account", "label": "Account", "width": 120, "sort": true},
        {"name": "type", "label": "Type"},
        {"debit": "debit", "label": "Debit", "special": "amount"},
        {"credit": "credit", "label": "Credit", "special": "amount"},
    ]

    const rows = entries.map((entry) => ({
        "id": entry.id,
        "account": entry.account.name,
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
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Entries" formUrl="/entry-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/entry-form"/>
        </div>
    );
}
