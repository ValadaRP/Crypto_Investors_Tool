import React from "react";
import Image from "../../shared/UIElements/Image";
import nodeJS from "../../images/nodejs.png";
import coinGecko from "../../images/coinGecko.png";
import mongoDB from "../../images/mongoDB.png";
import tailwindCss from "../../images/tailwindcss.png";
import solidity from "../../images/solidity.png";

const Tools = () => {
    return(
        <div className={"flex flex-col w-full bg-white gap-y-32 p-8"}>
            <div className={"flex flex-row gap-x-4"}>
                <div className={"flex items-center justify-center w-1/2"}><Image src={nodeJS} alt={"Here should be nodeJs photo"} height={500} width={500}/></div>
                <div className={"flex flex-col items-center justify-center w-1/2 gap-y-8"}>
                    <h1 className={"text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white "}>NodeJS & Express</h1>
                    <p className={"text-base leading-tight tracking-tight text-xl text-gray-700"}>Node.js is a platform based on the JavaScript language that allows you to create server applications.
                        Express is a Node.js library that provides a variety of tools for creating web applications, such as handling different types of HTTP requests and middleware.</p>
                </div>
            </div>
            <div className={"flex flex-row gap-x-4"}>
                <div className={"flex flex-col items-center justify-center w-1/2 gap-y-8"}>
                    <h1 className={"text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white "}>CoinGecko</h1>
                    <p className={"text-base leading-tight tracking-tight text-xl text-gray-700"}>CoinGecko is a tool for analyzing the cryptocurrency market, which collects data from multiple exchanges and provides it to users in an accessible form.
                        It allows you to track prices, volumes, and other indicators for various cryptocurrencies.</p>
                </div>
                <div className={"flex justify-center w-1/2"}><Image src={coinGecko} alt={"Here should be coinGecko photo"} height={500} width={500}/></div>
            </div>
            <div className={"flex flex-row gap-x-4"}>
                <div className={"flex items-center justify-center w-1/2"}><Image src={mongoDB} alt={"Here should be mongoDB photo"} height={500} width={500}/></div>
                <div className={"flex flex-col justify-center w-1/2 gap-y-8"}>
                    <h1 className={"text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white "}>MongoDB & Mongoose</h1>
                    <p className={"text-base leading-tight tracking-tight text-xl text-gray-700"}>MongoDB is a NoSQL database that allows you to store data in the form of JSON documents. Mongoose is a Node.js library that makes it easier to manage data in MongoDB by defining data structures and validation.</p>
                </div>
            </div>
            <div className={"flex flex-row gap-x-4"}>
                <div className={"flex flex-col items-center justify-center w-1/2 gap-y-8"}>
                    <h1 className={"text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white "}>Solidity</h1>
                    <p className={"text-base leading-tight tracking-tight text-xl text-gray-700"}>Solidity is a programming language used to create smart contracts for the Ethereum platform. Smart contracts are programs that are run on the blockchain and enable the automation of processes based on certain conditions.</p>
                </div>
                <div className={"flex items-center justify-center w-1/2"}><Image src={solidity} alt={"Here should be solidity photo"} height={500} width={500}/></div>
            </div>
            <div className={"flex flex-row gap-x-4"}>
                <div className={"flex items-center justify-center w-1/2"}><Image src={tailwindCss} alt={"Here should be tailwindCSS photo"} height={500} width={500}/></div>
                <div className={"flex flex-col justify-center w-1/2 gap-y-8"}>
                    <h1 className={"text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white "}>TailwindCSS</h1>
                    <p className={"text-base leading-tight tracking-tight text-xl text-gray-700"}>Tailwind CSS is a CSS styles library that allows you to quickly create websites by providing ready-made CSS classes for formatting HTML elements.
                        Tailwind CSS is based on the concept of creating the user interface using class compositions, which allows for fast and flexible project creation.</p>
                </div>
            </div>
        </div>
    )
}

export default Tools;