// @ts-nocheck
import {OIDictionary} from "../../../../services/http/http.dto.ts";
import {
    _str_asset_search_label,
    _str_asset_sort_by_label,
    _str_collection_label, _str_filter_btn,
    _str_filter_label,
    _str_operation_type, _str_operations_list_sort_by_amount_asc, _str_operations_list_sort_by_amount_desc,
    _str_operations_list_sort_by_date_asc,
    _str_operations_list_sort_by_date_desc,
    _str_transaction_type_label
} from "../../../../helpers/intl/texts.tokens.ts";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {CButton, CCol, CFormInput, CFormSelect, CListGroup, CListGroupItem, CRow, CSpinner} from "@coreui/react";
import FirstSpinner from "../../../components/first_spinner.tsx";
import {DisplayTextHelper} from "../../../../helpers/display.text.helper.ts";
import {DateRangePicker} from "../../../components/daterange.picker.tsx";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";


export interface TOperationsListFormProps {
    isLoadingCollections: boolean,
    isLoadingTypes: boolean,
    isLoadingList: boolean,
    collections: OIDictionary,
    operationsTypes: OIDictionary,
    transactionsTypes: OIDictionary,
    onCollectionChanged: (collection: string) => void,
    onFormSubmit: (filters: TOperationsListFormFilters) => void,
    filters?: string,
}

export interface TOperationsListFormFilters {
    collection: string;
    operationType: string;
    transactionType: string;
    dateRange: Date[];
    search: string;
    sortBy: string;
}

export const OperationsListListFormSortOptions: {[type: string]: string} = {
    date_desc: _str_operations_list_sort_by_date_desc,
    date_asc: _str_operations_list_sort_by_date_asc,
    amount_desc: _str_operations_list_sort_by_amount_desc,
    amount_asc: _str_operations_list_sort_by_amount_asc,
}

export function parseSavedFilters (savedFilters: string | null) : TOperationsListFormFilters | null {
    if (savedFilters != null) {
        try {
            const jsonFilters: any = JSON.parse(savedFilters);
            const filters: TOperationsListFormFilters = {};
            if (jsonFilters.collection) filters.collection = jsonFilters.collection as string;
            if (jsonFilters.operationType) filters.operationType = jsonFilters.operationType as string;
            if (jsonFilters.transactionType) filters.transactionType = jsonFilters.transactionType as string;
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

export function OperationsListFormComponent(props: TOperationsListFormProps): React.ReactNode {
    const { t } = useTranslation();

    const [collection, setCollection] = useState("");
    const [operationType, setOperationType] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [dateRange, setDateRange] = useState<Array<Date>>([null, null]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");

    function handleFormSubmit(e: Event) {
        e.preventDefault();
        const filters: TOperationsListFormFilters = {
            collection: collection,
            operationType: operationType,
            transactionType: transactionType,
            dateRange: dateRange,
            search: search,
            sortBy: sortBy,
        }
        if (props.onFormSubmit) {
            props.onFormSubmit(filters);
        }
    }

    useEffect(() => {
        if (props.filters) {
            const parsedFilters = parseSavedFilters(props.filters);
            if (parsedFilters) {
                setCollection(parsedFilters.collection);
                setOperationType(parsedFilters.operationType);
                setTransactionType(parsedFilters.transactionType);
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
                                    {
                                        props.isLoadingTypes ? (
                                            <CCol md={3} xs={12} className={"mt-3"}>
                                                <CSpinner color="primary" size="sm"/>
                                            </CCol>
                                        ) : (
                                            <>
                                                <CCol md={3} xs={12}>
                                                    <small>{t(_str_operation_type)}</small>
                                                    <CFormSelect
                                                        value={operationType}
                                                        onChange={(e) => setOperationType(e.target.value)}
                                                    >
                                                        <option value="">...</option>
                                                        {
                                                            // eslint-disable-next-line react/prop-types
                                                            Object.keys(props.operationsTypes || {}).map((operationType, index) => (
                                                                <option key={index} value={operationType}>
                                                                    {DisplayTextHelper.getInstance().getDisplayTextFromDict(props.operationsTypes[operationType], operationType)}
                                                                </option>
                                                            ))
                                                        }
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol md={3} xs={12}>
                                                    <small>{t(_str_transaction_type_label)}</small>
                                                    <CFormSelect
                                                        value={transactionType}
                                                        onChange={(e) => setTransactionType(e.target.value)}
                                                    >
                                                        <option value="">...</option>
                                                        {
                                                            // eslint-disable-next-line react/prop-types
                                                            Object.keys(props.transactionsTypes || {}).map((transactionType, index) => (
                                                                <option key={index} value={transactionType}>
                                                                    {DisplayTextHelper.getInstance().getDisplayTextFromDict(props.transactionsTypes[transactionType], transactionType)}
                                                                </option>
                                                            ))
                                                        }
                                                    </CFormSelect>
                                                </CCol>
                                            </>
                                        )
                                    }
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
                                                Object.keys(OperationsListListFormSortOptions).map((operationsSort, index) => (
                                                    <option key={index} value={operationsSort}>
                                                        {t(OperationsListListFormSortOptions[operationsSort])}
                                                    </option>
                                                ))
                                            }
                                        </CFormSelect>
                                    </CCol>
                                </CRow>

                                <div className={"mx-auto mb-2 mt-4"}>
                                    <CButton color="primary" className="px-4 text-white" onClick={handleFormSubmit}
                                             disabled={props.isLoadingList}>
                                        {props.isLoadingList ?
                                            <CSpinner color="white" size="sm"/> : t(_str_filter_btn)}
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

