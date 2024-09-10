// @ts-nocheck
import {useTranslation} from "react-i18next";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow, CSpinner
} from "@coreui/react";
import LogoMEL from '../../../assets/logo_mel.png';
import {
    _str_app_name,
    _str_login_btn_text,
    _str_login_form_login,
    _str_login_form_password, _str_login_page_title, _str_welcome_message
} from "../../../helpers/intl/texts.tokens.ts";
import {cilLockLocked, cilUser} from "@coreui/icons";
import {CIcon} from "@coreui/icons-react";
import {useState} from "react";
import {useNavigate} from "react-router";
import {UserRepository} from "../../../data/user/user.repository.ts";
import {UserLocal} from "../../../data/user/user.local.ts";
import {NOTIFICATION_SUCCESS, ShowNotification} from "../../components/notifications.tsx";
import LangSelector from "../../components/lang.selector.tsx";
import axios from "axios";

export default function LoginPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    function handleLoginChanged (e) {
        setLogin(e.target.value);
    }

    function handlePasswordChanged (e) {
        setPassword(e.target.value);
    }

    async function handleLoginFormSubmit (e) {
        e.preventDefault();

        setLoading(l => !l);
        let loginResponse = await new UserRepository(navigate, source.token).login({ username: login, password })
        setLoading(l => !l);

        if (loginResponse) {
            UserLocal.getInstance().saveUser(loginResponse.user, loginResponse.access_token);
            let welcomeMessage = t(_str_welcome_message, {name: UserLocal.getInstance().getUsername()});
            navigate("/");
            ShowNotification(NOTIFICATION_SUCCESS, welcomeMessage);
        }

    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={10} lg={5}>
                        <CCard className="px-4 py-2">
                            <CCardBody>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <img className="app-logo d-block" src={LogoMEL} alt={_str_app_name}/>
                                    <LangSelector location={"out"}/>
                                </div>
                                <div className="text-center text-medium-emphasis mb-3">
                                    <h6>{t(_str_login_page_title)}</h6>
                                </div>

                                <div>
                                    <CForm onSubmit={(e) => handleLoginFormSubmit(e)}>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                value={login}
                                                onChange={handleLoginChanged}
                                                placeholder={t(_str_login_form_login)}
                                                required
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                value={password}
                                                onChange={handlePasswordChanged}
                                                placeholder={t(_str_login_form_password)}
                                                required
                                            />
                                        </CInputGroup>

                                        <div className="text-center">
                                            <CButton color="primary" className="px-4 text-white" type="submit" disabled={loading}>
                                                {loading ? <CSpinner color="white" size="sm" /> : t(_str_login_btn_text)}
                                            </CButton>
                                        </div>

                                    </CForm>
                                </div>

                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}