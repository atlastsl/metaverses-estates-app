import {AssetDetailsMainInfoProps} from "./props.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {
    _str_asset_coordinates_label, _str_asset_secondary_info_title,
    _str_asset_token_standard_label,
    _str_asset_urls_label,
    _str_user_created_at_label,
    _str_user_updated_at_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";
import {CListGroup, CListGroupItem} from "@coreui/react";


export function AssetDetailsScnInfoComponent (props: AssetDetailsMainInfoProps): React.ReactNode {
    const { asset } = props;
    const { t } = useTranslation();

    return (
        asset != null ? (
            <div>

                <h6>{t(_str_asset_secondary_info_title)}</h6>

                <CListGroup>
                    <CListGroupItem>

                        {asset.coordinates && (
                            <div className="mb-2">
                                <small>{t(_str_asset_coordinates_label)}</small>
                                <div className={"fw-medium"}>
                                    {asset.coordinates}
                                </div>
                            </div>
                        )}

                        <div className="mb-2">
                            <small>{t(_str_asset_token_standard_label)}</small>
                            <div className={"fw-medium"}>
                                {asset.token_standard.toUpperCase()}
                            </div>
                        </div>

                        {asset.urls && asset.urls.length > 0 && (
                            <div className="mb-2">
                                <small>{t(_str_asset_urls_label)}</small>
                                <div>
                                    <ul>
                                        {asset.urls.map((url, i) => (
                                            <li key={i}>
                                                <a href={url.url} target={"_blank"} rel={"noreferrer noreferrer"}>
                                                    {url.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="mb-2">
                            <small>{t(_str_user_created_at_label)}</small>
                            <div className={"fw-medium"}>
                                {asset.created_at ? DatesHelper.getInstance().printDateAndTime(asset.created_at) : "--"}
                            </div>
                        </div>

                        <div className="mb-2">
                            <small>{t(_str_user_updated_at_label)}</small>
                            <div className={"fw-medium"}>
                                {asset.updated_at ? DatesHelper.getInstance().printDateAndTime(asset.updated_at) : "--"}
                            </div>
                        </div>

                    </CListGroupItem>
                </CListGroup>

            </div>
        ) : (
            <></>
        )
    )
}
