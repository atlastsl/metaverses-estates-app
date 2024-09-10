// @ts-nocheck
import {CButton, CCol, CFormInput, CFormSelect, CListGroup, CListGroupItem, CRow, CSpinner} from "@coreui/react";
import {OIDictionary} from "../../../../services/http/http.dto.ts";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DisplayTextHelper} from "../../../../helpers/display.text.helper.ts";
import FirstSpinner from "../../../components/first_spinner.tsx";
import {DateRangePicker} from "../../../components/daterange.picker.tsx";
import {
    _str_asset_search_label,
    _str_asset_sort_by_label,
    _str_asset_type_label,
    _str_assets_list_sort_by_created_at,
    _str_assets_list_sort_by_name,
    _str_assets_list_sort_by_nb_operations_asc,
    _str_assets_list_sort_by_nb_operations_desc,
    _str_assets_list_sort_by_updated_at,
    _str_collection_label,
    _str_filter_btn,
    _str_filter_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";

export interface TAssetsListFormProps {
    isLoadingCollections: boolean,
    isLoadingAssetsTypes: boolean,
    isLoadingList: boolean,
    collections: OIDictionary,
    assetsTypes: OIDictionary,
    onCollectionChanged: (collection: string) => void,
    onFormSubmit: (filters: TAssetsListFormFilters) => void,
    filters?: string,
}

export interface TAssetsListFormFilters {
    collection: string;
    assetType: string;
    dateRange: Date[];
    search: string;
    sortBy: string;
}

export const AssetsListFormSortOptions: {[type: string]: string} = {
    updated_at: _str_assets_list_sort_by_updated_at,
    created_at: _str_assets_list_sort_by_created_at,
    nb_operations_asc: _str_assets_list_sort_by_nb_operations_asc,
    nb_operations_desc: _str_assets_list_sort_by_nb_operations_desc,
    name: _str_assets_list_sort_by_name,
}

export function parseSavedFilters (savedFilters: string | null) : TAssetsListFormFilters | null {
    if (savedFilters != null) {
        try {
            const jsonFilters: any = JSON.parse(savedFilters);
            const filters: TAssetsListFormFilters = {};
            if (jsonFilters.collection) filters.collection = jsonFilters.collection as string;
            if (jsonFilters.assetType) filters.assetType = jsonFilters.assetType as string;
            if (jsonFilters.dateRange) {
                filters.dateRange = jsonFilters.dateRange.map(x => x != null ? new Date(x) : null)
            }
            if (jsonFilters.search) filters.search = jsonFilters.search as string;
            if (jsonFilters.sortBy) filters.sortBy = jsonFilters.sortBy as string;
            return filters;
        } catch (e) {}
    }
    return null;
}

export function AssetsListFormComponent(props: TAssetsListFormProps): React.ReactNode {
    const { t } = useTranslation();

    const [collection, setCollection] = useState("");
    const [assetType, setAssetType] = useState("");
    const [dateRange, setDateRange] = useState<Array<Date>>([null, null]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");

    function handleFormSubmit(e: Event) {
        e.preventDefault();
        const filters: TAssetsListFormFilters = {
            collection: collection,
            assetType: assetType,
            dateRange: dateRange,
            search: search,
            sortBy: sortBy,
        }
        if (props.onFormSubmit) {
            props.onFormSubmit(filters);
        }
    }

    function handleCollectionChanged(newValue: string) {
        setCollection(newValue);
        if (props.onCollectionChanged) {
            props.onCollectionChanged(newValue);
        }
    }

    useEffect(() => {
        if (props.filters) {
            const parsedFilters = parseSavedFilters(props.filters);
            if (parsedFilters) {
                setCollection(parsedFilters.collection);
                setAssetType(parsedFilters.assetType);
                setDateRange(parsedFilters.dateRange);
                setSearch(parsedFilters.search);
                setSortBy(parsedFilters.sortBy);
            }
        }
    }, [props.filters]);

    useEffect(() => {
        if (!StringsHelper.getInstance().isStringEmpty(collection) && props.onCollectionChanged) {
            props.onCollectionChanged(collection);
        }
    }, [collection]);

    return (
        <div className={"mb-4"}>

            <h6>{t(_str_filter_label)}</h6>

            <CListGroup>
                <CListGroupItem>

                    {
                        props.isLoadingCollections ? (
                            FirstSpinner()
                        ) : (
                            <>

                                <CRow className={"mb-1 align-items-center"}>
                                    <CCol md={3} xs={12}>
                                        <small>{t(_str_collection_label)}</small>
                                        <CFormSelect
                                            value={collection}
                                            onChange={(e) => setCollection(e.target.value)}
                                        >
                                            <option value="">...</option>
                                            {
                                                // eslint-disable-next-line react/prop-types
                                                Object.keys(props.collections || {}).map((collection, index) => (
                                                    <option key={index} value={collection}>
                                                        {DisplayTextHelper.getInstance().getDisplayTextFromDict(props.collections[collection])}
                                                    </option>
                                                ))
                                            }
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={3} xs={12}>
                                        {
                                            props.isLoadingAssetsTypes ? (
                                                <CSpinner color="primary" size="sm" className={'mt-3'}/>
                                            ) : (
                                                <>
                                                    <small>{t(_str_asset_type_label)}</small>
                                                    <CFormSelect
                                                        value={assetType}
                                                        onChange={(e) => setAssetType(e.target.value)}
                                                    >
                                                        <option value="">...</option>
                                                        {
                                                            // eslint-disable-next-line react/prop-types
                                                            Object.keys(props.assetsTypes || {}).map((assetType, index) => (
                                                                <option key={index} value={assetType}>
                                                                    {DisplayTextHelper.getInstance().getDisplayTextFromDict(props.assetsTypes[assetType])}
                                                                </option>
                                                            ))
                                                        }
                                                    </CFormSelect>
                                                </>
                                            )
                                        }
                                    </CCol>
                                </CRow>

                                <CRow className={"justify-content-center align-items-center mb-1 mt-3"}>
                                    <CCol md={6} xs={12}>
                                        <DateRangePicker values={dateRange} onChange={(dates) => setDateRange(dates)}/>
                                    </CCol>
                                    <CCol md={6} xs={12}>
                                        <small>{t(_str_asset_search_label)}</small>
                                        <CFormInput
                                            placeholder={"..."}
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </CCol>
                                </CRow>

                                <CRow className={"mb-1 mt-3"}>
                                    <CCol md={3} xs={12}>
                                        <small>{t(_str_asset_sort_by_label)}</small>
                                        <CFormSelect
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            {
                                                // eslint-disable-next-line react/prop-types
                                                Object.keys(AssetsListFormSortOptions).map((assetsSort, index) => (
                                                    <option key={index} value={assetsSort}>
                                                        {t(AssetsListFormSortOptions[assetsSort])}
                                                    </option>
                                                ))
                                            }
                                        </CFormSelect>
                                    </CCol>
                                </CRow>

                                <div className={"mx-auto mb-2 mt-4"}>
                                    <CButton color="primary" className="px-4 text-white" onClick={handleFormSubmit} disabled={props.isLoadingList}>
                                        {props.isLoadingList ? <CSpinner color="white" size="sm" /> : t(_str_filter_btn)}
                                    </CButton>
                                </div>

                            </>
                        )
                    }

                </CListGroupItem>
            </CListGroup>

        </div>
    )
}
