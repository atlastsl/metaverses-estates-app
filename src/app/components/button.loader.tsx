import {blue_mel} from "./colors.ts";
import {PuffLoader} from "react-spinners";
import React from "react";

export default function ButtonLoader (height?: number): React.ReactNode {
    return <>
        <PuffLoader
            sizeUnit={"px"}
            height={height != null ? height : 25}
            color={blue_mel}
            loading={true}
        />
    </>;
}
