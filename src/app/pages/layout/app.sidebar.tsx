// @ts-nocheck
import {useDispatch, useSelector} from "react-redux";
import LogoMEL from '../../../assets/logo_mel.png';
import {_str_app_name} from "../../../helpers/intl/texts.tokens.ts";
import '../../../assets/styles/layout.css';
import {UserLocal} from "../../../data/user/user.local.ts";
import {getNavigation} from "./navigation.tsx";
import * as React from "react";
import {AppSidebarNav} from "./app.sidebar.nav.tsx";
import {CCloseButton, CSidebar, CSidebarBrand, CSidebarFooter, CSidebarHeader, CSidebarToggler} from "@coreui/react";

function AppSidebar(): React.ReactNode {
    const dispatch = useDispatch();
    const unfoldable = useSelector((state) => state.sidebarUnfoldable);
    const sidebarShow = useSelector((state) => state.sidebarShow);

    const userRole = UserLocal.getInstance().getUserRole();
    const nextNavigation = getNavigation(userRole);

    return (
        <CSidebar
            className="border-end"
            colorScheme="light"
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >
            <CSidebarHeader className="border-bottom justify-content-center align-items-center">
                <CSidebarBrand>
                    <img className="sidebar-brand-full siderbar-logo" src={LogoMEL} alt={_str_app_name} />
                    <img className="sidebar-brand-narrow siderbar-mini-logo" src={LogoMEL} alt={_str_app_name} />
                </CSidebarBrand>
                <CCloseButton
                    className="d-lg-none"
                    dark
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </CSidebarHeader>
            <AppSidebarNav items={nextNavigation} />
            <CSidebarFooter className="border-top d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
                />
            </CSidebarFooter>

        </CSidebar>
    )

}

export default React.memo(AppSidebar);
