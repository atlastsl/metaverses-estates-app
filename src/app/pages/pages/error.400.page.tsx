import * as React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {UserLocal} from "../../../data/user/user.local.ts";
import {_str_back_to_home_page, _str_page_not_found, _str_you_are_lost} from "../../../helpers/intl/texts.tokens.ts";
import {CButton, CCol, CContainer, CRow} from "@coreui/react";

export default function Error400Page(): React.ReactNode {
    const {t} = useTranslation();

    const navigate = useNavigate();

    function goToHomePage(){
        navigate("/");
    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center mb-5">
                    <CCol md={10}>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h1 className="display-4">404</h1>
                            <h3 className="text-center">
                                <span className="fw-bold text-primary">{UserLocal.getInstance().getUsername()}, </span>{t(_str_you_are_lost)}
                            </h3>
                            <h6 className="text-center mb-4">{t(_str_page_not_found)}</h6>
                            <CButton
                                color="primary"
                                variant="ghost"
                                className="border-primary"
                                onClick={goToHomePage}>
                                {t(_str_back_to_home_page)}
                            </CButton>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}