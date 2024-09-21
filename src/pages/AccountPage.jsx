import { useEffect, useState } from "react";
import useAccountStore from "../state/accountState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AccountPage({ defaultSearch="" }) {
    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);
    const searchAccounts = useAccountStore((state) => state.searchAccounts);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchAccounts();
        }
        if (search !== "") {
            searchAccounts(search);
        }
    }, [fetchAccounts, search, searchAccounts, defaultSearch]);

    const columns = [
        {"name": "code", "label": "Code", "width": 140, "sort": true},
        {"name": "name", "label": "Name", "width": 280},
        {"name": "type", "label": "Type", "width": 200},
        {"name": "debit", "label": "Debit", "special": "amount"},
        {"name": "credit", "label": "Credit", "special": "amount"},
        {"name": "balance", "label": "Balance", "special": "amount"}
    ]

    const rows = accounts.map((account) => ({
        "id": account.code,
        "code": account.code,
        "name": account.name,
        "type": account.type,
        "debit": account.debit,
        "credit": account.credit,
        "balance": account.balance,
        "objectId": account.id
    }));

    const listItems = accounts.map((account) => ({
        "id": account.code,
        "avatar": account.name.charAt(0),
        "title": account.name,
        "subtitle": account.code,
        "firstRow": [account.debit, account.credit],
        "secondRow": [account.balance, ""],
        "status": "NEW",
        "objectId": account.id
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Accounts" formUrl="/account-form" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/account-form"/>
        </div>
    );
}
