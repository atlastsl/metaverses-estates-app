// @ts-nocheck
import {User} from "../../../data/user/user.dto.ts";
import React, {useEffect, useState} from "react";
import {CCard, CCardBody} from "@coreui/react";
import FirstSpinner from "../../components/first_spinner.tsx";
import UserHeaderBlock from "./components/user.header.comp.tsx";
import UserDetailComp from "./components/user.details.comp.tsx";
import {useNavigate, useParams} from "react-router";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {UserRepository} from "../../../data/user/user.repository.ts";
import "../../../assets/styles/users.css";


export default function UserDetailView(): React.ReactNode {
    const {t} = useTranslation();

    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [loadingUser, setLoadingUser] = useState(false);
    const [user, setUser] = useState<User | undefined>(undefined);

    const { user_id } = useParams();

    async function getUser() {
        setLoadingUser(l => !l);

        const response = await new UserRepository(navigate, source.token).getUser(user_id as string);
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
        [user_id]
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