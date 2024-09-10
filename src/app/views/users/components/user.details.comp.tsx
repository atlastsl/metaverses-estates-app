// @ts-nocheck
import {User} from "../../../../data/user/user.dto.ts";
import React from "react";
import {TUserInfoComponentFieldToEdit, UserInfoComponent} from "./user.info.comp.tsx";
import {TUserEditModalPurpose, UserEditModal} from "./user.edit.modal.tsx";


export default function UserDetailComp({user}: {user: User}): React.ReactNode {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalPurpose, setModalPurpose] = React.useState<TUserEditModalPurpose>('register-user');
    const [generatedPassword, setGeneratedPassword] = React.useState<string | undefined>(undefined);

    const [vUser, setVUser] = React.useState<User>(user);

    function handleCloseModal() {
        setModalVisible(false);
    }

    function handleProcessedUserEdited(user?: User, password?: string) {
        if (user) {
            setVUser(user);
        }
        if (password) {
            setGeneratedPassword(password);
            setTimeout(() => {
                setModalPurpose('show-generated-password');
                setModalVisible(true);
            }, 200)
        }
        setModalVisible(false);
    }

    function handleRequestEditUser(field: TUserInfoComponentFieldToEdit, user: User): void {
        switch (field) {
            case "username":
                setModalPurpose('update-username');
                break;
            case "password":
                setModalPurpose('change-password');
                break;
            case "role":
                setModalPurpose('update-role');
                break;
            case "status":
                setModalPurpose('update-status');
                break;
        }
        setModalVisible(true);
    }

    return (
        <>
            <UserInfoComponent
                user={vUser}
                fieldsEditable={true}
                requestEditUser={handleRequestEditUser} />

            <UserEditModal
                visible={modalVisible}
                backdrop={"static"}
                onClose={handleCloseModal}
                modalPurpose={modalPurpose}
                onProcessed={handleProcessedUserEdited}
                user={vUser}
                generatedPassword={generatedPassword} />
        </>
    )
}