// @ts-nocheck
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import Pagination, {DEFAULT_TAKE, TAKES_OPTIONS} from "../../components/pagination.tsx";
import React, {useEffect, useState} from "react";
import {CButton, CCard, CCardBody, CListGroup, CListGroupItem} from "@coreui/react";
import FirstSpinner from "../../components/first_spinner.tsx";
import {
    AssetsListFormComponent,
    parseSavedFilters,
    TAssetsListFormFilters
} from "./components/assets.list.form.comp.tsx";
import {CIcon} from "@coreui/icons-react";
import {cilReload} from "@coreui/icons";
import {Asset} from "../../../data/assets/assets.dto.ts";
import {OIDictionary} from "../../../services/http/http.dto.ts";
import {
    _str_actions_label, _str_asset_identifier_label, _str_asset_name_label,
    _str_asset_type_label, _str_assets_page,
    _str_collection_label,
    _str_list_no_items_found,
    _str_user_created_at_label,
    _str_user_updated_at_label, _str_view_btn
} from "../../../helpers/intl/texts.tokens.ts";
import DataTable, {TableColumn} from "react-data-table-component";
import {UserListItem} from "../users/components/user.list.item.tsx";
import {DatesHelper} from "../../../helpers/dates.helper.ts";
import {Link} from "react-router-dom";
import {getAssetIcon} from "../../../data/assets/assets.functions.tsx";
import {DisplayTextHelper} from "../../../helpers/display.text.helper.ts";
import {StringsHelper} from "../../../helpers/strings.helper.ts";
import {ASSET_DETAILS_PAGE} from "../../pages/pageslist.ts";
import {AssetsRepository} from "../../../data/assets/assets.repository.ts";
import {LocalstorageService, LS_ASSETS_FILTERS} from "../../../services/localstorage/localstorage.service.ts";
import {blue_mel} from "../../components/colors.tsx";


export default function AssetsListView() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const dispatch = useDispatch();
    let assetRowsPerPage = useSelector((state) => state.assetRowsPerPage);
    if (assetRowsPerPage === 0) {
        assetRowsPerPage = DEFAULT_TAKE;
    }

    const [loadingFirstPage, setLoadingFirstPage] = useState(false);
    const [loadingNavigation, setLoadingNavigation] = useState(false);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [assets, setAssets] = useState<Asset[]>([]);

    const [collections, setCollections] = useState<OIDictionary>({});
    const [assetsTypes, setAssetsTypes] = useState<OIDictionary>({});
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [loadingAssetsTypes, setLoadingAssetTypes] = useState<OIDictionary>({});
    const [savedFilters, setSavedFilters] = useState<string | undefined>(undefined);
    const [filters, setFilters] = useState<TAssetsListFormFilters | null>(null);

    async function handlePaginationUpdated (page: number, take: number, e?: Event): Promise<void> {
        if (e) e.preventDefault();
        await getAssetsList(page, take, filters);
    }

    function handleFiltersSubmitted(filters: TAssetsListFormFilters) : void {
        setFilters(filters);
        LocalstorageService.getInstance().setItem<string>(LS_ASSETS_FILTERS, JSON.stringify(filters));
        getAssetsList(page, assetRowsPerPage, filters).then();
    }

    async function getAssetsList (page: number, take: number, filters?: TAssetsListFormFilters): Promise<void> {
        setLoadingNavigation(l => !l);

        const response = await new AssetsRepository(navigate, source.token).getAssets({
            page: page,
            take: take,
            collection: filters?.collection,
            type: filters?.assetType,
            updated_at_min: filters?.dateRange?.[0],
            updated_at_max: filters?.dateRange?.[1],
            search: filters?.search,
            sort: filters?.sortBy,
        });
        if (response) {
            setAssets(response.assets);
            setTotal(response.pagination.total);
            setPage(response.pagination.page);
        }

        setLoadingNavigation(l => !l);
        setLoadingAssetTypes(false);
    }

    async function getCollections (): Promise<void> {
        setLoadingCollections(l => !l);

        const response = await new AssetsRepository(navigate, source.token).getCollections();
        if (response) {
            setCollections(response.collections);
        }

        setLoadingCollections(l => !l);
    }

    async function getAssetsTypes (collection: string): Promise<void> {
        setLoadingAssetTypes(l => !l);

        const response = await new AssetsRepository(navigate, source.token).getAssetsTypes(collection);
        if (response) {
            setAssetsTypes(response.assets_types);
        }

        setLoadingAssetTypes(l => !l);
    }

    function handleViewAssetDetails(asset: Asset): void {
        window.open(StringsHelper.getInstance().replaceAll(ASSET_DETAILS_PAGE, ":asset_id", asset.id), '_blank');
    }

    async function init() {
        setLoadingFirstPage(t => !t);

        const savedFilters = LocalstorageService.getInstance().getItem<string>(LS_ASSETS_FILTERS);
        setSavedFilters(savedFilters);
        await getCollections();
        await getAssetsList(1, assetRowsPerPage, savedFilters ? parseSavedFilters(savedFilters) : undefined);

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

    const columns: TableColumn<Asset>[] = [
        {
            name: t(_str_collection_label),
            cell: row => <div className="one-line text-wrap fw-medium">
                {DisplayTextHelper.getInstance().getDisplayTextFromDict(collections[row.collection] || [], row.collection)}
            </div>,
            width: "140px",
            hide: "sm",
        },
        {
            name: t(_str_asset_type_label),
            cell: row =>
                <div className={"d-flex justify-content-center"}>
                    {getAssetIcon(row) != null && (
                        getAssetIcon(row)
                    )}
                    <div className={"fw-medium"}>
                        {DisplayTextHelper.getInstance().getDisplayTextFromDict(assetsTypes[row.type] || [], row.type)}
                    </div>
                </div>,
            width: "120px",
        },
        {
            name: t(_str_asset_identifier_label),
            cell: row => <div className={"one-line fw-medium"}>
                {row.asset_id}
            </div>,
            width: "180px",
            hide: "md"
        },
        {
            name: t(_str_asset_name_label),
            cell: row => <div className={"one-line"}>
                {row.name}
            </div>,
            hide: "sm"
        },
        {
            name: t(_str_user_created_at_label),
            cell: row => <div className={"one-line"}>{row.created_at ? DatesHelper.getInstance().printDateAndTime(row.created_at) : '--'}</div>,
            width: "160px",
            hide:"md"
        },
        {
            name: t(_str_user_updated_at_label),
            cell: row => <div className={"one-line"}>{row.updated_at ? DatesHelper.getInstance().printDateAndTime(row.updated_at) : '--'}</div>,
            width: "160px",
            hide:"sm"
        },
        {
            name: t(_str_actions_label),
            cell: (row) => (
                <Link to={'#'} onClick={() => handleViewAssetDetails(row)}>
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

                    <AssetsListFormComponent
                        isLoadingCollections={loadingCollections}
                        isLoadingAssetsTypes={loadingAssetsTypes}
                        isLoadingList={loadingNavigation}
                        collections={collections}
                        assetsTypes={assetsTypes}
                        filters={savedFilters}
                        onFormSubmit={handleFiltersSubmitted}
                        onCollectionChanged={getAssetsTypes}
                    />

                    <h6>{t(_str_assets_page)}</h6>

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
                                            <CButton color="primary" size="sm" onClick={(e) => handlePaginationUpdated(1, assetRowsPerPage, e)}>
                                                <CIcon icon={cilReload} />
                                            </CButton>
                                        </div>

                                        {
                                            loadingNavigation ? (
                                                FirstSpinner()
                                            ) : (
                                                <div className="mb-2">
                                                    {
                                                        assets.length === 0 ? (
                                                            <div className="text-center my-5">
                                                                {t(_str_list_no_items_found)}
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-center mb-3">

                                                                <DataTable
                                                                    noHeader={true}
                                                                    columns={columns}
                                                                    data={assets}
                                                                    expandableRows={false}
                                                                    highlightOnHover
                                                                    striped={false}
                                                                    responsive
                                                                    paginationPerPage={assetRowsPerPage}
                                                                    paginationRowsPerPageOptions={TAKES_OPTIONS}
                                                                    customStyles={{headRow: {style: {backgroundColor: blue_mel, color: 'white', fontWeight: 'bold'}}}}
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
