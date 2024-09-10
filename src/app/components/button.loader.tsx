// @ts-nocheck
import {blue_mel} from "./colors.ts";
import {PuffLoader} from "react-spinners";
import React from "react";

export default function ButtonLoader (height?: number): React.ReactNode {
    return <>
        <PuffLoader
            height={height != null ? height : 25}
            color={blue_mel}
            loading={true}
        />
    </>;
}
