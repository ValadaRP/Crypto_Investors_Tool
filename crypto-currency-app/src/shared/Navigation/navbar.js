import React, {useContext, useState} from "react";
import {
    Link, NavLink
} from "react-router-dom";
import { MenuIcon, XIcon, UserIcon, CreditCardIcon  } from '@heroicons/react/solid';
import Backdrop from "../UIElements/Backdrop";
import { AuthContext } from "../../context/auth-context";
import {Box, Modal, Typography} from "@mui/material";
import useInput from "../../hooks/use-input";
import {testFloatNumber, validFloatNumber, validSize} from "../../validation/RegexFunctions";
import {useHttpClient} from "../../hooks/http-hook";
import ToastNotify from "../UIElements/ToastNotify";
import {notifySucces, notifyWarr} from "../../toastFunctions/toastFun";
import LoadingButton from "../UIElements/LoadingButton";
import Exclamation from "../UIElements/Exclamation";
import {BsInfoCircle, RiMoneyEuroCircleLine} from "react-icons/all";


const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const auth = useContext(AuthContext);


    const handleNav = () => {
        setNav(!nav);
    }

    const handleDepositModal = () => {
        resetAmountInput();
        setShowDepositModal(!showDepositModal);
    }

    const {
        value: enteredAmount,
        isValid: enteredAmountIsValid,
        hasError: amountInputHasError,
        valueChangeHandler: amountChangeHandler,
        inputBlurHandler: amountBlurHandler,
        reset: resetAmountInput
    } = useInput(value => testFloatNumber.test(value));

    let formBalanceIsValid = false; // Checking if the form is valid
    if (enteredAmountIsValid) {
        formBalanceIsValid = true;
    }

    const {isLoading, sendRequest} = useHttpClient(); // useHttpClient hook for sending requests to the backend

    const handleBalanceAdd = async (event) => {
        event.preventDefault();
        try{
            await sendRequest(process.env.REACT_APP_BACKEND_URL+`/users/updatebalance`,
                'POST',
                JSON.stringify({
                    newBalance: parseFloat(enteredAmount),
                }),
                {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token});
            auth.refreshAccountBalance(auth.userId); // Leave for now
            notifySucces(`You have successfully added ${enteredAmount}€ to your balance!`);
        }catch (err) {
            console.log(err);
            notifyWarr(`Something went wrong!`);
        }
        auth.refreshAccountBalance(auth.userId,auth.token);
        resetAmountInput();
        setShowDepositModal(!showDepositModal);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    return(
        <>
            <Modal
                open={showDepositModal}
                onClose={handleDepositModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <div className={"flex items-center justify-center w-full"}>
                            <span className={"text-base font-bold text-4xl "}>Deposit money on Account</span>
                        </div>
                        <hr className={"my-8 bg-black"}/>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className={"p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 border-black border-[0.5px]"}>
                                <div className={"flex justify-between flex-col w-full h-full"}>
                                    <div className={"flex justify-between items-start"}>
                                        <div className={"w-10 h-10 rounded-full border-2 border-white flex justify-center items-center"}>
                                            <RiMoneyEuroCircleLine fontSize={21} color={"#fff"}/>
                                        </div>
                                        <BsInfoCircle fontSize={17} color={"#fff"}/>
                                    </div>
                                    <div>
                                        <p className={"text-white font-semibold text-lg mt-1"}>
                                            Your account balance: {auth.accountBalance}&#8364;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        <form onSubmit={handleBalanceAdd}>
                            <div className={"flex flex-col"}>
                                <div className={"flex flex-col "}>
                                    <label className={"text-base text-2xl text-black ml-2"} htmlFor={"amount-input"}>Amount to Add</label>
                                    <div className={"flex flex-row items-center"}>
                                        <input id={"amount-input"} className={` rounded-lg w-full ${amountInputHasError ? "border-2 border-red-700" : "border-2 border-blue-300"}`} min={0} type={"number"} placeholder={"Enter amount"} onChange={amountChangeHandler} onBlur={amountBlurHandler} value={enteredAmount}/>
                                        <Exclamation title={"Amount field have to be float number e.g. 200,24 and bigger than 0"} placement={"right"} hasError={amountInputHasError} className={"w-full"}/>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className={"flex flex-row"}>
                            <div className={"w-1/2 mt-6 w-full flex flex-row justify-start"}>
                                <button type={"submit"} className={"bg-blue-700 w-20 h-11 text-white rounded-md hover:bg-blue-800 w-1/2 disabled:cursor-not-allowed"} onClick={handleBalanceAdd} disabled={!formBalanceIsValid}>{isLoading ? <LoadingButton /> : "Send"}</button>
                            </div>
                            <div className={"w-1/2 flex flex-row mt-6 w-full justify-end"}>
                                <button className={"bg-red-700 w-20 h-11 text-white rounded-md hover:bg-red-800 "} onClick={handleDepositModal}>Close</button>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <div className='flex justify-between items-center h-24 mx-auto px-4 bg-black z-30 relative sticky top-0' onMouseLeave={() => {setShowDropDown(false)}}>
                <h1 className='w-full text-4xl font-bold text-[#00df9a]'><Link to={`/`}>Crypto</Link></h1>
                <ul className='hidden md:flex text-white space-x-2'>
                    {!auth.isLoggedIn && (<NavLink to={"/tools"} className={({isActive}) => isActive ? "underline underline-offset-8" : ""}><li className='p-4 text-3xl hover:bg-gray-600 rounded-md duration-300 mr-4'>Tools</li></NavLink>)}
                    {!auth.isLoggedIn && (<NavLink to={"/"} className={({isActive}) => isActive ? "underline underline-offset-8" : ""}><li className='p-4 text-3xl hover:bg-gray-600 rounded-md duration-300 mr-4'>Home</li></NavLink>)}
                    {auth.isLoggedIn && (<NavLink to={"/"} className={({isActive}) => isActive ? "underline underline-offset-8" : ""}><li className='p-4 text-3xl hover:bg-gray-600 rounded-md duration-300'>Cockpit</li></NavLink>)}
                    {auth.isLoggedIn && (<NavLink to={"/trades"} className={({isActive}) => isActive ? "transform underline underline-offset-8" : ""}><li className='p-4 text-3xl hover:bg-gray-600 rounded-md duration-300' >Trades</li></NavLink>)}
                    {auth.isLoggedIn && (
                        <>
                            <div className={"flex flex-col items-center hover:cursor-pointer"} >
                                <span className={"p-4 text-3xl hover:bg-gray-600 rounded-md duration-300"} onMouseEnter={() => setShowDropDown(!showDropDown)} >Profile</span>
                                <ul className={`${!showDropDown && "hidden"} absolute fixed mt-[75px] text-black bg-black w-[250px] text-center ease-in-out duration-500 p-2`} onMouseLeave={() => {setShowDropDown(!showDropDown)}}>
                                    <div className={"flex flex-col items-center justify-center my-2"}>
                                        <span className={"text-white"}>Loged in as</span>
                                        <span className={"text-white my-4 text-base text-xl flex flex-row"}><UserIcon className={"h-8 w-8 text-white mr-2"}/> {auth.email}</span>
                                        <span className={"text-white my-4 text-xl flex flex-row"}><CreditCardIcon className={"h-8 w-8 text-white mr-2"}/>Balance: {auth.accountBalance}&#8364;</span>
                                    </div>
                                    {auth.isLoggedIn && (<NavLink to={"/myprofile"} className={({isActive}) => isActive ? "text-white transform underline underline-offset-8" : ""}> <li className={"text-white py-2 hover:hover:bg-gray-600 hover:rounded-md duration-300"}>My profile</li> </NavLink>)}
                                    <li className={"text-white py-2 hover:hover:bg-gray-600 hover:rounded-md duration-300"} onClick={() => setShowDepositModal(!showDepositModal)}>Deposit Money</li>
                                </ul>
                            </div>
                        </>
                    )}
                    {!auth.isLoggedIn && (<NavLink to={"/auth"} className={({isActive}) => isActive ? "underline underline-offset-8" : ""}><button className={"w-32 text-3xl bg-sky-600 hover:bg-sky-700 rounded-full p-4 duration-300"}>Login</button></NavLink>)}
                    {auth.isLoggedIn && (<NavLink to={"/redirect"}><button className={"w-32 text-3xl bg-sky-600 hover:bg-sky-700 rounded-full p-4 duration-300"} onClick={auth.logout}>Logout</button></NavLink>
                    )}
                </ul>
                <div onClick={handleNav} className='block md:hidden lg:hidden'>
                    {nav ? <XIcon className={"h-5 w-5 text-white"} /> : <MenuIcon className={"h-5 w-5 text-white"}  />}
                </div>
                {nav && <Backdrop onClick={handleNav} />}
                <ul className={nav ? 'fixed left-0 top-0 w-[40%] h-full border-r text-white bg-black text-white border-r-gray-900 ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%] z-10'}>
                    <h1 className='w-full text-4xl font-bold text-[#00df9a] m-4 ' onClick={handleNav}><Link to={`/`}>Crypto</Link></h1>
                    {auth.isLoggedIn && (<div className={"flex flex-col items-center justify-center my-2"}>
                        <span className={"text-white"}>Loged in as</span>
                        <span className={"text-white my-4 text-base text-xl flex flex-row"}><UserIcon className={"h-8 w-8 text-white mr-2"}/> {auth.email}</span>
                        <span className={"text-white my-4 text-xl flex flex-row"}><CreditCardIcon className={"h-8 w-8 text-white mr-2"}/>Balance: {auth.accountBalance}&#8364;</span>
                    </div>)}
                    {auth.isLoggedIn && (<NavLink to={"/"} className={({isActive}) => isActive ? "underline underline-offset-8" : ""}><li className='p-4 hover:bg-gray-600 duration-300 w-full rounded-md text-center'>Cockpit</li></NavLink>)}
                    {auth.isLoggedIn && (<NavLink to={"/trades"} className={({isActive}) => isActive ? "transform underline underline-offset-8" : ""}><li className='p-4 hover:bg-gray-600 duration-300 w-full rounded-md text-center'>Trades</li></NavLink>)}
                    {auth.isLoggedIn && (<NavLink to={"/myprofile"} className={({isActive}) => isActive ? "transform underline underline-offset-8" : ""}> <li className={"p-4 hover:bg-gray-600 duration-300 w-full rounded-md text-center"}>My profile</li> </NavLink>)}
                    {auth.isLoggedIn && (<li className={"p-4 hover:bg-gray-600 duration-300 w-full rounded-md text-center hover:cursor-pointer"} onClick={() => setShowDepositModal(!showDepositModal)}>Deposit Money</li>)}
                    {!auth.isLoggedIn && (<NavLink to={"/"} className={({isActive}) => isActive ? "underline underline-offset-8" : ""}><li className='p-4 hover:bg-gray-600 duration-300 w-full rounded-md'>Home</li></NavLink>)}
                    {!auth.isLoggedIn && (<button className={"p-4 bg-sky-600 hover:bg-sky-700 duration-300 w-full rounded-md "} onClick={handleNav}><Link to={"/auth"}>Login</Link></button>)}
                    {auth.isLoggedIn && (<button className={"p-4 bg-sky-600 hover:bg-sky-700 duration-300 w-full rounded-md "} onClick={auth.logout}><Link to={"/redirect"}>Logout</Link></button>)}
                </ul>
            </div>
            <ToastNotify />
        </>
    );
};


export default Navbar;