import { useEffect } from "react";
import useAccountStore from "../state/accountState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function AccountPage() {
    const [accounts, fetchAccounts] = useAccountStore((state) => [state.accounts, state.fetchAccounts]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const columns = [
        {"name": "code", "label": "Code", "width": 120, "sort": true},
        {"name": "name", "label": "Name"},
        {"name": "type", "label": "Type"},
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
        "object": account
    }));

    const listItems = accounts.map((account) => ({
        "id": account.code,
        "avatar": account.name.charAt(0),
        "title": account.name,
        "subtitle": account.code,
        "firstRow": [account.debit, account.credit],
        "secondRow": [account.balance, ""],
        "status": "NEW",
        "object": account
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Accounts" formUrl="/account-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/account-form"/>
        </div>
    );
}