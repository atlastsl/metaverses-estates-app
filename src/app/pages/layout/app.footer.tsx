import * as React from "react";
import {_str_app_name} from "../../../helpers/intl/texts.tokens.ts";
import {useTranslation} from "react-i18next";
import { CFooter } from '@coreui/react';

function AppFooter() : React.ReactNode {

    const {t} = useTranslation();

    return (
        <CFooter>
            <span className="m-auto">
                <span className="fw-bold">&copy; {new Date().getFullYear().toString(10)} {t(_str_app_name)}</span>
            </span>
        </CFooter>
    )
}

export default React.memo(AppFooter)
