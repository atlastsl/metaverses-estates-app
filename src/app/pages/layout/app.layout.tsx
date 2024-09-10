// @ts-nocheck
import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {PAGE_LOGIN} from "../pageslist.ts";
import {NOTIFICATION_SUCCESS, ShowNotification} from "../../components/notifications.tsx";
import {UserLocal} from "../../../data/user/user.local.ts";
import {_str_goodbye_message} from "../../../helpers/intl/texts.tokens.ts";
import {LocalstorageService} from "../../../services/localstorage/localstorage.service.ts";
import AppSidebar from "./app.sidebar.tsx";
import AppHeader from "./app.header.tsx";
import AppContent from "./app.content.tsx";
import AppFooter from "./app.footer.tsx";


export default function AppLayout (): React.ReactNode {
    const navigate = useNavigate();

    const {t} = useTranslation();

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    async function signOut (e){
        e.preventDefault();
        ShowNotification(NOTIFICATION_SUCCESS, t(_str_goodbye_message, {name: UserLocal.getInstance().getUsername()}));
        LocalstorageService.getInstance().clearStorage();
        navigate(PAGE_LOGIN);
    }

    useEffect(() => {
        // Update network status
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };
        // Listen to the online status
        window.addEventListener('online', handleStatusChange);
        // Listen to the offline status
        window.addEventListener('offline', handleStatusChange);

        // Specify how to clean up after this effect for performance improvment
        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, [isOnline]);

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeader signOut={e => signOut(e)} isOnline={isOnline} />
                <div className="body flex-grow-1 px-3">
                    <AppContent />
                </div>
                <AppFooter />
            </div>
        </div>
    )

}