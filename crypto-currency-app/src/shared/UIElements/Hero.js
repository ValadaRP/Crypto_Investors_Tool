import React from "react";
import {Link} from "react-router-dom";
import Image from "../../shared/UIElements/Image";

const Hero = props => {

    return(
        <section className="bg-white dark:bg-gray-900">
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white ">Website for cryptocurrency investors</h1>
                    <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">You can use this website to check the cryptocurrency data. You will have acces to charts and historic data.</p>
                    <Link to={"/auth"} className=" inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 duration-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                        Login/Register
                    </Link>
                    </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <Image src={props.src} alt={props.alt} />
                </div>
            </div>
            <div className={"flex flex-row w-full"}>
                <div className={"w-1/2"}><Image src={props.chainSrc} alt={props.chainAlt}/></div>
                <div className={"flex flex-col justify-center w-1/2"}>
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white ">Block chain Technology</h1>
                    <p className={"text-base leading-tight tracking-tight text-xl text-gray-700"}>Blockchain is a technology that allows for the creation of a decentralized network for storing and transmitting information.
                        A key feature of blockchain is its ability to register transactions in blocks that are linked together in a chain. Each block contains information about previous transactions, which makes the entire network resistant to modifications and abuses. </p>
                </div>
            </div>
        </section>
    );
}

export default Hero;