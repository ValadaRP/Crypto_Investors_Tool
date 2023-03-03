import React, {useContext,useState} from "react";
import {AuthContext} from "../../context/auth-context";
import {BsInfoCircle, RiMoneyEuroCircleLine} from "react-icons/all";
import {Box, Modal, Typography} from "@mui/material";
import useInput from "../../hooks/use-input";
import {validPassword} from "../../validation/RegexFunctions";
import LoadingButton from "../../shared/UIElements/LoadingButton";
import Exclamation from "../../shared/UIElements/Exclamation";
import {useHttpClient} from "../../hooks/http-hook";
import {notifySucces} from "../../toastFunctions/toastFun";
import {useNavigate} from "react-router-dom";

const MyProfile = () => {

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const auth = useContext(AuthContext);
    const euro = String.fromCharCode(8364);

    const checkIfEarned = auth.earnings < auth.spending ? "bg-red-700" : "bg-green-700";

    const {isLoading, sendRequest} = useHttpClient(); // useHttpClient hook for sending requests to the backend
    const navigate = useNavigate();

    const {
        value: enteredNewPassword,
        isValid: enteredNewPasswordIsValid,
        hasError: enteredNewPasswordHasError,
        valueChangeHandler: enteredNewPasswordChangeHandler,
        inputBlurHandler: enteredNewPasswordBlurHandler,
        reset: resetNewPassword
    } = useInput(value => validPassword.test(value));

    const {
        value: enteredConfirmPassword,
        isValid: enteredConfirmPasswordIsValid,
        hasError: enteredConfirmPasswordHasError,
        valueChangeHandler: enteredConfirmPasswordChangeHandler,
        inputBlurHandler: enteredConfirmPasswordBlurHandler,
        reset: resetConfirmPassword
    } = useInput(value => value === enteredNewPassword);

    const handlePasswordModal = () => {
        resetNewPassword();
        resetConfirmPassword();
        setShowPasswordModal(!showPasswordModal);
    }

    let formBalanceIsValid = false; // Checking if the form is valid
    if (enteredNewPasswordIsValid && enteredConfirmPasswordIsValid) {
        formBalanceIsValid = true;
    }

    const handleChangePassword = async (event) => {
        event.preventDefault();
        try{
            const dataForm = {
                email: auth.email,
                newpassword: enteredNewPassword,
            };
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL+'/users/update',
                'POST',
                JSON.stringify(dataForm),
                {
                    'Content-Type': 'application/json'
                }
            );
            console.log(responseData);
            notifySucces("Password changed successfully! 👍");
            auth.logout();
            navigate('/auth');
        }catch (err) {
            console.log(err);
        }

        resetNewPassword();
        resetConfirmPassword();
        setShowPasswordModal(!showPasswordModal);
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
                open={showPasswordModal}
                onClose={handlePasswordModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <div className={"flex items-center justify-center w-full"}>
                            <span className={"text-base font-bold text-4xl "}>Change Password</span>
                        </div>
                        <hr className={"my-8 bg-black"}/>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={handleChangePassword}>
                            <div className={"flex flex-col"}>
                                <div className={"flex flex-col "}>
                                    <label className={"text-base text-2xl text-black ml-2"} htmlFor={"newPassword"}>New Password:</label>
                                    <div className={"flex flex-row items-center"}>
                                        <input id={"newPassword"} className={` rounded-lg w-full ${enteredNewPasswordHasError ? "border-2 border-red-700" : "border-2 border-blue-300"}`} type={"password"} placeholder={"Enter new password"} onChange={enteredNewPasswordChangeHandler} onBlur={enteredNewPasswordBlurHandler} value={enteredNewPassword}/>
                                        <Exclamation title={"Password have to contain 6 digits and one have to be number"} placement={"right"} hasError={enteredNewPasswordHasError} className={"w-full"}/>
                                    </div>
                                </div>
                                <div className={"flex flex-col "}>
                                    <label className={"text-base text-2xl text-black ml-2"} htmlFor={"repeatPassword"}>Repeat Password:</label>
                                    <div className={"flex flex-row items-center"}>
                                        <input id={"repeatPassword"} className={` rounded-lg w-full ${enteredConfirmPasswordHasError ? "border-2 border-red-700" : "border-2 border-blue-300"}`} type={"password"} placeholder={"Enter new password"} onChange={enteredConfirmPasswordChangeHandler} onBlur={enteredConfirmPasswordBlurHandler} value={enteredConfirmPassword}/>
                                        <Exclamation title={"Password have to contain 6 digits and one have to be number"} placement={"right"} hasError={enteredConfirmPasswordHasError} className={"w-full"}/>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className={"flex flex-row"}>
                            <div className={"w-1/2 mt-6 w-full flex flex-row justify-start"}>
                                <button type={"submit"} className={"bg-blue-700 w-20 h-11 text-white rounded-md hover:bg-blue-800 w-1/2 disabled:cursor-not-allowed"} onClick={handleChangePassword} disabled={!formBalanceIsValid}>{isLoading ? <LoadingButton /> : "Send"}</button>
                            </div>
                            <div className={"w-1/2 flex flex-row mt-6 w-full justify-end"}>
                                <button className={"bg-red-700 w-20 h-11 text-white rounded-md hover:bg-red-800 "} onClick={handlePasswordModal}>Close</button>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
            <div className={"flex flex-col w-[90%] bg-white mx-auto rounded-xl shadow-xl min-h-screen"}>
                <div className={"flex flex-row w-full"}>
                    <div className={"w-1/2"}>
                        <p className={"text-4xl font-bold m-8 w-1/2"}>{auth.name}</p>
                        <p className={"text-4xl font-bold m-8 w-1/2"}>{auth.email}</p>
                    </div>
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
                </div>
                <div className={"flex flex-row w-[90%] h-48 mt-8 border-[0.5px] border-black mx-auto shadow-xl "}>
                    <div className={`flex flex-col w-1/2 border-r-[0.5px] border-black items-center justify-center ${checkIfEarned} gap-y-8`}>
                        <h1 className={" text-4xl font-bold"}>Earnings</h1>
                        <span className={"text-4xl font-bold"}>{auth.earnings}{euro}</span>
                    </div>
                    <div className={`flex flex-col w-1/2 items-center justify-center ${checkIfEarned} gap-y-8`}>
                        <h1 className={" text-4xl font-bold"}>Spending</h1>
                        <span className={"text-4xl font-bold"}>{auth.spending}{euro}</span>
                    </div>
                </div>
                <div className={"flex flex-row w-full mt-20 p-4"}>
                    <div className={"flex justify-center w-1/2"}>
                        <button className={"bg-blue-700 w-20 h-11 text-white rounded-md hover:bg-blue-800 w-1/2"} onClick={handlePasswordModal}>Change Password</button>
                    </div>
                    {/*<div className={"flex justify-center w-1/2"}>*/}
                    {/*    <button className={"bg-red-700 w-20 h-11 text-white rounded-md hover:bg-blue-800 w-1/2"}>Change Name</button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}

export default MyProfile;