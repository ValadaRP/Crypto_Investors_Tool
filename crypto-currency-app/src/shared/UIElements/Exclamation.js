import React from "react";
import {ExclamationCircleIcon} from "@heroicons/react/solid/index";
import {Tooltip} from "@mui/material";

const Exclamation = props => {
    return(
            <>
                <Tooltip title={props.title} placement={props.placement}>
                    <ExclamationCircleIcon className={`pl-2 h-[30px] text-red-600 ${props.hasError ? "visible" : "invisible"} transform transition-all hover:scale-125`}/>
                </Tooltip>
            </>
    );
}

export default Exclamation;