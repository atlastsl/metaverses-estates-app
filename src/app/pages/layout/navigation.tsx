// @ts-nocheck
import * as React from 'react'
import {UserRole} from "../../../data/user/user.dto.ts";
import {
    _str_assets_page,
    _str_operations_page,
    _str_stakeholders_page,
    _str_users_page
} from "../../../helpers/intl/texts.tokens.ts";
import {ASSETS_LIST_PAGE, OPERATIONS_LIST_PAGE, PAGE_LOGIN, STAKEHOLDERS_LIST_PAGE, USERS_PAGE} from "../pageslist.ts";
import {CNavItem} from "@coreui/react";
import {cilGrid, cilHandshake, cilPeople, cilTransfer} from "@coreui/icons";
import {CIcon} from "@coreui/icons-react";

export type TAppNavigationItemBadge = {
    text: string;
    color: string;
}

export type TAppNavigationItem = {
    component: React.ReactElement,
    name: string;
    to: string;
    icon: React.ReactNode;
    roles: UserRole[],
    children?: TAppNavigationItem[],
    badge?: TAppNavigationItemBadge,
}

export type TAppNavigationItems = TAppNavigationItem[];

export const NavigationItems: TAppNavigationItem[] = [
    {
        component: CNavItem,
        name: _str_users_page,
        to: USERS_PAGE,
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
        roles: [UserRole.ADMIN],
    },
    {
        component: CNavItem,
        name: _str_assets_page,
        to: ASSETS_LIST_PAGE,
        icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
        roles: [],
    },
    {
        component: CNavItem,
        name: _str_operations_page,
        to: OPERATIONS_LIST_PAGE,
        icon: <CIcon icon={cilTransfer} customClassName="nav-icon" />,
        roles: []
    },
    {
        component: CNavItem,
        name: _str_stakeholders_page,
        to: STAKEHOLDERS_LIST_PAGE,
        icon: <CIcon icon={cilHandshake} customClassName="nav-icon" />,
        roles: []
    }
]

export function getNavigation (role?: UserRole) : TAppNavigationItem[] {

    let nextNavigation : TAppNavigationItem[] = []
    if (role) {
        for (const navigationElem of NavigationItems) {
            let navElmAllowed = navigationElem.roles.length === 0 || navigationElem.roles.includes(role);
            if (navElmAllowed && navigationElem.children && navigationElem.children.length > 0) {
                let selectedChildren: TAppNavigationItem[] = [];
                for (const childItem of navigationElem.children) {
                    let childAllowed = childItem.roles.length === 0 || childItem.roles.includes(role);
                    if (childAllowed) {
                        selectedChildren.push(childItem);
                    }
                }
                nextNavigation.push({...navigationElem, children : selectedChildren.length === 0 ? undefined : selectedChildren});
            }
            else if (nextNavigation) {
                nextNavigation.push({...navigationElem, children : undefined});
            }
        }
    }

    return nextNavigation;
}

export function getFirstPageToDisplay (role?: UserRole) {
    if (!role) {
        return PAGE_LOGIN;
    }
    if ((role as UserRole) === UserRole.ADMIN) {
        return USERS_PAGE;
    }
    return OPERATIONS_LIST_PAGE;
}
