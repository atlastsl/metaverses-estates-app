import {useTranslation} from "react-i18next";
import {_str_welcome_message} from "../../../helpers/intl/texts.tokens.ts";
import {UserLocal} from "../../../data/user/user.local.ts";
import {useLocation} from "react-router";
import {CCard} from "@coreui/react";


export default function BlankPage() {

    const {t} = useTranslation();
    const location = useLocation();

    let welcomeMessage = t(_str_welcome_message, {name: UserLocal.getInstance().getUsername()})

    return(
        <>
            <CCard className="mb-4">

                <div className="text-center fw-medium my-5">
                    {welcomeMessage}
                    <br/>
                    <span className='fw-bold mt-3'>{location.pathname}</span>
                </div>

            </CCard>
        </>
    )
}
