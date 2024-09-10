// @ts-nocheck
import {AssetDetailsMainInfoProps} from "./props.ts";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    _str_actions_label,
    _str_asset_operations_title,
    _str_list_no_items_found,
    _str_operation_amount,
    _str_operation_date,
    _str_operation_receiver,
    _str_operation_sender,
    _str_operation_type,
    _str_view_btn
} from "../../../../helpers/intl/texts.tokens.ts";
import DataTable, {TableColumn} from "react-data-table-component";
import {useNavigate} from "react-router";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Pagination, {DEFAULT_TAKE, TAKES_OPTIONS} from "../../../components/pagination.tsx";
import {Operation} from "../../../../data/operations/operations.dto.ts";
import FirstSpinner from "../../../components/first_spinner.tsx";
import {CButton} from "@coreui/react";
import {CIcon} from "@coreui/icons-react";
import {cilReload} from "@coreui/icons";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";
import {Link} from "react-router-dom";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";
import {OPERATION_DETAILS_PATE, STAKEHOLDER_DETAILS_PAGE} from "../../../pages/pageslist.ts";
import {getOperationTotalAmount} from "../../../../data/operations/operations.functions.tsx";
import {AssetsRepository} from "../../../../data/assets/assets.repository.ts";
import {blue_mel} from "../../../components/colors.tsx";

export function AssetDetailsOperationsComp(props: AssetDetailsMainInfoProps): React.ReactNode {
    const { asset } = props;
    const { t } = useTranslation();

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

    async function getAssetOperations (page: number, take: number, e?: Event): Promise<void> {
        setLoadingNavigation(l => !l);

        const response = await new AssetsRepository(navigate, source.token).getAssetOperationsList(
            asset?.id || "",
            {
                page,
                take
            }
        )
        if (response) {
            setOperations(response.operations);
            setPage(response.pagination.page);
            setTotal(response.pagination.total);
        }

        setLoadingNavigation(l => !l);
    }

    function handleViewOperationDetails (operation: Operation) {
        window.open(StringsHelper.getInstance().replaceAll(OPERATION_DETAILS_PATE, ':operation_id', operation._id), '_blank');
    }

    async function init() {
        if (asset != null) {
            setLoadingFirstPage(t => !t);

            await getAssetOperations(1, operationsRowsPerPage);

            setLoadingFirstPage(t => !t);
        }
    }

    function cancelInit() {
        source.cancel();
    }

    useEffect(
        () => {
            init().then();
            return () => cancelInit();
        },
        [asset]
    );

    const columns: TableColumn<Operation>[] = [
        {
            name: t(_str_operation_type),
            cell: row => <div className={"one-line operation_type-"+row.operation_type.toLowerCase()}>
                {t(`operation_type_${row.operation_type.toLowerCase()}`)}
            </div>,
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
            hide: "sm",
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
        },
        {
            name: t(_str_operation_amount),
            cell: row => <div className={"one-line fw-medium"}>
                {getOperationTotalAmount(row, true)}
            </div>,
            width: "160px",
        },
        {
            name: t(_str_operation_date),
            cell: row => <div className={"one-line"}>{DatesHelper.getInstance().printDateAndTime(row.mvt_date)}</div>,
            width: "180px",
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
        asset != null ? (
            <div className={"mt-4"}>

                <h6>{t(_str_asset_operations_title)}</h6>

                <div className={"blockContainer mt-2 mb-3"}>

                    {
                        loadingFirstPage ? (
                            FirstSpinner()
                        ) : (
                            <>

                                <div className="d-flex justify-content-end align-content-center mb-2">
                                    <Pagination
                                        options={"GET"}
                                        total={total}
                                        page={page}
                                        get={getAssetOperations}
                                    />
                                    <CButton color="primary" size="sm" onClick={(e) => getAssetOperations(1, operationsRowsPerPage, e)}>
                                        <CIcon icon={cilReload} />
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
                                                            customStyles={{headRow: {style: {backgroundColor: blue_mel, color: 'white', fontWeight: 'bold'}}}}
                                                            onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                                                dispatch({type: 'set', userRowsPerPage: currentRowsPerPage})
                                                                getAssetOperations(currentPage, currentRowsPerPage, undefined).then()
                                                            }}
                                                        />

                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                            </>
                        )
                    }

                </div>
            </div>
        ) : (
            <>
            </>
        )
    )
}
