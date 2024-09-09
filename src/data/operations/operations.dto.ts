import {OIDictionary, PaginationResponseDto} from "../../services/http/http.dto.ts";
import {Asset, AssetMetadata} from "../assets/assets.dto.ts";

export interface OperationValue {
    value: number;
    currency?: string;
    currency_price?: number;
    value_usd?: number;
}

export enum OperationType {
    Free = 'free',
    Sale = 'sale',
}

export enum TransactionType {
    Mint = 'mint',
    Transfer = 'transfer',
}

export interface Operation {
    _id: string;
    collection: string;
    asset: string;
    asset_contract: string;
    asset_id: string;
    transaction_hash: string;
    operation_type: OperationType;
    transaction_type: TransactionType;
    chain: string;
    block_number: number;
    block_hash: string;
    mvt_date: Date;
    sender: string;
    recipient: string;
    amount: OperationValue[],
    fees: OperationValue[]
}

export interface OperationsCollectionsDto {
    collections: OIDictionary;
}

export interface OperationsTypesDto {
    operations_types: OIDictionary;
}

export interface OpTransactionsTypesDto {
    transactions_types: OIDictionary;
}

export interface OperationsListDto {
    pagination: PaginationResponseDto;
    operations: Operation[];
}

export interface OperationDetailsDto {
    operation: Operation;
    asset: Asset;
    metadataListEvolutions: AssetMetadata[][]
}

export interface OperationsListRequestDto {
    sort?: string;
    operation_type?: OperationType;
    transaction_type?: TransactionType;
    collection?: string;
    search?: string;
    date_min?: Date;
    date_max?: Date;
    page: number;
    take: number;
}