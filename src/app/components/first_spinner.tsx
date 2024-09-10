// @ts-nocheck
import {blue_mel} from "./Colors.ts";
import {SyncLoader} from "react-spinners";
import * as React from "react";


export default function FirstSpinner (height?: number, size?: number): React.ReactNode {
    return <>
        <div className="d-flex justify-content-center align-items-center" style={{height: height ? height : "50vh"}}>
            <SyncLoader
                size={size ? size : 15}
                color={blue_mel}
            />
        </div>
    </>;
}