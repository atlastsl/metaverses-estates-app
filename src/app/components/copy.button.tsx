// @ts-nocheck
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {NOTIFICATION_SUCCESS, ShowNotification} from "./notifications.tsx";
import {cilCopy} from "@coreui/icons";
import {CIcon} from "@coreui/icons-react";
import {_str_copy_failure, _str_copy_successful} from "../../helpers/intl/texts.tokens.ts";


function CopyButton ({textToCopy,bg_color,noMessage,width=16}): React.ReactNode{

    const {t} = useTranslation();
    const [copied,setCopied] = useState(false);

    async function copy(){
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(t => !t);
            setTimeout(()=>{setCopied(t => !t)},500);
            ShowNotification(NOTIFICATION_SUCCESS, t(_str_copy_successful));
        } catch (e) {
            ShowNotification(NOTIFICATION_SUCCESS, t(_str_copy_failure, {message: e.message}));
        }
    }

    return(
        <div onClick={copy}>
            <CIcon icon={cilCopy} width={width} className={"copyButton " + (bg_color != null ? bg_color : "")} />
            {noMessage != null && copied && <span className={bg_color != null ? (bg_color + " copiedText") : "copiedText"}>Copied !</span>}
        </div>
    )

}

export default CopyButton;