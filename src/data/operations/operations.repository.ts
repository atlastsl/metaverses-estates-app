import {AppHttpNetworkRepository} from "../../services/http/app.http.network.repository.ts";
import {NavigateFunction} from "react-router";
import axios from "axios";
import {
    OperationDetailsDto,
    OperationsCollectionsDto, OperationsListDto,
    OperationsListRequestDto,
    OperationsTypesDto,
    OpTransactionsTypesDto
} from "./operations.dto.ts";
import {AppHttpService} from "../../services/http/app.http.service.ts";


export class OperationsRepository extends AppHttpNetworkRepository {

    constructor(navigate: NavigateFunction, cancelToken: axios.CancelToken) {
        super(navigate, cancelToken);
    }

    async getCollections(): Promise<OperationsCollectionsDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/operations/collections',
                method: 'GET',
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getOperationsTypes(collection: string): Promise<OperationsTypesDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/operations/collections/:collection/operations-types',
                method: 'GET',
                pathParams: { collection: collection },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getTransactionsTypes(collection: string): Promise<OpTransactionsTypesDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/operations/collections/:collection/transactions-types',
                method: 'GET',
                pathParams: { collection: collection },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getOperationsList(payload: OperationsListRequestDto): Promise<OperationsListDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/operations',
                method: 'GET',
                queryParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getOperationDetails(operation_id: string): Promise<OperationDetailsDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/operations/:operation_id',
                method: 'GET',
                pathParams: { operation_id: operation_id },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }
}
