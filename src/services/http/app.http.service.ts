import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, Method} from "axios";
import {DisplayTextHelper, IDisplayText} from "../../helpers/display.text.helper.ts";
import {_str_error_message_default} from "../../helpers/intl/texts.tokens.ts";
import {NOTIFICATION_ERROR, ShowNotification} from "../../app/components/notifications.tsx";
import {LocalstorageService, LS_AUTH_TOKEN} from "../localstorage/localstorage.service.ts";
import {StringsHelper} from "../../helpers/strings.helper.ts";
import {NavigateFunction} from "react-router";
import {PAGE_404, PAGE_500, PAGE_LOGIN} from "../../app/pages/pageslist.ts";

type THeadersContentType = "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data";

type THeadersAccept = "application/json" | "application/blob";

type THeaders = {
    "Authorization": string | undefined,
    'Platform': string,
    'Content-Type': THeadersContentType,
    'Accept': THeadersAccept,
    'Access-Control-Allow-Origin': "*"
}
class CRequestParams {
    public endpoint: string;
    public method: Method;
    public publicRoute: boolean = false;
    public contentType: THeadersContentType = "application/json";
    public pathParams: any;
    public queryParams: any;
    public bodyParams: any;
    public asDownload: boolean = false;
    public navigate?: NavigateFunction;
    public cancelToken?: axios.CancelToken;
}

export class AppHttpService {
    static instance: AppHttpService;

    static getInstance(): AppHttpService {
        if (!AppHttpService.instance) {
            AppHttpService.instance = new AppHttpService();
        }
        return AppHttpService.instance;
    }

    private axiosInstance: AxiosInstance;

    private initializeAxios(): void {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_APP_ENV === 'development' ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL,
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            }
        })
    }

    constructor() {
        this.initializeAxios();
    }

    private getHeaders(publicRoute: boolean, contentType: THeadersContentType, accept: THeadersAccept): THeaders {
        let authorization: string | undefined = undefined;
        if (!publicRoute) {
            let authToken = LocalstorageService.getInstance().getItem<string>(LS_AUTH_TOKEN);
            if (authToken) {
                authorization = 'Bearer ' + (authToken as string);
            }
        }
        return {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": contentType,
            Accept: accept,
            Authorization: authorization,
            Platform: 'web'
        }
    }

    private buildUrl(baseUrl: string, pathParams?: any, queryParams?: any): string {
        let url = baseUrl;
        if (pathParams) {
            for (const key in pathParams) {
                if (pathParams.hasOwnProperty(key)) {
                    url = StringsHelper.getInstance().replaceAll(url, `:${key}`, pathParams[key]);
                }
            }
        }
        if (queryParams) {
            const strQueryParams = Object
                .keys(queryParams)
                .filter((key) => queryParams[key] != null && queryParams[key] !== undefined)
                .map((key) => {
                    return `${key}=${encodeURIComponent(queryParams[key])}`;
                })
                .join('&');
            url = url + '?' + strQueryParams;
        }
        return url;
    }

    private buildConfigs(
        url: string,
        method: Method,
        publicRoute: boolean,
        contentType: THeadersContentType,
        bodyParams: any,
        accept: THeadersAccept,
        asDownload: boolean = false,
        cancelToken: axios.CancelToken
    ): AxiosRequestConfig {
        const configs: AxiosRequestConfig = {
            url,
            method: method,
            headers: this.getHeaders(publicRoute, contentType, accept),
            cancelToken: cancelToken,
        }
        if (bodyParams) {
            configs.data = bodyParams;
        }
        if (asDownload) {
            configs.responseType = "blob";
        }
        return configs;
    }

    private errorHandler<T>(response: AxiosResponse<T>, navigate: NavigateFunction | undefined) : T | null | undefined {
        let statusCode = response.status;
        const errorPayload = response.data.error;
        console.log(JSON.stringify((statusCode >= 400 && statusCode < 600), null, 2));
        if (errorPayload && statusCode >= 400 && statusCode < 600) {
            const errorDisplay = (errorPayload.display_messages || []) as IDisplayText[];
            const errorMessage = DisplayTextHelper.getInstance().getDisplayTextFromDict(errorDisplay, _str_error_message_default);
            ShowNotification(NOTIFICATION_ERROR, errorMessage as string);
        } else {
            statusCode = 500;
            const errorMessage = DisplayTextHelper.getInstance().getDisplayTextFromApp(_str_error_message_default);
            ShowNotification(NOTIFICATION_ERROR, errorMessage as string);
        }
        if (statusCode === 401) {
            LocalstorageService.getInstance().clearStorage();
            if (navigate) navigate(PAGE_LOGIN);
        }
        else if (statusCode === 404) {
            if (navigate) navigate(PAGE_404);
        }
        else if (statusCode === 500) {
            if (navigate) navigate(PAGE_500);
        }
        return null;
    }

    async request<T>(params: CRequestParams): Promise<T | null | undefined> {
        const url = this.buildUrl(params.endpoint, params.pathParams, params.queryParams);
        const configs = this.buildConfigs(
            url,
            params.method,
            params.publicRoute,
            params.contentType,
            params.bodyParams,
            "application/json",
            params.asDownload,
            params.cancelToken
        );
        return new Promise<T>((resolve, reject) => {
            this.axiosInstance.request<T>(configs)
                .then(response => {
                    if (response.data.error) {
                        this.errorHandler(response, params.navigate);
                        resolve(null);
                    } else {
                        resolve(response.data);
                    }
                })
                .catch(error => {
                    if (!axios.isCancel(error)) {
                        if (error.response) {
                            this.errorHandler(error.response, params.navigate);
                        } else {
                            ShowNotification(NOTIFICATION_ERROR, error.message);
                            console.error(error);
                        }
                    }
                    resolve(null);
                })
        })
    }
}