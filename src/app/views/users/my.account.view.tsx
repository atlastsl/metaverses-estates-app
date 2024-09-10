// @ts-nocheck
import {User} from "../../../data/user/user.dto.ts";
import React, {useEffect, useState} from "react";
import {CCard, CCardBody} from "@coreui/react";
import FirstSpinner from "../../components/first_spinner.tsx";
import UserHeaderBlock from "./components/user.header.comp.tsx";
import UserDetailComp from "./components/user.details.comp.tsx";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {UserRepository} from "../../../data/user/user.repository.ts";
import "../../../assets/styles/users.css";

export default function MyAccountView(): React.ReactNode {

    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [loadingUser, setLoadingUser] = useState(false);
    const [user, setUser] = useState<User | undefined>(undefined);

    async function getUser() {
        setLoadingUser(l => !l);

        const response = await new UserRepository(navigate, source.token).myAccount();
        if (response) {
            setUser(response.user);
        }

        setLoadingUser(l => !l);
    }

    function cancelInit() {
        source.cancel();
    }

    useEffect(
        () => {
            getUser().then();
            return () => cancelInit();
        },
        []
    );

    return (
        <>

            <CCard className='mb-4'>
                <CCardBody>

                    { loadingUser ? (
                        FirstSpinner()
                    ) : (
                        <>

                            <UserHeaderBlock user={user} />

                            <UserDetailComp user={user} />

                        </>
                    ) }

                </CCardBody>
            </CCard>

        </>
    )
}