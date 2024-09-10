// @ts-nocheck
import * as React from "react";
import {
    _str_asset_details_page,
    _str_assets_page,
    _str_home_page,
    _str_my_account_page,
    _str_operation_details_page,
    _str_operations_page,
    _str_stakeholder_details_page,
    _str_stakeholders_page,
    _str_user_details_page,
    _str_users_page
} from "../../helpers/intl/texts.tokens.ts";
import {
    ASSET_DETAILS_PAGE,
    ASSET_DETAILS_PAGE_REG,
    ASSETS_LIST_PAGE,
    MY_ACCOUNT_PAGE, OPERATION_DETAILS_PAGE_REG,
    OPERATION_DETAILS_PATE,
    OPERATIONS_LIST_PAGE,
    STAKEHOLDER_DETAILS_PAGE,
    STAKEHOLDERS_LIST_PAGE,
    USER_DETAILS_PAGE,
    USER_DETAILS_PAGE_REG,
    USERS_PAGE
} from "./pageslist.ts";

const BlankPage = React.lazy(() => import('./pages/BlankPage.tsx'));

const UsersListPage = React.lazy(() => import('../views/users/users.list.view.tsx'));
const UserDetailsPage = React.lazy(() => import('../views/users/user.details.view.tsx'));
const MyAccountPage = React.lazy(() => import('../views/users/my.account.view.tsx'));

const AssetsListPage = React.lazy(() => import('../views/assets/assets.list.view.tsx'));
const AssetDetailsPage = React.lazy(() => import('../views/assets/asset.details.view.tsx'));

const OperationsListPage = React.lazy(() => import('../views/operations/operations.list.view.tsx'));
const OperationDetailsPage = React.lazy(() => import('../views/operations/operation.details.view.tsx'));

export type TAppRoute = {
    path: string;
    regex: RegExp;
    exact: boolean;
    name: string;
    element?: React.ReactNode;
}

export const routes: TAppRoute[] = [
    { path: '/', exact: true, name: _str_home_page },

    { path: MY_ACCOUNT_PAGE, exact: false, name: _str_my_account_page, element: MyAccountPage },
    { path: USERS_PAGE, exact: true, name: _str_users_page, element: UsersListPage },
    { path: USER_DETAILS_PAGE, regex: USER_DETAILS_PAGE_REG, exact: false, name: _str_user_details_page, element: UserDetailsPage },

    { path: ASSETS_LIST_PAGE, exact: true, name: _str_assets_page, element: AssetsListPage },
    { path: ASSET_DETAILS_PAGE, regex: ASSET_DETAILS_PAGE_REG, exact: false, name: _str_asset_details_page, element: AssetDetailsPage },

    { path: OPERATIONS_LIST_PAGE, exact: true, name: _str_operations_page, element: OperationsListPage },
    { path: OPERATION_DETAILS_PATE, regex: OPERATION_DETAILS_PAGE_REG, exact: true, name: _str_operation_details_page, element: OperationDetailsPage },

    { path: STAKEHOLDERS_LIST_PAGE, exact: true, name: _str_stakeholders_page, element: BlankPage },
    { path: STAKEHOLDER_DETAILS_PAGE, exact: true, name: _str_stakeholder_details_page, element: BlankPage },
]