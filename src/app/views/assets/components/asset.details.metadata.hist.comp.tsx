// @ts-nocheck
import React, {useState} from "react";
import {Asset, AssetMetadata, AssetMetadataDataTypeEnum} from "../../../../data/assets/assets.dto.ts";
import {useTranslation} from "react-i18next";
import {
    CBadge,
    CButton,
    CCloseButton,
    CListGroup,
    CListGroupItem,
    COffcanvas,
    COffcanvasBody,
    COffcanvasHeader,
    COffcanvasTitle
} from "@coreui/react";
import {
    _str_asset_metadata_date_label,
    _str_asset_metadata_history_title,
    _str_asset_metadata_macro_label,
    _str_asset_metadata_name_label,
    _str_asset_metadata_value_label,
    _str_list_no_items_found,
    _str_view_history_btn
} from "../../../../helpers/intl/texts.tokens.ts";
import {getAssetMetadataDisplayName} from "../../../../data/assets/assets.functions.tsx";
import Pagination, {DEFAULT_TAKE, TAKES_OPTIONS} from "../../../components/pagination.tsx";
import {CIcon} from "@coreui/icons-react";
import {cilReload} from "@coreui/icons";
import FirstSpinner from "../../../components/first_spinner.tsx";
import DataTable, {TableColumn} from "react-data-table-component";
import {useDispatch, useSelector} from "react-redux";
import {AssetsRepository} from "../../../../data/assets/assets.repository.ts";
import {useNavigate} from "react-router";
import axios from "axios";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";

export interface AssetDetailsMetadataHistProps {
    asset: Asset;
    assetMetadata: AssetMetadata;
    element?: React.ReactNode;
}

export function AssetDetailsMetadataHistComp(props: AssetDetailsMetadataHistProps): React.ReactNode {
    console.log(props)
    const { asset, assetMetadata } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [visible, setVisible] = useState(false);

    const [loadingFirstPage, setLoadingFirstPage] = useState(false);
    const [loadingNavigation, setLoadingNavigation] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [assetMetadataList, setAssetMetadataList] = useState<AssetMetadata[]>([]);

    const dispatch = useDispatch();
    let assetMetadataListRowsPerPage = useSelector((state) => state.assetMetadataListRowsPerPage);
    if (assetMetadataListRowsPerPage === 0) {
        assetMetadataListRowsPerPage = DEFAULT_TAKE;
    }

    async function getAssetMetadataList (page: number, take: number, e?: Event): Promise<void> {
        if (e) e.preventDefault();
        setLoadingNavigation(l => !l);

        const response = await new AssetsRepository(navigate, source.token).getAssetMetadataHistory(
            asset.id,
            {
                metadata_category: assetMetadata.category,
                metadata_macro_type: assetMetadata.macro_type,
                page: page,
                take: take,
            }
        );
        if (response) {
            setAssetMetadataList(response.metadata_list);
            setTotal(response.pagination.total);
            setPage(response.pagination.page);
        }

        setLoadingNavigation(l => !l);
    }

    function onOpen() {
        setVisible(true);
    }

    function handleClose() {
        source.cancel();
        setVisible(false)
    }

    async function init() {
        setLoadingFirstPage(t => !t);

        await getAssetMetadataList(1, assetMetadataListRowsPerPage);

        setLoadingFirstPage(t => !t);
    }

    const columns: TableColumn<AssetMetadata>[] = [
        {
            name: t(_str_asset_metadata_macro_label),
            cell: row => <div className="one-line text-wrap">
                {row.macro_name ? row.macro_name : "--"}
            </div>,
            hide: "sm",
            width: "90px",
        },
        {
            name: t(_str_asset_metadata_value_label),
            cell: row => (
                StringsHelper.getInstance().isStringEmpty(row.value) ? (
                    <div>{"--"}</div>
                ) : (
                    row.data_type === AssetMetadataDataTypeEnum.StringArray ? (
                        <div className={"d-flex flex-row flex-wrap"}>
                            {row.value.split("|").map(v => {
                                return (
                                    <CBadge color={"secondary"} textColor={"dark"} className={"me-2 p-2 mb-1 mt-1"}>
                                        {v}
                                    </CBadge>
                                )
                            })}
                        </div>
                    ) : (
                        <div className={"fw-medium"}>{row.value}</div>
                    )
                )
            ),
            width: "100px",
        },
        {
            name: t(_str_asset_metadata_date_label),
            cell: row => <div className={"justify-content-end"}>
                <div className="one-line">{row.date ? DatesHelper.getInstance().printDateAndTime(row.date) : "--"}</div>
                {/*row.operations !== undefined && row.operations.length > 0 && (
                    <>
                        {row.operations.map(operation => {
                            return (
                                <div className={"one-line text-wrap text-italic"}>
                                    <a href={StringsHelper.getInstance().replaceAll(OPERATION_DETAILS_PATE, ":operation_id", operation)} target={'_blank'} rel={'noreferrer noopener'}>
                                        {operation}
                                    </a>
                                </div>
                            )
                        })}
                    </>
                )*/}
            </div>,
            hide: "md",
            width: "80px",
        }
    ]


    return (
        <>
            <div className="cursorView" onClick={onOpen}>
                {
                    props.element ? (
                        <props.elemts />
                    ) : (
                        <CButton color="primary" variant="ghost" className="border-primary fw-medium" size="sm">
                            {t(_str_view_history_btn)}
                        </CButton>
                    )
                }
            </div>

            <COffcanvas placement={"end"} visible={visible} onHide={handleClose} onShow={init}>
                <COffcanvasHeader>
                    <COffcanvasTitle>
                        {t(_str_asset_metadata_history_title)}
                    </COffcanvasTitle>
                    <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
                </COffcanvasHeader>

                <COffcanvasBody className={"box mt-0"}>

                    <CListGroup className={"mb-4"}>
                        <CListGroupItem>

                            <div className={"mb-2"}>
                                <small>{t(_str_asset_metadata_name_label)}</small>
                                <h6>
                                    {t(getAssetMetadataDisplayName(assetMetadata))}
                                </h6>
                            </div>
                            <div className={"mb-2"}>
                                <small>{t(_str_asset_metadata_macro_label)}</small>
                                <h6>{assetMetadata.macro_name ? assetMetadata.macro_name : "--"}</h6>
                            </div>

                        </CListGroupItem>
                    </CListGroup>

                    <CListGroup className={"mb-2"}>
                        <CListGroupItem>

                            {loadingFirstPage ? (
                                FirstSpinner()
                            ) : (
                                <>
                                    <div className="d-flex justify-content-end align-content-center mb-2">
                                        <Pagination
                                            options={"GET"}
                                            total={total}
                                            page={page}
                                            get={getAssetMetadataList}
                                        />
                                        <CButton color="primary" size="sm" onClick={(e) => getAssetMetadataList(1, assetMetadataListRowsPerPage, e)}>
                                            <CIcon icon={cilReload} />
                                        </CButton>
                                    </div>

                                    {
                                        loadingNavigation ? (
                                            FirstSpinner()
                                        ) : (
                                            <div className="mb-2">
                                                {
                                                    assetMetadataList.length === 0 ? (
                                                        <div className="text-center my-5">
                                                            {t(_str_list_no_items_found)}
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-center mb-3">

                                                            <DataTable
                                                                noHeader={true}
                                                                columns={columns}
                                                                data={assetMetadataList}
                                                                expandableRows={false}
                                                                highlightOnHover
                                                                striped={false}
                                                                responsive
                                                                customStyles={{headRow: {style: {backgroundColor: '#656565', color: 'white', fontWeight: 'bold'}}}}
                                                                paginationPerPage={assetMetadataListRowsPerPage}
                                                                paginationRowsPerPageOptions={TAKES_OPTIONS}
                                                                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                                                    dispatch({type: 'set', userRowsPerPage: currentRowsPerPage})
                                                                    getAssetMetadataList(currentPage, currentRowsPerPage, undefined).then()
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

                        </CListGroupItem>
                    </CListGroup>

                </COffcanvasBody>
            </COffcanvas>
        </>
    )

}

