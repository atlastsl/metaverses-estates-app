import {OIDictionary, PaginationResponseDto} from "../../services/http/http.dto.ts";
import {Operation} from "../operations/operations.dto.ts";

export interface AssetsCollectionsDto {
    collections: OIDictionary
}

export interface AssetsTypesDto {
    assets_types: OIDictionary
}

export enum AssetTypeEnum {
    Land = 'land',
    Estate = 'estate',
    District = 'district',
}

export interface AssetUrl {
    name: string;
    url: string;
}

export enum AssetMetadataCategoryEnum {
    Coordinates = 'coordinates',
    Size = 'size',
    Distance = 'distance',
    Owner = 'owner',
    Lands = 'lands',
}

export enum AssetMetadataMacroTypeEnum {
    Plaza = 'plaza',
    Road = 'road',
    District = 'district',
}

export enum AssetMetadataDataTypeEnum {
    Integer = 'integer',
    Float = 'float',
    Boolean = 'bool',
    String = 'string',
    StringArray = 'string-array',
    Address = 'address',
}

export interface AssetMetadata {
    category: AssetMetadataCategoryEnum;
    macro_type?: AssetMetadataMacroTypeEnum;
    macro_type_params?: Record<string, any>;
    macro_name?: string;
    value: string;
    data_type: AssetMetadataDataTypeEnum,
    date?: Date;
    operations?: string[];
}

export interface Asset {
    id: string;
    collection: string;
    contract: string;
    chain?: string;
    asset_id: string;
    type: AssetTypeEnum;
    name: string;
    description?: string;
    token_standard: string;
    coordinates?: string;
    image_url?: string;
    urls?: AssetUrl[];
    created_at?: Date;
    updated_at?: Date;
    metadata?: AssetMetadata[];
}

export interface AssetsListResponseDto {
    pagination: PaginationResponseDto;
    assets: Asset[];
}

export interface AssetDetailsResponseDto {
    asset: Asset;
}

export interface AssetMetadataListResponseDto {
    pagination: PaginationResponseDto;
    metadata_list: AssetMetadata[];
}

export interface AssetOperationsListResponseDto {
    pagination: PaginationResponseDto;
    operations: Operation[]
}

export interface AssetsListRequestDto {
    collection?: string;
    type?: string;
    updated_at_min?: Date;
    updated_at_max?: Date;
    search?: string;
    sort?: string;
    page: number;
    take: number;
}

export interface AssetMetadataHistoryRequestDto {
    metadata_category: AssetMetadataCategoryEnum;
    metadata_macro_type?: AssetMetadataMacroTypeEnum;
    page: number;
    take: number;
}

export interface AssetOperationsListRequestDto {
    page: number;
    take: number;
}
