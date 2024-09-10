// @ts-nocheck
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {TableColumn} from "react-data-table-component";
import {User, UserStatus} from "../../../data/user/user.dto.ts";
import {cilCheckAlt, cilReload} from "@coreui/icons";
import {
    _str_actions_label,
    _str_details_btn,
    _str_element_deleted,
    _str_list_no_items_found,
    _str_register_user_btn,
    _str_user_created_at_label,
    _str_user_role_label,
    _str_user_role_prefix,
    _str_user_status_label,
    _str_user_status_prefix,
    _str_user_username_label
} from "../../../helpers/intl/texts.tokens.ts";
import {UserLocal} from "../../../data/user/user.local.ts";
import {MY_ACCOUNT_PAGE, USER_DETAILS_PAGE} from "../../pages/pageslist.ts";
import {StringsHelper} from "../../../helpers/strings.helper.ts";
import {DatesHelper} from "../../../helpers/dates.helper.ts";
import {CButton, CCard, CCardBody} from "@coreui/react";
import FirstSpinner from "../../components/first_spinner.tsx";
import {CIcon} from "@coreui/icons-react";
import Pagination, {DEFAULT_TAKE, TAKES_OPTIONS} from "../../components/pagination.tsx";
import {UserListItem} from "./components/user.list.item.tsx";
import axios from "axios";
import {UserRepository} from "../../../data/user/user.repository.ts";
import DataTable from "react-data-table-component";
import {useDispatch, useSelector} from "react-redux";
import {TUserEditModalPurpose, UserEditModal} from "./components/user.edit.modal.tsx";
import {Link} from "react-router-dom";

export default function UsersListView(): React.ReactNode {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const dispatch = useDispatch();
    let usersRowsPerPage = useSelector((state) => state.userRowsPerPage);
    if (usersRowsPerPage === 0) {
        usersRowsPerPage = DEFAULT_TAKE;
    }

    const [loadingFirstPage, setLoadingFirstPage] = useState(false);
    const [loadingNavigation, setLoadingNavigation] = useState(false);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState<User[]>([]);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalPurpose, setModalPurpose] = React.useState<TUserEditModalPurpose>('register-user');
    const [generatedPassword, setGeneratedPassword] = React.useState<string | undefined>(undefined);
    const [tempUser, setTempUser] = React.useState<User>();

    function handleRegisterUser (e) {
        e.preventDefault();
        setModalVisible(true);
        setModalPurpose('register-user');
    }

    function handleCloseModal() {
        setModalVisible(false);
    }

    function handleProcessedUserEdited(user?: User, password?: string) {
        if (user) {
            setTempUser(user);
        }
        if (password) {
            setGeneratedPassword(password);
            setTimeout(() => {
                setModalPurpose('show-generated-password');
                setModalVisible(true);
            }, 200)
        }
        else {
            if (tempUser) {
                getUsersList(1, usersRowsPerPage).then();
                setTempUser(null);
            }
        }
        setModalVisible(false);
    }

    async function getUsersList (page: number, take: number, e?: Event): Promise<void> {
        if (e) {
            e.preventDefault();
        }

        setLoadingNavigation(l => !l);

        const response = await new UserRepository(navigate).listUsers(
            {
                page: page,
                take: take,
            }
        );
        if (response) {
            setTotal(response.pagination.total);
            setUsers(response.users);
            setPage(response.pagination.page);
        }

        setLoadingNavigation(l => !l);
    }

    async function init() {
        setLoadingFirstPage(t => !t);

        await getUsersList(1, usersRowsPerPage);

        setLoadingFirstPage(t => !t);
    }

    function cancelInit() {
        source.cancel();
    }

    useEffect(
        () => {
            init().then();
            return () => cancelInit();
        },
        []
    );

    const columns: TableColumn<User>[] = [
        {
            name: '',
            cell: (row) => <>
                {
                    row.status == UserStatus.SUSPENDED &&
                    <div className="deleteUserPoint" title={t(_str_element_deleted)}><CIcon icon={cilCheckAlt} size="sm" className="invisible" /></div>
                }
            </>,
            width: "20px"
        },
        {
            name: t(_str_user_username_label),
            cell: row => <div className="one-line">{row.username}</div>,
        },
        {
            name: t(_str_user_role_label),
            cell: row => <div className={"one-line role-"+(row.role.toLowerCase())}>{t(`${_str_user_role_prefix}_${row.role.toString().toLowerCase()}`)}</div>,
            hide: "md"
        },
        {
            name: t(_str_user_status_label),
            cell: row => <div className={"one-line status-"+(row.status.toLowerCase())}>{t(`${_str_user_status_prefix}_${row.status.toString().toLowerCase()}`)}</div>,
        },
        {
            name: t(_str_user_created_at_label),
            cell: row => <div className={"one-line"}>{DatesHelper.getInstance().printDateAndTime(row.created_at)}</div>,
            width: "180px",
            hide:"md"
        },
        {
            name: t(_str_actions_label),
            cell: (row) => (
                <Link to={UserLocal.getInstance().getUser()?.user_id === row.user_id ? MY_ACCOUNT_PAGE : StringsHelper.getInstance().replaceAll(USER_DETAILS_PAGE, ":user_id", row.user_id)}>
                    <CButton color="primary" variant="ghost" className="border-primary fw-medium" size="sm">
                        {t(_str_details_btn)}
                    </CButton>
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            width: "120px",
            button: true,
            omit: false
        }
    ]

    return (
        <>

            <CCard className={"mb-4"}>
                <CCardBody>

                    {
                        loadingFirstPage ? (
                            FirstSpinner()
                        ) : (
                            <>

                                <div className="d-flex justify-content-end flex-wrap mb-3">
                                    <CButton color="primary" variant="outline" className="border-primary" size="sm" onClick={handleRegisterUser}>
                                        {t(_str_register_user_btn)}
                                    </CButton>
                                </div>

                                <div className="d-flex justify-content-end align-content-center mb-2">
                                    <Pagination
                                        options={"GET"}
                                        total={total}
                                        page={page}
                                        get={getUsersList}
                                    />
                                    <CButton color="primary" size="sm" onClick={(e) => getUsersList(1, usersRowsPerPage, e)}>
                                        <CIcon icon={cilReload}/>
                                    </CButton>
                                </div>

                                {
                                    loadingNavigation ? (
                                        FirstSpinner()
                                    ) : (
                                        <div className="mb-2">
                                            {
                                                users.length === 0 ? (
                                                    <div className="text-center my-5">
                                                        {t(_str_list_no_items_found)}
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-center mb-3">

                                                        <DataTable
                                                            noHeader={true}
                                                            columns={columns}
                                                            data={users}
                                                            expandableRows
                                                            expandOnRowClicked
                                                            expandableRowsComponent={UserListItem}
                                                            highlightOnHover
                                                            striped
                                                            responsive
                                                            paginationPerPage={usersRowsPerPage}
                                                            paginationRowsPerPageOptions={TAKES_OPTIONS}
                                                            onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                                                dispatch({type: 'set', userRowsPerPage: currentRowsPerPage})
                                                                getUsersList(currentPage, usersRowsPerPage, undefined).then()
                                                            }}
                                                        />

                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                            </>
                        )
                    }

                </CCardBody>
            </CCard>

            <UserEditModal
                visible={modalVisible}
                backdrop={"static"}
                onClose={handleCloseModal}
                modalPurpose={modalPurpose}
                onProcessed={handleProcessedUserEdited}
                generatedPassword={generatedPassword} />

        </>
    )
}