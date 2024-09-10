// @ts-nocheck
import {AppHttpNetworkRepository} from "../../services/http/app.http.network.repository.ts";
import {NavigateFunction} from "react-router";
import axios from "axios";
import {
    AssetDetailsResponseDto,
    AssetMetadataHistoryRequestDto,
    AssetMetadataListResponseDto, AssetOperationsListRequestDto,
    AssetOperationsListResponseDto,
    AssetsCollectionsDto,
    AssetsListRequestDto,
    AssetsListResponseDto,
    AssetsTypesDto
} from "./assets.dto.ts";
import {AppHttpService} from "../../services/http/app.http.service.ts";

export class AssetsRepository extends AppHttpNetworkRepository {

    constructor(navigate: NavigateFunction, cancelToken: axios.CancelToken) {
        super(navigate, cancelToken);
    }

    async getCollections(): Promise<AssetsCollectionsDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/assets/collections',
                method: 'GET',
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getAssetsTypes(collection: string): Promise<AssetsTypesDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/assets/collections/:collection/assets-types',
                method: 'GET',
                pathParams: { collection: collection },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getAssets(payload: AssetsListRequestDto): Promise<AssetsListResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/assets',
                method: 'GET',
                queryParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getAsset(asset_id: string): Promise<AssetDetailsResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/assets/:asset_id',
                method: 'GET',
                pathParams: { asset_id },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getAssetMetadataHistory(asset_id: string, payload: AssetMetadataHistoryRequestDto): Promise<AssetMetadataListResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/assets/:asset_id/metadata-history',
                method: 'GET',
                pathParams: { asset_id },
                queryParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getAssetOperationsList(asset_id: string, payload: AssetOperationsListRequestDto): Promise<AssetOperationsListResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/assets/:asset_id/operations',
                method: 'GET',
                pathParams: { asset_id },
                queryParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }
}
