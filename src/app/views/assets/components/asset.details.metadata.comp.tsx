// @ts-nocheck
import {AssetDetailsMainInfoProps} from "./props.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {
    _str_actions_label,
    _str_asset_metadata_date_label,
    _str_asset_metadata_empty_list,
    _str_asset_metadata_macro_label,
    _str_asset_metadata_name_label,
    _str_asset_metadata_title,
    _str_asset_metadata_value_label
} from "../../../../helpers/intl/texts.tokens.ts";
import DataTable, {TableColumn} from "react-data-table-component";
import {Asset, AssetMetadata, AssetMetadataDataTypeEnum} from "../../../../data/assets/assets.dto.ts";
import {getAssetMetadataDisplayName} from "../../../../data/assets/assets.functions.tsx";
import {CBadge} from "@coreui/react";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";
import {AssetDetailsMetadataHistComp} from "./asset.details.metadata.hist.comp.tsx";

export function AssetDetailsMetadataComponent(props: AssetDetailsMainInfoProps): React.ReactNode {
    const { asset } = props;
    const { t } = useTranslation();

    const columns: TableColumn<AssetMetadata>[] = [
        {
            name: t(_str_asset_metadata_name_label),
            cell: row => <div className="one-line fw-medium">
                {t(getAssetMetadataDisplayName(row))}
            </div>,
            width: "160px",
        },
        {
            name: t(_str_asset_metadata_macro_label),
            cell: row => <div className="one-line text-wrap">
                {row.macro_name ? row.macro_name : "--"}
            </div>,
            hide: "sm",
        },
        {
            name: t(_str_asset_metadata_value_label),
            cell: row => <div>
                {StringsHelper.getInstance().isStringEmpty(row.value) ? (
                    "--"
                ) : (
                    row.data_type === AssetMetadataDataTypeEnum.StringArray ? (
                        <div className={"d-flex flex-row flex-wrap"}>
                            {row.value.split("|").map(v => {
                                return (
                                    <CBadge color={"secondary"} textColor={"dark"} className={"me-2 p-2 fw-bold"}>
                                        {v}
                                    </CBadge>
                                )
                            })}
                        </div>
                    ) : (
                        <div className={"fw-medium"}>{row.value}</div>
                    )
                )}
            </div>,
            width: "180px",
        },
        {
            name: t(_str_asset_metadata_date_label),
            cell: row => <div className={"one-line"}>
                {row.date ? DatesHelper.getInstance().printDateAndTime(row.date) : "--"}
            </div>,
            hide: "md",
            width: "180px",
        },
        {
            name: t(_str_actions_label),
            cell: (row) => (
                row.date !== undefined ? (
                    <AssetDetailsMetadataHistComp
                        asset={asset as Asset}
                        assetMetadata={row}
                    />
                ) : (
                    <></>
                )
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
            <div>

                <h6>{t(_str_asset_metadata_title)}</h6>

                <div className={"blockContainer mt-2 mb-3"}>

                    {
                        asset.metadata === undefined || asset.metadata.length === 0 ? (
                            <div className={"fw-normal mt-2 mb-2"}>
                                {t(_str_asset_metadata_empty_list)}
                            </div>
                        ) : (
                            <DataTable
                                noHeader={true}
                                columns={columns}
                                data={(asset.metadata || [])}
                                expandableRows={false}
                                highlightOnHover
                                responsive
                                striped={false}
                                customStyles={{headRow: {style: {backgroundColor: '#656565', color: 'white', fontWeight: 'bold'}}}}
                                paginationPerPage={(asset.metadata || []).length}
                                paginationRowsPerPageOptions={[(asset.metadata || []).length]}
                            />
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
