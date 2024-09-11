// @ts-nocheck
import {Asset, AssetMetadata, AssetMetadataDataTypeEnum} from "../../../../data/assets/assets.dto.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {CBadge, CListGroup, CListGroupItem} from "@coreui/react";
import {
    _str_asset_identifier_label,
    _str_asset_metadata_empty_list,
    _str_asset_metadata_macro_label,
    _str_asset_metadata_name_label,
    _str_asset_metadata_title,
    _str_asset_metadata_value_label,
    _str_asset_type_label,
    _str_collection_label,
    _str_operation_details_asset_title
} from "../../../../helpers/intl/texts.tokens.ts";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";
import {ASSET_DETAILS_PAGE} from "../../../pages/pageslist.ts";
import DataTable, {TableColumn} from "react-data-table-component";
import {
    getAssetIcon,
    getAssetMetadataDisplayName,
    getAssetOpenseaAssetUrl,
    getAssetOpenseaCollectionUrl
} from "../../../../data/assets/assets.functions.tsx";
import {cilInfo} from "@coreui/icons";
import {CIcon} from "@coreui/icons-react";

export function OperationsDetailsAssetComponent ({asset, metadataEvolutions}: {asset: Asset | null, metadataEvolutions: AssetMetadata[][]}): React.ReactNode {
    const { t } = useTranslation();

    function handleOpenAssetExternalUrl () {
        if (asset != null) {
            window.open(getAssetOpenseaAssetUrl(asset),  '_blank')
        }
    }

    function handleOpenCollectionExternalUrl () {
        if (asset != null) {
            window.open(getAssetOpenseaCollectionUrl(asset), '_blank')
        }
    }

    function handleOpenAssetPage() {
        if (asset != null) {
            window.open(StringsHelper.getInstance().replaceAll(ASSET_DETAILS_PAGE, ':asset_id', asset.id), '_blank')
        }
    }

    const columns: TableColumn<AssetMetadata[]>[] = [
        {
            name: t(_str_asset_metadata_name_label),
            cell: row => <div className="one-line fw-medium">
                {t(getAssetMetadataDisplayName(row[0]))}
            </div>,
            width: "120px",
        },
        {
            name: t(_str_asset_metadata_macro_label),
            cell: row =>
                <>
                    {row.length === 1 ? (
                        <div className={"fw-normal text-dark"}>{row[0].macro_name ? row[0].macro_name : "--"}</div>
                    ) : (
                        <div className={"d-flex flex-row justify-content-center"}>
                            <div className={"fw-normal text-secondary text-decoration-line-through me-2"}>
                                {row[0].macro_name ? row[0].macro_name : ""}
                            </div>
                            <div className={"fw-normal mt-1 text-black me-1"}>
                                {row[1].macro_name ? row[1].macro_name : ""}
                            </div>
                        </div>
                    )}
                </>,
            hide: "sm",
            width: "140px",
        },
        {
            name: t(_str_asset_metadata_value_label),
            cell: row =>
                <div className="d-flex flex-row">
                    {row.length === 1 ? (
                        <div className={"fw-medium text-dark"}>{row[0].value ? row[0].value : "--"}</div>
                    ) : (
                        <div className={row[0].data_type === AssetMetadataDataTypeEnum.StringArray ? "d-flex flex-column justify-content-start" : "d-flex flex-row align-items-center"}>
                            <div className={"fw-medium mt-1 text-secondary text-decoration-line-through " + (row[0].data_type === AssetMetadataDataTypeEnum.StringArray ? "mb-2" : "me-2")}>
                                {row[0].value ? row[0].value : "--"}
                            </div>
                            <div className={"fw-medium mt-1 text-black " + (row[0].data_type === AssetMetadataDataTypeEnum.StringArray ? "mb-1" : "me-1")}>
                                {row[1].value ? row[1].value : "--"}
                            </div>
                        </div>
                    )}
                </div>,
        },
    ]

    return (
        asset != null ? (
            <>

                <h6>{t(_str_operation_details_asset_title)}</h6>

                <CListGroup>
                    <CListGroupItem>

                        <div className={"mb-2"}>
                            <small>{t(_str_asset_identifier_label)}</small>
                            <div className={"d-flex align-items-center"}>
                                <CBadge color='primary' textColor={'white'} className="cursorView p-2 me-2 mw-75 one-line">
                                    {asset.asset_id}
                                </CBadge>
                                <CIcon icon={cilInfo} size={'sm'} className={"cursorView"}
                                       onClick={() => handleOpenAssetExternalUrl()}/>
                            </div>
                        </div>

                        <div className="mb-2">
                            <small>{t(_str_collection_label)}</small>
                            <div className={"d-flex align-items-center"}>
                                <div className={"fw-medium me-2"}>
                                    {t(`collection_${asset.collection}`)}
                                </div>
                                <CIcon icon={cilInfo} size={'sm'}
                                       onClick={() => handleOpenCollectionExternalUrl()}/>
                            </div>
                        </div>

                        <div className="mb-2">
                            <small>{t(_str_asset_type_label)}</small>
                            <div className={"d-flex align-items-center"}>
                                {getAssetIcon(asset) != null && (
                                    getAssetIcon(asset)
                                )}
                                <div className={"fw-medium"}>
                                    {t(`asset_type_${asset.type.toLowerCase()}`)}
                                </div>
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_asset_metadata_title)}</small>
                            {
                                metadataEvolutions.length == 0 ? (
                                    <div className={"mb-2 mt-2"}>{t(_str_asset_metadata_empty_list)}</div>
                                ) : (
                                    <DataTable
                                        noHeader={true}
                                        columns={columns}
                                        data={metadataEvolutions}
                                        expandableRows={false}
                                        highlightOnHover
                                        responsive
                                        striped={false}
                                        customStyles={{headRow: {style: {backgroundColor: '#656565', color: 'white', fontWeight: 'bold'}}}}
                                        paginationPerPage={metadataEvolutions.length}
                                        paginationRowsPerPageOptions={[metadataEvolutions.length]}
                                    />
                                )
                            }
                        </div>

                    </CListGroupItem>
                </CListGroup>

            </>
        ) : (
            <>
            </>
        )
    )
}
