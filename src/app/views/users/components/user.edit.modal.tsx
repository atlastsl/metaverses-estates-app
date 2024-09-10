// @ts-nocheck
import {CBadge, CButton, CCol, CFormInput, CFormSelect, CModal, CModalBody, CModalHeader, CRow} from "@coreui/react";
import {useState} from "react";
import FirstSpinner from "../../../components/first_spinner.tsx";
import {useTranslation} from "react-i18next";
import {
    _str_copy_failure,
    _str_copy_successful,
    _str_modal_negative_button, _str_user_confirm_password_invalid,
    _str_user_confirm_password_label,
    _str_user_edit_change_password_title,
    _str_user_edit_generated_password_btn,
    _str_user_edit_generated_password_title,
    _str_user_edit_register_user_btn,
    _str_user_edit_register_user_title,
    _str_user_edit_reset_password_btn,
    _str_user_edit_reset_password_title,
    _str_user_edit_update_btn,
    _str_user_edit_update_my_username_title,
    _str_user_edit_update_role_title,
    _str_user_edit_update_status_title,
    _str_user_edit_update_username_title, _str_user_new_password_invalid,
    _str_user_new_password_label, _str_user_old_password_invalid,
    _str_user_old_password_label,
    _str_user_reset_password_question, _str_user_role_invalid,
    _str_user_role_label,
    _str_user_role_prefix, _str_user_status_invalid,
    _str_user_status_label,
    _str_user_status_prefix, _str_user_username_invalid,
    _str_user_username_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {User, UserRole, UserStatus} from "../../../../data/user/user.dto.ts";
import ButtonLoader from "../../../components/button.loader.tsx";
import {UserLocal} from "../../../../data/user/user.local.ts";
import {StringsHelper} from "../../../../helpers/strings.helper.ts";
import {UserRepository} from "../../../../data/user/user.repository.ts";
import {useNavigate} from "react-router";
import {NOTIFICATION_SUCCESS, ShowNotification} from "../../../components/notifications.tsx";
import axios from "axios";
import CopyButton from "../../../components/copy.button.tsx";

export type TUserEditModalPurpose = 'register-user' | 'update-username' | 'change-password' | 'update-role' | 'update-status' | 'show-generated-password';

export type TUserEditModalType = 'form' | 'reset-password' | 'generated-password';

export type TUserEditModalFormField = 'username' | 'role' | 'status' | 'old_password' | 'new_password' | 'confirm_password';

export interface TUserEditModalProps {
    visible: boolean;
    backdrop: 'static';
    onClose: () => void;
    modalPurpose: TUserEditModalPurpose;
    onProcessed: (user?: User, password?: string) => void;
    user?: User;
    generatedPassword?: string;
}

export interface TUserEditModalFormDisplays {
    username: boolean;
    role: boolean;
    status: boolean;
    password: boolean;
}

class FormInputValidity {
    valid: boolean = true;
    feedback: string = "";
    constructor() {}
}

export class TUserEditModalFormInputValidity {
    username: FormInputValidity = new FormInputValidity();
    role: FormInputValidity = new FormInputValidity();
    status: FormInputValidity = new FormInputValidity();
    old_password: FormInputValidity = new FormInputValidity();
    new_password: FormInputValidity = new FormInputValidity();
    confirm_password: FormInputValidity = new FormInputValidity();
    constructor() {}
}

function testStrongPassword (str: string): boolean {
    if (str === "") return false;
    const strongPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@*?#_\-=+]).{4,}$/);
    return strongPassword.test(str);
}

export function UserEditModal(props: TUserEditModalProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [title, setTitle] = useState("");
    const [positiveBtnText, setPositiveBtnText] = useState("");
    const [loadingContent, setLoadingContent] = useState(false);
    const [loadingProcess, setLoadingProcess] = useState(false);

    const [modalType, setModalType] = useState<TUserEditModalType>('form');
    const [formModalDisplays, setFormModalDisplays] = useState<TUserEditModalFormDisplays>({});
    const [formModalValidity, setFormModalValidity] = useState<TUserEditModalFormInputValidity>({});
    const [showModalNegBtn, setShowModalNegBtn] = useState(true);

    const [username, setUsername] = useState("");
    const [role, setRole] = useState<UserRole | "">("");
    const [status, setStatus] = useState<UserStatus | "">("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    async function handlePositiveButton() {
        if (props.modalPurpose === 'show-generated-password') {
            try {
                await navigator.clipboard.writeText(props.generatedPassword || "0");
                ShowNotification(NOTIFICATION_SUCCESS, t(_str_copy_successful));
            } catch (e) {
                ShowNotification(NOTIFICATION_SUCCESS, t(_str_copy_failure, {message: e.message}));
            }
            if (props.onProcessed) {
                props.onProcessed(undefined, undefined);
            }
        }
        else {
            setLoadingProcess(l => !l);

            const formValid = validateModalForm();
            if (formValid) {
                if (props.modalPurpose === 'register-user') {
                    await registerUser();
                }
                else if (props.modalPurpose === 'update-username') {
                    if (UserLocal.getInstance().getUserId() === props.user?.user_id) {
                        await changeMyUsername();
                    }
                    else {
                        await changeUsername();
                    }
                }
                else if (props.modalPurpose === 'change-password') {
                    if (UserLocal.getInstance().getUserId() === props.user?.user_id) {
                        await changePassword();
                    }
                    else {
                        await resetPassword();
                    }
                }
                else if (props.modalPurpose === 'update-role') {
                    await updateRole();
                }
                else if (props.modalPurpose === 'update-status') {
                    await updateStatus();
                }
            }

            setLoadingProcess(l => !l);
        }
    }

    async function registerUser() {
        const response = await new UserRepository(navigate, source.token).registerUser({
            username: username,
            role: role,
        });
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(response.user, response.password);
            }
        }
    }

    async function changeMyUsername() {
        const response = await new UserRepository(navigate, source.token).changeMyUsername({
            new_username: username,
        });
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(response.user);
            }
        }
    }

    async function changePassword() {
        const response = await new UserRepository(navigate, source.token).changeMyPassword({
            old_password: oldPassword,
            new_password: newPassword,
        });
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(response.user);
            }
        }
    }

    async function changeUsername() {
        const response = await new UserRepository(navigate, source.token).changeUsername(props.user?.user_id || "0", {
            new_username: username,
        });
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(response.user);
            }
        }
    }

    async function updateRole() {
        const response = await new UserRepository(navigate, source.token).changeRole(props.user?.user_id || "0", {
            role: role,
        });
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(response.user);
            }
        }
    }

    async function updateStatus() {
        const response = await new UserRepository(navigate, source.token).changeStatus(props.user?.user_id || "0", {
            status: status,
        });
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(response.user);
            }
        }
    }

    async function resetPassword() {
        const response = await new UserRepository(navigate, source.token).resetPassword(props.user?.user_id || "0");
        if (response) {
            if (props.onProcessed) {
                props.onProcessed(undefined, response.password);
            }
        }
    }

    function resetModal() {

    }

    function handleClose() {
        resetModal();
        if (props.onClose) {
            props.onClose();
        }
    }

    function handleFieldUpdated(field: TUserEditModalFormField, value: any) {
        switch (field) {
            case 'username':
                setUsername(value as string);
                setFormModalValidity(prevState => ({...prevState, username: {valid: true, feedback: ""}}));
                break;
            case 'role':
                setRole(value as UserRole);
                setFormModalValidity(prevState => ({...prevState, role: {valid: true, feedback: ""}}));
                break;
            case 'status':
                setStatus(value as UserStatus);
                setFormModalValidity(prevState => ({...prevState, status: {valid: true, feedback: ""}}));
                break;
            case 'old_password':
                setOldPassword(value as string);
                setFormModalValidity(prevState => ({...prevState, old_password: {valid: true, feedback: ""}}));
                break;
            case 'new_password':
                setNewPassword(value as string);
                setFormModalValidity(prevState => ({...prevState, new_password: {valid: true, feedback: ""}}));
                break;
            case 'confirm_password':
                setConfirmPassword(value as string);
                setFormModalValidity(prevState => ({...prevState, confirm_password: {valid: true, feedback: ""}}));
                break;
        }
    }

    function validateModalForm(): boolean {
        let isValid = true;
        if (formModalDisplays.username) {
            const usernameValid = !StringsHelper.getInstance().isStringEmpty(username);
            if (isValid) {
                isValid = usernameValid;
            }
            setFormModalValidity(prevState => ({
                ...prevState,
                username: {
                    valid: usernameValid,
                    feedback: !usernameValid ? _str_user_username_invalid : "",
                }
            }))
        }
        if (formModalDisplays.role) {
            const roleValid = role !== "";
            if (isValid) {
                isValid = roleValid;
            }
            setFormModalValidity(prevState => ({
                ...prevState,
                username: {
                    valid: roleValid,
                    feedback: !roleValid ? _str_user_role_invalid : "",
                }
            }))
        }
        if (formModalDisplays.status) {
            const statusValid = status !== "";
            if (isValid) {
                isValid = statusValid;
            }
            setFormModalValidity(prevState => ({
                ...prevState,
                status: {
                    valid: statusValid,
                    feedback: !statusValid ? _str_user_status_invalid : "",
                }
            }))
        }
        if (formModalDisplays.password) {
            const oldPasswordValid = !StringsHelper.getInstance().isStringEmpty(oldPassword);
            const newPasswordValid = testStrongPassword(newPassword);
            const confirmPasswordValid = confirmPassword === newPassword;
            if (isValid) {
                isValid = oldPasswordValid && newPasswordValid && confirmPasswordValid;
            }
            setFormModalValidity(prevState => ({
                ...prevState,
                old_password: {
                    valid: oldPasswordValid,
                    feedback: !oldPasswordValid ? _str_user_old_password_invalid : "",
                },
                new_password: {
                    valid: newPasswordValid,
                    feedback: !newPasswordValid ? _str_user_new_password_invalid : "",
                },
                confirm_password: {
                    valid: confirmPasswordValid,
                    feedback: !confirmPasswordValid ? _str_user_confirm_password_invalid : "",
                }
            }))
        }
        return isValid;
    }

    function init() {
        switch (props.modalPurpose) {
            case "register-user":
                if (props.user || !UserLocal.getInstance().isAdmin()) {
                    handleClose();
                    return;
                }
                setModalType("form");
                setFormModalDisplays({
                    username: true,
                    role: true,
                    status: false,
                    password: false
                })
                setFormModalValidity(new TUserEditModalFormInputValidity());
                setShowModalNegBtn(true);
                setUsername("");
                setRole("");
                setTitle(_str_user_edit_register_user_title);
                setPositiveBtnText(_str_user_edit_register_user_btn);
                break;
            case 'update-username':
                if (!props.user || (props.user.user_id !== UserLocal.getInstance().getUserId() && !UserLocal.getInstance().isAdmin())) {
                    handleClose();
                    return;
                }
                setModalType("form");
                setFormModalDisplays({
                    username: true,
                    role: false,
                    status: false,
                    password: false
                });
                setFormModalValidity(new TUserEditModalFormInputValidity());
                setShowModalNegBtn(true);
                setUsername(props.user?.username || "");
                if (props.user?.user_id === UserLocal.getInstance().getUserId()) {
                    setTitle(_str_user_edit_update_my_username_title);
                } else {
                    setTitle(_str_user_edit_update_username_title);
                }
                setPositiveBtnText(_str_user_edit_update_btn);
                break;
            case 'change-password':
                if (!props.user || (props.user.user_id === UserLocal.getInstance().getUserId() && !UserLocal.getInstance().isAdmin())) {
                    handleClose();
                    return;
                }
                if (props.user.user_id === UserLocal.getInstance().getUserId()) {
                    setModalType("form");
                    setFormModalDisplays({
                        username: false,
                        role: false,
                        status: false,
                        password: true
                    });
                    setFormModalValidity(new TUserEditModalFormInputValidity());
                    setShowModalNegBtn(true);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setTitle(_str_user_edit_change_password_title);
                    setPositiveBtnText(_str_user_edit_update_btn);
                }
                else {
                    setModalType("reset-password");
                    setShowModalNegBtn(true);
                    setTitle(_str_user_edit_reset_password_title);
                    setPositiveBtnText(_str_user_edit_reset_password_btn);
                    break;
                }
                break;
            case 'update-role':
                if (!props.user || props.user.user_id === UserLocal.getInstance().getUserId() || !UserLocal.getInstance().isAdmin()) {
                    handleClose();
                    return;
                }
                setModalType("form");
                setFormModalDisplays({
                    username: false,
                    role: true,
                    status: false,
                    password: false
                });
                setFormModalValidity(new TUserEditModalFormInputValidity());
                setShowModalNegBtn(true);
                setRole(props.user.role);
                setTitle(_str_user_edit_update_role_title);
                setPositiveBtnText(_str_user_edit_update_btn);
                break;
            case 'update-status':
                if (!props.user || props.user.user_id === UserLocal.getInstance().getUserId() || !UserLocal.getInstance().isAdmin()) {
                    handleClose();
                    return;
                }
                setModalType("form");
                setFormModalDisplays({
                    username: false,
                    role: false,
                    status: true,
                    password: false
                });
                setFormModalValidity(new TUserEditModalFormInputValidity());
                setShowModalNegBtn(true);
                setStatus(props.user.status);
                setTitle(_str_user_edit_update_status_title);
                setPositiveBtnText(_str_user_edit_update_btn);
                break;
            case 'show-generated-password':
                setModalType("generated-password");
                setShowModalNegBtn(false);
                setTitle(_str_user_edit_generated_password_title);
                setPositiveBtnText(_str_user_edit_generated_password_btn);
                break;
            default:
                handleClose();
                break;
        }
    }

    return (
        <>
            <CModal visible={props.visible} onClose={handleClose} backdrop={props.backdrop} onShow={init}>
                <CModalHeader>
                    <div className="fw-medium">{t(title)}</div>
                </CModalHeader>
                <CModalBody>
                    <CRow className='justify-content-center'>
                        {loadingContent ? (
                            <CCol xs={10}>
                                {FirstSpinner()}
                            </CCol>
                        ) : (
                            <CCol xs={10}>

                                {modalType === 'form' && (
                                    <>
                                        {formModalDisplays.username && (
                                            <div className="mb-1">
                                                <small className="fw-medium">{t(_str_user_username_label)}</small>
                                                <CFormInput
                                                    placeholder={"..."}
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => handleFieldUpdated('username', e.target.value)}
                                                    invalid={!formModalValidity.username.valid}
                                                    feedbackInvalid={t(formModalValidity.username.feedback)}
                                                />
                                            </div>
                                        )}

                                        {formModalDisplays.role && (
                                            <div className="mb-1">
                                                <small className="fw-medium">{t(_str_user_role_label)}</small>
                                                <CFormSelect
                                                    value={role}
                                                    onChange={(e) => handleFieldUpdated('role', e.target.value)}
                                                    invalid={!formModalValidity.role.valid}
                                                    feedbackInvalid={t(formModalValidity.role.feedback)}
                                                >
                                                    <option value="">...</option>
                                                    {
                                                        // eslint-disable-next-line react/prop-types
                                                        Object.values(UserRole).map((role, index) => (
                                                            <option key={index} value={role}>
                                                                {t(_str_user_role_prefix + '_' + role.toLowerCase())}
                                                            </option>
                                                        ))
                                                    }
                                                </CFormSelect>
                                            </div>
                                        )}

                                        {formModalDisplays.status && (
                                            <div className="mb-1">
                                                <small className="fw-medium">{t(_str_user_status_label)}</small>
                                                <CFormSelect
                                                    value={status}
                                                    onChange={(e) => handleFieldUpdated('status', e.target.value)}
                                                    invalid={!formModalValidity.status.valid}
                                                    feedbackInvalid={t(formModalValidity.status.feedback)}
                                                >
                                                    <option value="">...</option>
                                                    {
                                                        // eslint-disable-next-line react/prop-types
                                                        Object.values(UserStatus).map((status, index) => (
                                                            <option key={index} value={status}>
                                                                {t(_str_user_status_prefix + '_' + status.toLowerCase())}
                                                            </option>
                                                        ))
                                                    }
                                                </CFormSelect>
                                            </div>
                                        )}

                                            {formModalDisplays.password && (
                                                <>
                                                    <div className="mb-1">
                                                        <small
                                                            className="fw-medium">{t(_str_user_old_password_label)}</small>
                                                        <CFormInput
                                                            placeholder={"..."}
                                                            type="password"
                                                            value={oldPassword}
                                                            onChange={(e) => handleFieldUpdated('old_password', e.target.value)}
                                                            invalid={!formModalValidity.old_password.valid}
                                                            feedbackInvalid={t(formModalValidity.old_password.feedback)}
                                                        />
                                                    </div>
                                                    <div className="mb-1">
                                                        <small
                                                            className="fw-medium">{t(_str_user_new_password_label)}</small>
                                                        <CFormInput
                                                            placeholder={"..."}
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => handleFieldUpdated('new_password', e.target.value)}
                                                            invalid={!formModalValidity.new_password.valid}
                                                            feedbackInvalid={t(formModalValidity.new_password.feedback)}
                                                        />
                                                    </div>
                                                    <div className="mb-1">
                                                        <small
                                                            className="fw-medium">{t(_str_user_confirm_password_label)}</small>
                                                        <CFormInput
                                                            placeholder={"..."}
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => handleFieldUpdated('confirm_password', e.target.value)}
                                                            invalid={!formModalValidity.confirm_password.valid}
                                                            feedbackInvalid={t(formModalValidity.confirm_password.feedback)}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                    </>
                                )}

                                {modalType === 'reset-password' && props.user && (
                                    <>
                                        <h6 className="text-center mb-2">
                                            {t(_str_user_reset_password_question, {name: props.user.username})}
                                        </h6>
                                    </>
                                )}

                                {modalType === 'generated-password' && props.generatedPassword && (
                                    <div className="text-center mb-3">
                                        <div className="d-flex justify-content-center">
                                            <CBadge color="secondary" className="fw-normal text-black p-2 one-line"
                                                    style={{width: "200px"}}>
                                                {(props.generatedPassword as string)}
                                            </CBadge>
                                            <CopyButton textToCopy={(props.generatedPassword as string)}/>
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex mt-4 mb-1 justify-content-center">
                                    {
                                        loadingProcess ?
                                            ButtonLoader() :
                                            (
                                                <>
                                                    {showModalNegBtn && (
                                                        <CButton color="secondary" size="sm" onClick={handleClose}
                                                                 className="fw-medium me-2">
                                                            {t(_str_modal_negative_button)}
                                                        </CButton>
                                                    )}
                                                    <CButton
                                                        color="primary" variant="ghost" size="sm"
                                                        className="border-primary fw-medium"
                                                        onClick={handlePositiveButton}>
                                                        {t(positiveBtnText)}
                                                    </CButton>
                                                </>
                                            )
                                    }
                                </div>

                            </CCol>
                        )}
                    </CRow>
                </CModalBody>
            </CModal>
        </>
    )
}
