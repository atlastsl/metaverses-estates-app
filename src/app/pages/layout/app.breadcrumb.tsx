// @ts-nocheck
import {useLocation} from "react-router";
import {useTranslation} from "react-i18next";
import {routes, TAppRoute} from "../routes.ts";
import {_str_home_page} from "../../../helpers/intl/texts.tokens.ts";
import {CBreadcrumb, CBreadcrumbItem} from "@coreui/react";
import * as React from "react";

function AppBreadcrumb(): React.ReactNode {
    const {t} = useTranslation();

    const currentLocation = useLocation().pathname;

    const getRouteName = (pathname: string, routes: TAppRoute[]) : string | undefined => {
        for (const route of routes) {
            if (route.path === pathname) {
                return route.name;
            }
            if (route.regex && pathname.match(route.regex)) {
                const m = pathname.match(route.regex)
                return m.filter(x => x !== "" && x !== "0").reverse()[0];
            }
        }
        return undefined;
    };

    const getBreadcrumbs = (location: string) => {
        const breadcrumbs = [];
        location.split('/').reduce((prev, curr, index, array) => {
            const currentPathname = `${prev}/${curr}`;
            const routeName = getRouteName(currentPathname, routes);
            if (routeName) {
                breadcrumbs.push({
                    pathname: currentPathname,
                    name: routeName as string,
                    active: index + 1 === array.length,
                });
            }
            return currentPathname
        });
        return breadcrumbs
    };

    const breadcrumbs = getBreadcrumbs(currentLocation);

    return (
        <CBreadcrumb className="m-0 ms-2">
            <CBreadcrumbItem href="/">{t(_str_home_page)}</CBreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => {
                return (
                    <CBreadcrumbItem
                        {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
                        key={index}
                    >
                        {t(breadcrumb.name)}
                    </CBreadcrumbItem>
                )
            })}
        </CBreadcrumb>
    )

}

export default React.memo(AppBreadcrumb)
