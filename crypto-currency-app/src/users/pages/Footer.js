import React,{useContext, useState} from "react";

const Footer = () => {

    return(
        <footer className={"bg-black z-30 relative bottom-0 w-full h-20 text-white flex items-center justify-center"}>
            <div className={"flex w-3/4 items-center justify-center text-center "}>
                <p className={"font-mono text-2xl"}>Author of website: Piotr Miciak</p>
            </div>
        </footer>
    );
}

export default Footer;