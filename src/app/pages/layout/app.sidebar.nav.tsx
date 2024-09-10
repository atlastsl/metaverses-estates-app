// @ts-nocheck
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router";
import {NavLink} from "react-router-dom";
import {TAppNavigationItem, TAppNavigationItemBadge} from "./navigation.tsx";
import * as React from "react";
import {FunctionComponent} from "react";
import {CBadge, CNavLink, CSidebarNav} from "@coreui/react";
import SimpleBar from "simplebar-react";

type AppSidebarNavProps = {
    items: TAppNavigationItem[];
}

export const AppSidebarNav: FunctionComponent<AppSidebarNavProps> = (props) => {
    const {t} = useTranslation();

    const location = useLocation();

    const navLink = (name: string, icon: React.ReactNode, badge?: TAppNavigationItemBadge) => {
        return (
            <>
                {icon && icon}
                {name && t(name)}
                {badge && (
                    <CBadge color={badge.color} className="ms-auto">
                        {t(badge.text).toUpperCase()}
                    </CBadge>
                )}
            </>
        )
    };

    const navItem = (item: TAppNavigationItem, index: number) => {
        const { component, name, badge, icon, ...rest } = item;
        const Component = component;
        return (
            <Component
                as={"div"}
                key={index}
            >
                {rest.to ? (
                    <CNavLink
                        {...(rest.to && { as: NavLink })}
                        {...rest}
                    >
                        {navLink(name, icon, badge)}
                    </CNavLink>
                ) : (
                    navLink(name, icon, badge)
                )}

            </Component>
        )
    };

    const navGroup = (item: TAppNavigationItem, index: number) => {
        const { component, name, icon, to, ...rest } = item;
        const Component = component;
        return (
            <Component
                compact
                as={"div"}
                idx={String(index)}
                key={index}
                toggler={navLink(name, icon)}
                visible={location.pathname.startsWith(to)}
                {...rest}
            >
                {item.children?.map((item, index) =>
                    item.children ? navGroup(item, index) : navItem(item, index),
                )}
            </Component>
        )
    };

    return (
        <CSidebarNav as={SimpleBar}>
            {props.items &&
                props.items.map((item, index) => {
                        return (
                            (item as TAppNavigationItem).children ?
                                navGroup(item as TAppNavigationItem, index) :
                            navItem(item as TAppNavigationItem, index)
                        )
                    }
                )
            }
        </CSidebarNav>
    )
}


