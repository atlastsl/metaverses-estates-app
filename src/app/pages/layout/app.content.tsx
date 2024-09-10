// @ts-nocheck
import {UserLocal} from "../../../data/user/user.local.ts";
import {getFirstPageToDisplay} from "./navigation.tsx";
import * as React from "react";
import { CContainer } from '@coreui/react';
import {Suspense} from "react";
import FirstSpinner from "../../components/first_spinner.tsx";
import {Navigate, Route, Routes} from "react-router";
import {routes} from "../routes.ts";
import ErrorBoundary from "../../components/error_boundary.tsx";

function AppContent(): React.ReactNode {
    const userRole = UserLocal.getInstance().getUserRole();
    const defaultPage = getFirstPageToDisplay(userRole);

    return (
        <CContainer lg>
            <Suspense fallback={FirstSpinner()}></Suspense>
            <Routes>
                {routes.map((route, idx) => {
                    return (
                        route.element ? (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                element={
                                    <ErrorBoundary>
                                        <route.element />
                                    </ErrorBoundary>
                                }
                            />
                        ) : (null)
                    )
                })}
                <Route path="/*" element={<Navigate to={defaultPage} replace />} />
            </Routes>
        </CContainer>
    )
}

export default React.memo(AppContent)
