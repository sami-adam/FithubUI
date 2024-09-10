import { useEffect, useState } from "react";
import useTaxStore from "../state/taxState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function TaxPage({ defaultSearch="" }) {
    const [taxes, fetchTaxes] = useTaxStore((state) => [state.taxes, state.fetchTaxes]);
    const searchTaxes = useTaxStore((state) => state.searchTaxes);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchTaxes();
        }
        if (search !== "") {
            searchTaxes(search);
        }
    }, [fetchTaxes, search, searchTaxes, defaultSearch]);

    const columns = [
        {"name": "code", "label": "Code", "width": 140, "sort": true},
        {"name": "name", "label": "Name", "width": 200, "sort": true},
        {"name": "rate", "label": "Rate", "special": "percent"},
        {"name": "active", "label": "Active", "special": "boolean"}
    ]

    const rows = taxes.map((tax) => ({
        "id": tax.id,
        "code": tax.code,
        "name": tax.name,
        "rate": tax.rate,
        "active": tax.active,
        "objectId": tax.id
    }));

    const listItems = taxes.map((tax) => ({
        "id": tax.id,
        "avatar": tax.name.charAt(0),
        "title": tax.name,
        "subtitle": tax.code,
        "firstRow": [tax.rate, tax.active],
        "secondRow": [tax.id],
        "status": "NEW",
        "objectId": tax.id
    }));
    
    return (
        <div style={{ marginTop: "20px", paddingInlineStart: 8 }}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Taxes" formUrl="/tax-form" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/tax-form" />
        </div>
    );

}
