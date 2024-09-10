// @ts-nocheck
import {User} from "../../../../data/user/user.dto.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {CBadge, CButton, CCol, CListGroup, CListGroupItem, CRow} from "@coreui/react";
import CopyButton from "../../../components/copy.button.tsx";
import {
    _str_change_my_password_indication,
    _str_reset_user_password_indication,
    _str_user_created_at_label,
    _str_user_id_label,
    _str_user_password_label,
    _str_user_role_label,
    _str_user_role_prefix,
    _str_user_status_label,
    _str_user_status_prefix,
    _str_user_updated_at_label,
    _str_user_username_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";
import {CIcon} from "@coreui/icons-react";
import {cilPencil} from "@coreui/icons";
import {UserLocal} from "../../../../data/user/user.local.ts";


export interface TUserInfoComponent {
    user: User | undefined
    fieldsEditable?: boolean,
    requestEditUser?: (field: TUserInfoComponentFieldToEdit, user: User) => void
}

export type TUserInfoComponentFieldToEdit = 'username' | 'password' | 'role' | 'status';

export function UserInfoComponent(data: TUserInfoComponent): React.ReactNode {
    const {t} = useTranslation();

    function handleEdit (field: TUserInfoComponentFieldToEdit, e: Event): Promise<void> {
        if (data.requestEditUser) {
            data.requestEditUser(field, data.user);
        }
    }

    function firstPart(): React.ReactNode {
        return (
            data.user !== undefined ? (
                <>
                    <div className="mb-2">
                        <small>{t(_str_user_id_label)}</small>
                        <div className="d-flex align-items-center">
                            <CBadge color='secondary' className="text-black p-2 me-2">
                                {data.user.user_id}
                            </CBadge>
                            <CopyButton textToCopy={data.user.user_id}/>
                        </div>
                    </div>

                    <div className="mb-2">
                        <small>{t(_str_user_created_at_label)}</small>
                        <div>
                            <div
                                className="fw-medium">{DatesHelper.getInstance().printDateAndTime(data.user.created_at)}</div>
                        </div>
                    </div>

                    <div className="mb-2">
                        <small>{t(_str_user_updated_at_label)}</small>
                        <div>
                            <div
                                className="fw-medium">{DatesHelper.getInstance().printDateAndTime(data.user.updated_at)}</div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                </>
            )
        )
    }

    function secondPart(): React.ReactNode {
        return (
            data.user !== undefined ? (
                <>

                    <div
                        className={"d-flex align-items-center" + (data.fieldsEditable ? " mb-2" : " mb-1")}>
                        {data.fieldsEditable && (
                            <div className="me-2">
                                <CButton
                                    color="secondary" variant="ghost" size="sm"
                                    className="border-secondary"
                                    onClick={(e) => handleEdit("username", e)}
                                >
                                    <CIcon icon={cilPencil} size="sm"/>
                                </CButton>
                            </div>
                        )}
                        <div>
                            <small>{t(_str_user_username_label)}</small>
                            <h6>{data.user.username}</h6>
                        </div>
                    </div>

                    {data.fieldsEditable && (
                        <div className="d-flex align-items-center mb-2">
                            <div className="me-2">
                                <CButton
                                    color="secondary" variant="ghost" size="sm"
                                    className="border-secondary"
                                    onClick={(e) => handleEdit("password", e)}
                                >
                                    <CIcon icon={cilPencil} size="sm"/>
                                </CButton>
                            </div>
                            <div>
                                <small>{t(_str_user_password_label)}</small>
                                <div
                                    className={"text-italic"}>{UserLocal.getInstance().getUserId() === data.user.user_id ? t(_str_change_my_password_indication) : t(_str_reset_user_password_indication)}</div>
                            </div>
                        </div>
                    )}

                    <div className={"d-flex align-items-center" + (data.fieldsEditable ? " mb-2" : " mb-2")}>
                        {data.fieldsEditable && data.user.user_id !== UserLocal.getInstance().getUserId() && (
                            <div className="me-2">
                                <CButton
                                    color="secondary" variant="ghost" size="sm"
                                    className="border-secondary"
                                    onClick={(e) => handleEdit("role", e)}
                                >
                                    <CIcon icon={cilPencil} size="sm"/>
                                </CButton>
                            </div>
                        )}
                        <div>
                            <small>{t(_str_user_role_label)}</small>
                            <div
                                className={"fw-medium small role-outlined-" + (data.user.role.toLowerCase()) + ""}>
                                {t(_str_user_role_prefix + "_" + data.user.role.toLowerCase())}
                            </div>
                        </div>
                    </div>

                    <div className={"d-flex align-items-center" + (data.fieldsEditable ? " mb-2" : " mb-2")}>
                        {data.fieldsEditable && data.user.user_id !== UserLocal.getInstance().getUserId() && (
                            <div className="me-2">
                                <CButton
                                    color="secondary" variant="ghost" size="sm"
                                    className="border-secondary"
                                    onClick={(e) => handleEdit("status", e)}
                                >
                                    <CIcon icon={cilPencil} size="sm"/>
                                </CButton>
                            </div>
                        )}
                        <div>
                            <small>{t(_str_user_status_label)}</small>
                            <div
                                className={"fw-medium small status-outlined-" + (data.user.status.toLowerCase()) + ""}>
                                {t(_str_user_status_prefix + "_" + data.user.status.toLowerCase())}
                            </div>
                        </div>
                    </div>

                </>
            ) : (
                <></>
            )
        )
    }

    return (
        data.user !== undefined ? (
            <>
                {data.fieldsEditable ? (
                    <CListGroup>
                        <CListGroupItem>

                            <CRow>
                                <CCol xs={12} lg={6} className="mb-3 mb-lg-0">
                                    {firstPart()}
                                </CCol>

                                <CCol xs={12} lg={6} className="mb-3 mb-lg-0">
                                    {secondPart()}
                                </CCol>
                            </CRow>

                        </CListGroupItem>
                    </CListGroup>
                ) : (
                    <CRow className="justify-content-center my-3">
                        <CCol xs={11}>

                            <CRow>
                                <CCol xs={12} lg={6} className="mb-3 mb-lg-0">
                                    <CListGroup>
                                        <CListGroupItem>
                                            {firstPart()}
                                        </CListGroupItem>
                                    </CListGroup>
                                </CCol>

                                <CCol xs={12} lg={6} className="mb-3 mb-lg-0">
                                    <CListGroup>
                                        <CListGroupItem>
                                            {secondPart()}
                                        </CListGroupItem>
                                    </CListGroup>
                                </CCol>
                            </CRow>

                        </CCol>
                    </CRow>
                )}
            </>
        ) : (
            <>
            </>
        )
    )
}