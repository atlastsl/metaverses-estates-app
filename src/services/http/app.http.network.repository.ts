// @ts-nocheck
import {NavigateFunction} from "react-router";
import axios from "axios";

export abstract class AppHttpNetworkRepository {
    protected constructor(protected readonly navigate: NavigateFunction, protected readonly cancelToken: axios.CancelToken) {}
}