import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import LogoMEL from "../../../assets/logo_mel.png";
import {
    _str_app_name,
    _str_logout,
    _str_my_account_page,
    _str_not_connected_message
} from "../../../helpers/intl/texts.tokens.ts";
import {useNavigate} from "react-router";
import {MY_ACCOUNT_PAGE} from "../pageslist.ts";
import LangSelector from "../../components/lang.selector.tsx";
import {Link, NavLink} from "react-router-dom";
import AppBreadcrumb from "./app.breadcrumb.tsx";
import {
    CContainer,
    CHeader,
    CHeaderBrand,
    CHeaderDivider,
    CHeaderNav,
    CHeaderToggler,
    CNavItem,
    CNavLink
} from "@coreui/react";
import {cilAccountLogout, cilMenu, cilUser} from "@coreui/icons";
import {CIcon} from "@coreui/icons-react";
import ThemeSelector from "../../components/theme.selector.tsx";

export default function AppHeader (props: any): React.ReactNode {
    const headerRef = useRef()
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const sidebarShow = useSelector((state) => state.sidebarShow);


    useEffect(() => {
        document.addEventListener('scroll', () => {
            headerRef.current &&
            headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
        })
    }, [])

    return (
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderToggler className="ps-1" onClick={() => dispatch({type: 'set', sidebarShow: !sidebarShow})}>
                    <CIcon icon={cilMenu} size="lg" />
                </CHeaderToggler>
                <CHeaderBrand className="mx-auto d-md-none" to="/">
                    <img className="sidebar-brand-full siderbar-logo" src={LogoMEL} alt={_str_app_name} />
                </CHeaderBrand>
                <CHeaderNav className="d-none d-md-flex me-auto">
                    <CNavItem>
                        <CNavLink href={MY_ACCOUNT_PAGE} component={NavLink}>
                            <div className="d-flex flex-row justify-content-center align-items-center">
                                <CIcon icon={cilUser} size="lg" />
                                <span className="ms-2">{t(_str_my_account_page)}</span>
                            </div>
                        </CNavLink>
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav>
                    <div className="me-1 me-md-3">
                        <ThemeSelector />
                    </div>
                    <div className="me-1 me-md-3">
                        <LangSelector location="in"/>
                    </div>
                    <CNavItem>
                        <CNavLink>
                            {/* eslint-disable-next-line react/prop-types */}
                            <div className="d-flex justify-content-center align-items-center cursorView"
                                 onClick={(e) => props.signOut(e)}>
                                <CIcon icon={cilAccountLogout} size="lg"/>
                                <span className="ms-2 d-none d-md-inline">{t(_str_logout)}</span>
                            </div>
                        </CNavLink>
                    </CNavItem>
                </CHeaderNav>
            </CContainer>
            <CHeaderDivider/>
            <CContainer fluid style={{minHeight: "40px", margin:0}}>
                <AppBreadcrumb />
            </CContainer>
            {
                // eslint-disable-next-line react/prop-types
                !props.isOnline &&
                <>
                    <CHeaderDivider />
                    <CContainer fluid>
                        <div className="alert-badge small">
                            {t(_str_not_connected_message)}
                        </div>
                    </CContainer>
                </>
            }
        </CHeader>
    )

}