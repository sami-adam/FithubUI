import { useEffect, useState } from "react";
import useProductCategoryStore from "../state/productCategoryState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProductCategoryPage({ defaultSearch="" }) {
    const [productCategories, fetchProductCategories] = useProductCategoryStore((state) => [state.productCategories, state.fetchProductCategories]);
    const searchProductCategories = useProductCategoryStore((state) => state.searchProductCategories);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchProductCategories();
        }
        if (search !== "") {
            searchProductCategories(search);
        }
    }, [fetchProductCategories, search, searchProductCategories, defaultSearch]);

    const columns = [
        {"name": "id", "label": "ID", "width": 140},
        {"name": "name", "label": "Name", "sort": true},
        {"name": "benefits", "label": "Benefits", "width": 350},
    ]

    const rows = productCategories.map((productCategory) => ({
        "id": productCategory.id,
        "name": productCategory.name,
        "benefits": productCategory.benefits.map(benefit => benefit.name).join(", "),
        "object": productCategory
    }));

    const listItems = productCategories.map((productCategory) => ({
        "id": productCategory.id,
        "avatar": productCategory.name.charAt(0),
        "title": productCategory.name,
        "subtitle": productCategory.description,
        "firstRow": [productCategory.id],
        "secondRow": [productCategory.description],
        "thirdRow": [""],
        "status": "NEW",
        "object": productCategory
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Product Categories" formUrl="/product-category-form" setSearch={setSearch}/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/product-category-form"/>
        </div>
    );
}