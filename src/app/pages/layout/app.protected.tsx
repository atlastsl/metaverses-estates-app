import {LocalstorageService, LS_AUTH_TOKEN} from "../../../services/localstorage/localstorage.service.ts";
import {PAGE_LOGIN} from "../pageslist.ts";
import {Navigate} from "react-router";
import React from "react";

export default function ProtectedRoute ({children}: {children: React.ReactNode}) {
    let logged = LocalstorageService.getInstance().getItem(LS_AUTH_TOKEN) != null;
    if (!logged){
        return <Navigate to={PAGE_LOGIN} />
    }
    //Signed in
    return children
}