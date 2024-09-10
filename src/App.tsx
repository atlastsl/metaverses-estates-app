// @ts-nocheck
import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import FirstSpinner from "./app/components/first_spinner.tsx";
import {PAGE_404, PAGE_500, PAGE_LOGIN} from "./app/pages/pageslist.ts";
import ProtectedRoute from "./app/pages/layout/app.protected.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import {Suspense} from "react";
import {Route, Routes} from "react-router";

const AppLayout = React.lazy(() => import('./app/pages/layout/app.layout.tsx'));

// Pages
const Login = React.lazy(() => import('./app/pages/pages/login.page.tsx'));
const Page404 = React.lazy(() => import('./app/pages/pages/error.400.page.tsx'));
const Page500 = React.lazy(() => import('./app/pages/pages/error.500.page.tsx'));

function App(): React.ReactNode {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={FirstSpinner()}>
                    <Routes>
                        <Route exact path={PAGE_LOGIN} name="Login Page" element={<Login />} />
                        <Route exact path={PAGE_404} name="Page 404" element={<Page404 />} />
                        <Route exact path={PAGE_500} name="Page 500" element={<Page500 />} />
                        <Route path="*" name="Home" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}/>
                    </Routes>
                </Suspense>

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            </BrowserRouter>
        </>
    )
}

export default App
