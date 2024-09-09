import * as React from "react";
import {useTranslation} from "react-i18next";
import {_str_english_lang, _str_french_lang, _str_lang_selection} from "../../helpers/intl/texts.tokens.ts";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import {CIcon} from "@coreui/icons-react";
import {cifFr, cifGb, cilTranslate} from "@coreui/icons";

export default function LangSelector({location = "in"}): React.ReactNode {

    const {t, i18n} = useTranslation();

    function handleChangeLanguage (language) {
        i18n.changeLanguage(language).then();
    }


    return (
        <>
            {
                location === "in" ? (
                    <>
                        <CDropdown variant="nav-item" className="language-item">
                            <CDropdownToggle caret={false}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <CIcon icon={cilTranslate} size="lg" className="me-2" />
                                    <div className="d-none d-md-inline">{t(_str_lang_selection)}</div>
                                </div>
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem>
                                    <div className="d-flex align-items-center cursorView mx-2" onClick={(e)=>handleChangeLanguage('en',e)}>
                                        <CIcon icon={cifGb} size="lg" className="me-2" />
                                        <span>{t(_str_english_lang)}</span>
                                    </div>
                                </CDropdownItem>
                                <CDropdownItem>
                                    <div className="d-flex align-items-center cursorView mx-2" onClick={(e)=>handleChangeLanguage('fr',e)}>
                                        <CIcon icon={cifFr} size="lg" className="me-2"/>
                                        <span>{t(_str_french_lang)}</span>
                                    </div>
                                </CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </>
                ) : (
                    <div>
                        <small className="text-decoration-underline cursorView"
                               onClick={(e) => handleChangeLanguage('en', e)}>
                            {t(_str_english_lang)}
                        </small>
                        <span className="mx-1">|</span>
                        <small className="text-decoration-underline cursorView" onClick={(e) => handleChangeLanguage('fr', e)}>
                            {t(_str_french_lang)}
                        </small>
                    </div>
                )
            }
        </>
    )
}