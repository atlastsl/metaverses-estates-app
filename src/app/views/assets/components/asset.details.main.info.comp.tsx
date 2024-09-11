// @ts-nocheck
import React from "react";
import {useTranslation} from "react-i18next";
import {CBadge, CCol, CListGroup, CListGroupItem, CRow} from "@coreui/react";
import DefaultAsset from "../../../../assets/logo_mel.png";
import {
    _str_asset_description_label,
    _str_asset_identifier_label,
    _str_asset_main_info_title,
    _str_asset_name_label,
    _str_asset_type_label,
    _str_collection_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {DisplayTextHelper} from "../../../../helpers/display.text.helper.ts";
import {AssetDetailsMainInfoProps} from "./props.ts";
import {Link} from "react-router-dom";
import {
    getAssetIcon,
    getAssetOpenseaAssetUrl,
    getAssetOpenseaCollectionUrl
} from "../../../../data/assets/assets.functions.tsx";
import Image from "../../../components/image.tsx";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";
import {CIcon} from "@coreui/icons-react";
import {cilInfo} from "@coreui/icons";

export function AssetDetailsMainInfoComponent(props: AssetDetailsMainInfoProps): React.ReactNode {
    const {asset, collections, assetsTypes} = props;

    const { t } = useTranslation();

    //const [isZoomed, setIsZoomed] = React.useState(false);

    function handleOpenCollection() {
        if (asset != null) {
            window.open(getAssetOpenseaCollectionUrl(asset), '_blank');
        }
    }

    function handleOpenAssetLink() {
        if (asset != null) {
            window.open(getAssetOpenseaAssetUrl(asset), '_blank');
        }
    }

    return (
        asset != null ? (
            <>

                <h6>{t(_str_asset_main_info_title)}</h6>

                <CListGroup className={"mb-3 mt-1"}>
                    <CListGroupItem>

                        <CRow className={'pt-2 pb-3'}>
                            <CCol xs={12} sm={12} lg={4} className={"mb-3 mb-lg-0"}>
                                <div className="mb-4 mb-md-0">
                                    {
                                        (asset.image_url != null  && asset.image_url !== "") ? (
                                            <a href={asset.image_url} target="_blank" rel="noopener noreferrer">
                                                <Image
                                                    alt="pic"
                                                    className="img-fluid shadow-sm"
                                                    src={asset.image_url}
                                                    style={{ maxWidth: "100%", maxHeight:"200px" }}
                                                />
                                            </a>
                                        ) : (
                                            <Image
                                                alt="pic"
                                                className="img-fluid rounded-circle shadow-sm"
                                                src={DefaultAsset}
                                                style={{ maxWidth: "100%", maxHeight:"150px" }}
                                            />
                                        )
                                    }
                                </div>
                            </CCol>

                            <CCol xs={12} sm={12} lg={8} className={"mb-3 mb-lg-0"}>

                                <CRow>
                                    <CCol xs={12} md={6}>

                                        <div className="mb-2">
                                            <small>{t(_str_asset_identifier_label)}</small>
                                            <div className={"d-flex align-items-center"}>
                                                <CBadge color='primary' textColor={'white'} className="p-2 me-2 mw-75 one-line">
                                                    {asset.asset_id}
                                                </CBadge>
                                                <CIcon icon={cilInfo} size={'sm'} className={"cursorView"} onClick={handleOpenAssetLink} />
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <small>{t(_str_collection_label)}</small>
                                            <Link to={'#'} onClick={handleOpenCollection}>
                                                <div className="fw-medium">
                                                    {DisplayTextHelper.getInstance().getDisplayTextFromDict(collections[asset.collection] || [], asset.collection)}
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="mb-2">
                                            <small>{t(_str_asset_type_label)}</small>
                                            <div className={"d-flex align-items-center"}>
                                                {getAssetIcon(asset) != null && (
                                                    getAssetIcon(asset)
                                                )}
                                                <div className={"fw-medium"}>
                                                    {DisplayTextHelper.getInstance().getDisplayTextFromDict(assetsTypes[asset.type] || [], asset.type)}
                                                </div>
                                            </div>
                                        </div>

                                    </CCol>
                                    <CCol xs={12} md={6}>

                                        <div className="mb-2">
                                            <small>{t(_str_asset_name_label)}</small>
                                            <div className={"fw-medium"}>
                                                {asset.name}
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <small>{t(_str_asset_description_label)}</small>
                                            <div className={"fw-normal"}>
                                                {StringsHelper.getInstance().isStringEmpty(asset.description) ? "--" : asset.description}
                                            </div>
                                        </div>

                                    </CCol>
                                </CRow>

                            </CCol>
                        </CRow>

                    </CListGroupItem>
                </CListGroup>
            </>
        ) : (
            <>
            </>
        )
    )
}