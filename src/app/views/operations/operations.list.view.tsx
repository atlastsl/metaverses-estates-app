// @ts-nocheck
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Pagination, {DEFAULT_TAKE, TAKES_OPTIONS} from "../../components/pagination.tsx";
import React, {useEffect, useState} from "react";
import {OIDictionary} from "../../../services/http/http.dto.ts";
import {parseSavedFilters} from "./components/operations.list.form.comp.tsx";
import {Operation} from "../../../data/operations/operations.dto.ts";
import DataTable, {TableColumn} from "react-data-table-component";
import {
    _str_actions_label,
    _str_collection_label,
    _str_list_no_items_found,
    _str_operation_amount,
    _str_operation_asset_label,
    _str_operation_date,
    _str_operation_receiver,
    _str_operation_sender,
    _str_operation_type,
    _str_operations_page,
    _str_transaction_type_label,
    _str_view_btn
} from "../../../helpers/intl/texts.tokens.ts";
import {StringsHelper} from "../../../helpers/strings.helper.ts";
import {ASSET_DETAILS_PAGE, OPERATION_DETAILS_PATE, STAKEHOLDER_DETAILS_PAGE} from "../../pages/pageslist.ts";
import {getOperationTotalAmount} from "../../../data/operations/operations.functions.tsx";
import {DatesHelper} from "../../../helpers/dates.helper.ts";
import {Link} from "react-router-dom";
import {CButton, CCard, CCardBody, CListGroup, CListGroupItem} from "@coreui/react";
import FirstSpinner from "../../components/first_spinner.tsx";
import {CIcon} from "@coreui/icons-react";
import {cilReload} from "@coreui/icons";
import {OperationsListFormComponent, TOperationsListFormFilters} from "./components/operations.list.form.comp.tsx";
import {blue_mel} from "../../components/colors.tsx";
import {LocalstorageService, LS_ASSETS_FILTERS} from "../../../services/localstorage/localstorage.service.ts";
import {OperationsRepository} from "../../../data/operations/operations.repository.ts";


export default function OperationsListView () {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const dispatch = useDispatch();
    let operationsRowsPerPage = useSelector((state) => state.operationsRowsPerPage);
    if (operationsRowsPerPage === 0) {
        operationsRowsPerPage = DEFAULT_TAKE;
    }

    const [loadingFirstPage, setLoadingFirstPage] = useState(false);
    const [loadingNavigation, setLoadingNavigation] = useState(false);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [operations, setOperations] = useState<Operation[]>([]);

    const [collections, setCollections] = useState<OIDictionary>({});
    const [operationsTypes, setOperationsTypes] = useState<OIDictionary>({});
    const [transactionsTypes, setTransactionsTypes] = useState<OIDictionary>({});
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [loadingTxTypes, setLoadingTxTypes] = useState<OIDictionary>({});
    const [savedFilters, setSavedFilters] = useState<string | undefined>(undefined);
    const [filters, setFilters] = useState<TOperationsListFormFilters | null>(null);

    function handleViewOperationDetails (operation: Operation) {
        window.open(StringsHelper.getInstance().replaceAll(OPERATION_DETAILS_PATE, ':operation_id', operation._id), '_blank');
    }

    async function handlePaginationUpdated (page: number, take: number, e?: Event): Promise<void> {
        if (e) e.preventDefault();
        await getOperationsList(page, take, filters);
    }

    function handleFiltersSubmitted(filters: TOperationsListFormFilters) : void {
        setFilters(filters);
        LocalstorageService.getInstance().setItem<string>(LS_ASSETS_FILTERS, JSON.stringify(filters));
        getOperationsList(page, operationsRowsPerPage, filters).then();
    }

    async function getOperationsList (page: number, take: number, filters?: TOperationsListFormFilters): Promise<void> {
        setLoadingNavigation(l => !l);

        const response = await new OperationsRepository(navigate, source.token).getOperationsList({
            page: page,
            take: take,
            collection: filters?.collection,
            operation_type: filters?.operationType,
            transaction_type: filters?.transactionType,
            date_min: filters?.dateRange?.[0],
            date_max: filters?.dateRange?.[1],
            search: filters?.search,
            sort: filters?.sortBy,
        });
        if (response) {
            setOperations(response.operations);
            setTotal(response.pagination.total);
            setPage(response.pagination.page);
        }

        setLoadingNavigation(l => !l);
        setLoadingTxTypes(false);
    }

    async function getCollections (): Promise<void> {
        setLoadingCollections(l => !l);

        const response = await new OperationsRepository(navigate, source.token).getCollections();
        if (response) {
            setCollections(response.collections);
        }

        setLoadingCollections(l => !l);
    }

    async function getTxTypes (collection: string): Promise<void> {
        setLoadingTxTypes(l => !l);

        const repository = new OperationsRepository(navigate, source.token);
        const response1 = await repository.getOperationsTypes(collection);
        if (response1) {
            setOperationsTypes(response1.operations_types);
        }
        const response2 = await repository.getTransactionsTypes(collection);
        if (response2) {
            setTransactionsTypes(response2.transactions_types);
        }

        setLoadingTxTypes(l => !l);
    }

    async function init() {
        setLoadingFirstPage(t => !t);

        const savedFilters = LocalstorageService.getInstance().getItem<string>(LS_ASSETS_FILTERS);
        setSavedFilters(savedFilters);
        await getCollections();
        await getOperationsList(1, operationsRowsPerPage, savedFilters ? parseSavedFilters(savedFilters) : undefined);

        setLoadingFirstPage(t => !t);
    }

    function cancelInit() {
        source.cancel();
    }

    useEffect(
        () => {
            init().then();
            return () => cancelInit();
        },
        []
    );

    const columns: TableColumn<Operation>[] = [
        {
            name: t(_str_operation_asset_label),
            cell: row => <div className={"fw-normal one-line"}>
                <a href={StringsHelper.getInstance().replaceAll(ASSET_DETAILS_PAGE, ':asset_id', row.asset)}
                   target={'_blank'}>
                    {row.asset_id}
                </a>
            </div>,
            hide: "sm",
            width: "200px"
        },
        {
            name: t(_str_collection_label),
            cell: row => <div className="fw-normal one-line">
                {t(`collection_${row.collection}`)}
            </div>,
            hide: "md",
            width: "120px",
        },
        {
            name: t(_str_operation_type),
            cell: row => <div className={"one-line operation_type-"+row.operation_type.toLowerCase()}>
                {t(`operation_type_${row.operation_type.toLowerCase()}`)}
            </div>,
            hide: "sm",
            width: "120px",
        },
        {
            name: t(_str_transaction_type_label),
            cell: row => <div className={"one-line transaction_type-"+row.transaction_type.toLowerCase()}>
                {t(`transaction_type_${row.transaction_type.toLowerCase()}`)}
            </div>,
            hide: "md",
            width: "120px",
        },
        {
            name: t(_str_operation_sender),
            cell: row => <div className={"me-2 fw-normal one-line"}>
                <a href={StringsHelper.getInstance().replaceAllArray(STAKEHOLDER_DETAILS_PAGE, [':address', ':collection'], [row.sender, row.collection])}
                   target={'_blank'}>
                    {row.sender}
                </a>
            </div>,
            hide: "md",
            width: "140px",
        },
        {
            name: t(_str_operation_receiver),
            cell: row => <div className={"me-2 fw-normal one-line"}>
                <a href={StringsHelper.getInstance().replaceAllArray(STAKEHOLDER_DETAILS_PAGE, [':address', ':collection'], [row.recipient, row.collection])}
                   target={'_blank'}>
                    {row.recipient}
                </a>
            </div>,
            hide: "sm",
            width: "140px",
        },
        {
            name: t(_str_operation_amount),
            cell: row => <div className={"one-line fw-medium"}>
                {getOperationTotalAmount(row, true)}
            </div>,
            width: "120px",
        },
        {
            name: t(_str_operation_date),
            cell: row => <div className={"one-line"}>{DatesHelper.getInstance().printDateAndTime(row.mvt_date)}</div>,
            width: "140px",
            hide:"sm"
        },
        {
            name: t(_str_actions_label),
            cell: (row) => (
                <Link to={'#'} onClick={() => handleViewOperationDetails(row)}>
                    <CButton color="primary" variant="ghost" className="border-primary fw-medium" size="sm">
                        {t(_str_view_btn)}
                    </CButton>
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            width: "100px",
            button: true,
            omit: false
        }
    ]

    return (
        <>

            <CCard className={"mb-4"}>
                <CCardBody>

                    <OperationsListFormComponent
                        isLoadingCollections={loadingCollections}
                        isLoadingTypes={loadingTxTypes}
                        isLoadingList={loadingNavigation}
                        collections={collections}
                        operationsTypes={operationsTypes}
                        transactionsTypes={transactionsTypes}
                        filters={savedFilters}
                        onFormSubmit={handleFiltersSubmitted}
                        onCollectionChanged={getTxTypes}
                    />

                    <h6>{t(_str_operations_page)}</h6>

                    <CListGroup>
                        <CListGroupItem>

                            <div className={'pt-2 pb-2'}>

                                {loadingFirstPage ? (
                                    FirstSpinner()
                                ) : (
                                    <>

                                        <div className="d-flex justify-content-end align-content-center mb-2">
                                            <Pagination
                                                options={"GET"}
                                                total={total}
                                                page={page}
                                                get={handlePaginationUpdated}
                                            />
                                            <CButton color="primary" size="sm"
                                                     onClick={(e) => handlePaginationUpdated(1, operationsRowsPerPage, e)}>
                                                <CIcon icon={cilReload}/>
                                            </CButton>
                                        </div>

                                        {
                                            loadingNavigation ? (
                                                FirstSpinner()
                                            ) : (
                                                <div className="mb-2">
                                                    {
                                                        operations.length === 0 ? (
                                                            <div className="text-center my-5">
                                                                {t(_str_list_no_items_found)}
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-center mb-3">

                                                                <DataTable
                                                                    noHeader={true}
                                                                    columns={columns}
                                                                    data={operations}
                                                                    expandableRows={false}
                                                                    highlightOnHover
                                                                    striped={false}
                                                                    responsive
                                                                    paginationPerPage={operationsRowsPerPage}
                                                                    paginationRowsPerPageOptions={TAKES_OPTIONS}
                                                                    customStyles={{
                                                                        headRow: {
                                                                            style: {
                                                                                backgroundColor: blue_mel,
                                                                                color: 'white',
                                                                                fontWeight: 'bold'
                                                                            }
                                                                        }
                                                                    }}
                                                                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                                                        dispatch({type: 'set', userRowsPerPage: currentRowsPerPage})
                                                                        handlePaginationUpdated(currentPage, currentRowsPerPage, undefined).then()
                                                                    }}
                                                                />

                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }

                                    </>
                                )}

                            </div>

                        </CListGroupItem>
                    </CListGroup>


                </CCardBody>
            </CCard>

        </>
    )
}
