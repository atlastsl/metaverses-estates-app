import {Asset, AssetMetadata, AssetMetadataCategoryEnum, AssetTypeEnum} from "./assets.dto.ts";
import React from "react";
import {CIcon} from "@coreui/icons-react";
import {cilBuilding, cilGrid, cilSquare} from "@coreui/icons";


export function getAssetIcon (asset: Asset) : React.ReactNode | null {
    switch (asset.type) {
        case AssetTypeEnum.Land:
            return <CIcon icon={cilSquare} size={"sm"} className={"me-2"} /> ;
        case AssetTypeEnum.District:
            return <CIcon icon={cilGrid} size={"sm"} className={"me-2"} /> ;
        case AssetTypeEnum.Estate:
            return <CIcon icon={cilBuilding} size={"sm"} className={"me-2"} />;
        default:
            return null;
    }
}

export function getAssetOpenseaCollectionUrl (asset: Asset): string {
    return `https://opensea.io/collection/${asset.collection}`;
}

export function getAssetOpenseaAssetUrl (asset: Asset): string {
    return `https://opensea.io/assets/${(asset.chain || 'ethereum')}/${asset.contract}/${asset.asset_id}`;
}

export function getAssetMetadataDisplayName (assetMetadata: AssetMetadata): string {
    return `metadata_${assetMetadata.category.toLowerCase()}_${(assetMetadata.macro_type || '').toLowerCase()}`;
}