import {User} from "../../../../data/user/user.dto.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {
    _str_user_created_at_label,
    _str_user_updated_at_label,
    _str_user_username_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {CCol, CRow} from "@coreui/react";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";


export default function UserHeaderBlock ({user}: {user: User | undefined}): React.ReactNode {

    const {t} = useTranslation();

    return (
        <>
            <CRow className="newBadge">
                {
                    user !== undefined &&
                    <CCol xs={12} md={6} className="small mb-3 mb-md-0">
                        <div className="d-flex align-items-end">
                            <div className="me-2">ID :</div>
                            {/* eslint-disable-next-line react/prop-types */}
                            <div className="fw-medium">{user.user_id}</div>
                        </div>
                        <div className="d-flex align-items-end">
                            <div className="me-2">{t(_str_user_username_label)} :</div>
                            <div className="fw-medium">{user.username}</div>
                        </div>
                    </CCol>
                }
                <CCol xs={12} md={6} className="d-md-inline-flex justify-content-md-end">
                    {
                        user !== undefined &&
                        <CCol xs={12} md={8} className="small mb-3 mb-md-0">
                            <div className="d-flex align-items-end">
                                <div className="me-2">{t(_str_user_created_at_label)} :</div>
                                {/* eslint-disable-next-line react/prop-types,no-undef */}
                                <div className="fw-medium">{DatesHelper.getInstance().printDateAndTime(user.created_at)}</div>
                            </div>
                            <div className="d-flex align-items-end">
                                <div className="me-2">{t(_str_user_updated_at_label)} :</div>
                                {/* eslint-disable-next-line react/prop-types */}
                                <div className="fw-medium">{DatesHelper.getInstance().printDateAndTime(user.updated_at)}</div>
                            </div>
                        </CCol>
                    }
                </CCol>
            </CRow>
        </>
    )
}