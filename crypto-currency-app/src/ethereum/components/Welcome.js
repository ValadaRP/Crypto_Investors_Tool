import React, {useContext, useState} from "react";
import Loader from "./Loader";
import {BsInfoCircle, SiEthereum} from "react-icons/all";
import {Tooltip} from "@mui/material";
import {TransactionContext} from "../../context/transaction-context";
import { notifyWarr} from "../../toastFunctions/toastFun";
import Exclamation from "../../shared/UIElements/Exclamation";


const Input = ({ placeholder, name, type, value, handleChange, hasError }) => (
    <input placeholder={placeholder}
           type={type}
           step={"0.0001"}
           value={value}
           onChange={(e) => handleChange(e, name)}
           className={`my-2 w-full rounded-sm p-2 outline-none text-sm bg-conic-to-r from-indigo-200 via-slate-600 to-indigo-200 ${hasError ? "border-red-500" : "border-none"}`}
    />
);

const Welcome = () => {

    const {connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading} = useContext(TransactionContext);

    const [addressToHasError, setAddressToHasError] = useState(false);
    const [amountHasError, setAmountHasError] = useState(false);
    const [messageHasError, setMessageHasError] = useState(false);


    const handleSubmit = (e) => {
        setAddressToHasError(false);
        setAmountHasError(false);
        setMessageHasError(false);

        e.preventDefault();
        const { addressTo, amount, message } = formData;
        console.log(currentAccount);


        // if (!addressTo || !amount || !message) return notifyAnswer("Please fill all the fields! ");
        if (!addressTo){
            setAddressToHasError(true);
            return notifyWarr("Address have to contain 42 signs! ");
        } else if (amount <= 0){
            setAmountHasError(true);
            return notifyWarr("Amount can't be smaller than 0 ! ");
        }else if (message.length < 4 || message.length > 100){
            setMessageHasError(true);
            return notifyWarr("Message is to short or to long! ");
        }else if (!addressTo || !amount || !message){
            setAddressToHasError(true);
            setAmountHasError(true);
            setMessageHasError(true);
            return notifyWarr("Fields can't be empty! ");
        }
        else {
            setAddressToHasError(false);
            setAmountHasError(false);
            setMessageHasError(false);
        }

        console.log(formData);

        sendTransaction();



    }


    const commonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-black text-sm font-light text-center';

    return(
        <div className={"flex w-full justify-center items-center bg-white"}>
            <div className={"flex mf:flex-row flex-col justify-between md:p-20 py-12 px-4 w-5/6"}>
                <div className={"flex flex-1 justify-start flex-col mf:mr-10"}>
                    <h1 className={"text-3xl text-gradient p-1 sm:text-5xl"}>
                        Send Crypto <br /> across the globe
                    </h1>
                    <p className={"text-left mt-5 font-light md:w-9/12 w-11/12 text-base"}>
                        Explore the world of crypto and send crypto to your friends and family
                    </p>
                    {!currentAccount && (
                        <button type={"button"} onClick={connectWallet} className={"flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd] "}>
                            <p className={"text-white text-base font-semibold"}>Connect Wallet</p>
                        </button>)}
                    <div className={"grid sm:grid-cols-3 grid-cols-2 w-full mt-10"}>
                        <div className={`sm:rounded-tl-2xl md:rounded-tl-2xl ${commonStyles}`}>
                            <p className={"text-2xl"}>Secure</p>
                        </div>
                        <div className={`${commonStyles}`}>
                            <p className={"text-2xl"}>Ethereum</p>
                        </div>
                        <div className={`sm:rounded-tr-2xl md:rounded-tr-2xl ${commonStyles}`}>
                            <p className={"text-2xl"}>Charts</p>
                        </div>
                        <div className={`sm:rounded-bl-2xl md:rounded-bl-2xl ${commonStyles}`}>
                            <p className={"text-2xl"}>Transaction History</p>
                        </div>
                        <div className={`${commonStyles}`}>
                            <p className={"text-2xl"}>Send ETH</p>
                        </div>
                        <div className={`sm:rounded-br-2xl ${commonStyles}`}>
                            <p className={"text-2xl"}>Detailed Information</p>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10"}>
                    <Tooltip title={"Your Crypto Card"} placement={"top"} arrow>
                        <div className={"p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 border-black border-[0.5px]"}>
                            <div className={"flex justify-between flex-col w-full h-full"}>
                                <div className={"flex justify-between items-start"}>
                                    <div className={"w-10 h-10 rounded-full border-2 border-white flex justify-center items-center"}>
                                        <SiEthereum fontSize={21} color={"#fff"}/>
                                    </div>
                                    <BsInfoCircle fontSize={17} color={"#fff"}/>
                                </div>
                                <div>
                                    <p className={"text-white font-light text-sm"}>
                                        {currentAccount ? currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4) : "Connect your wallet"}
                                    </p>
                                    <p className={"text-white font-semibold text-lg mt-1"}>
                                        Ethereum
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Tooltip>
                    <div className={"p-5 sm:w-96 w-full flex flex-col justify-start items-center bg-gradient-to-b from-gray-900 to-gray-600 bg-gradient-to-r rounded-lg shadow"}>
                        <p className={"text-white text-start font-bold text-5xl mb-6 "}>Send ETH</p>
                        <div className={"flex flex-row w-full items-center justify-center"}>
                            <Input placeholder={"Address To"} name={"addressTo"} type={"text"} handleChange={ handleChange} hasError={addressToHasError}/>
                            <Exclamation title={"Address can't be shorter than 42 signs"} placement={"right"} hasError={addressToHasError} className={"w-full"}/>
                        </div>
                        <div className={"flex flex-row w-full items-center justify-center"}>
                            <Input placeholder={"Amount (ETH)"} name={"amount"} type={"number"} handleChange={ handleChange } hasError={amountHasError} min={0.0001} max={100}/>
                            <Exclamation title={"Amount can't be 0 or lower than 0"} placement={"right"} hasError={amountHasError} className={"w-full"}/>
                        </div>
                        <div className={"flex flex-row w-full items-center justify-center"}>
                            <Input placeholder={"Enter Message"} name={"message"} type={"text"} handleChange={ handleChange } hasError={messageHasError}/>
                            <Exclamation title={"Message can't be smaller 5 signs or bigger than 100 signs"} placement={"right"} hasError={messageHasError} className={"w-full"}/>
                        </div>
                        <div className={"h-[1px] w-full bg-gray-400 mt-4"}/>
                        {isLoading ? (
                            <Loader />
                        ) : (<button type={"button"} onClick={handleSubmit} className={"bg-red-700 hover:bg-red-800 hover:ring-1 w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer mt-4"}><p className={"text-white"}>Send now</p></button>)}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Welcome;