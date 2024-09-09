import {User} from "../../../../data/user/user.dto.ts";
import React from "react";
import {UserInfoComponent} from "./user.info.comp.tsx";

export function UserListItem({data}: {data: User}): React.ReactNode {

    return (
        <UserInfoComponent user={data} fieldsEditable={false} requestEditUser={undefined} />
    )
}