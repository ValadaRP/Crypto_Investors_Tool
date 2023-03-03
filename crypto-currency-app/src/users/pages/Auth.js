import React, {useContext, useState} from "react";
import {useHttpClient} from "../../hooks/http-hook";
import useInput from "../../hooks/use-input";
import {AuthContext} from "../../context/auth-context";
import LoadingButton from "../../shared/UIElements/LoadingButton";
import {validEmail, validPassword, validName} from "../../validation/RegexFunctions";
import {Box, Modal, Typography} from "@mui/material";
import Exclamation from "../../shared/UIElements/Exclamation";
import { useNavigate } from "react-router-dom";
import ToastNotify from "../../shared/UIElements/ToastNotify";
import {toast} from "react-toastify";


const Auth = () => {
    const navigate = useNavigate(); // navigate is a hook that allows us to navigate to a different page
    const auth = useContext(AuthContext); //Object that contain token/userId/login/logout
    const { value: enteredEmail,
        isValid: enteredEmailIsValid,
        hasError: emailInputHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailInputBlurHandler, reset: emailResetInput} = useInput(value => validEmail.test(value)); // useInput hook for validating an form

    const { value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: passwordInputHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordInputBlurHandler, reset: passwordResetInput} = useInput(value => validPassword.test(value)); // useInput hook for validating a pasword

    const { value: enteredName,
        isValid: enteredNameIsValid,
        hasError: nameInputHasError,
        valueChangeHandler: enteredNameChangeHandler,
        inputBlurHandler: nameInputBlurHandler, reset: nameResetInput} = useInput(value => validName.test(value)); // useInput hook for validating a pasword

    const { value: enteredPasswordRepeat,
        isValid: enteredPasswordRepeatIsValid,
        hasError: passwordRepeatInputHasError,
        valueChangeHandler: enteredPasswordRepeatChangeHandler,
        inputBlurHandler: passwordRepeatInputBlurHandler, reset: passRepeatResetInput} = useInput(value => value.trim() === enteredPassword.trim()); // useInput hook for validating a pasword

    const {isLoading, sendRequest, error, clearError, errorBol} = useHttpClient(); // useHttpClient hook for sending requests to the backend

    // Turning on submit button
    let logInForm = false;
    let signInForm = false;
    if (enteredEmailIsValid && enteredPasswordIsValid) {
        logInForm = true;
    }
    if (enteredNameIsValid && enteredPasswordRepeatIsValid && enteredPasswordIsValid && enteredEmailIsValid) {
        signInForm = true;
    }

    const [isLoginMode, setLoginMode] = useState(true);  // Button for switching between login and register
    const [open, setOpen] = useState(false); // Modal for showing user data reset password



    const handleLoginMode = () => {
        emailResetInput(); // Reset function from useInput hook
        passwordResetInput(); // Reset function from useInput hook
        nameResetInput(); // Reset function from useInput hook
        passRepeatResetInput(); // Reset function from useInput hook
        setLoginMode(!isLoginMode);
    }

    const handleModalReset = () => {
        emailResetInput(); // Reset function from useInput hook
        passwordResetInput(); // Reset function from useInput hook
        passRepeatResetInput(); // Reset function from useInput hook
        setOpen(!open);
    }

    const handleSubmitForm = async (event) => {
        event.preventDefault();
        if (isLoginMode) {
            console.log("Logowanie");
            try{
             const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/users/login`,
                 'POST',
                 JSON.stringify({
                        email: enteredEmail,
                        password: enteredPassword
                 }),
                 {'Content-Type': 'application/json'});
                 auth.login(responseData.userId,responseData.email, responseData.balance, responseData.name,
                     responseData.earnings, responseData.spending ,responseData.token);
                 navigate("/redirect");
            }catch (err) {
                console.log(err);
                console.log(error);
            }
        }else {
            try{
                const dataForm = {
                    name: enteredName,
                    email: enteredEmail,
                    password: enteredPassword,
                };
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+'/users/signup',
                    'POST',
                    JSON.stringify(dataForm),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId,responseData.email, responseData.balance, responseData.name,
                    responseData.earnings, responseData.spending ,responseData.token);
                console.log(responseData);
                navigate("/redirect");
            }catch (err) {
                console.log(err);
            }
        }
        emailResetInput(); // Reset function from useInput hook
        passwordResetInput(); // Reset function from useInput hook
        nameResetInput(); // Reset function from useInput hook
        passRepeatResetInput(); // Reset function from useInput hook
    }

    const handleSubmitReset = async (event) => {
        event.preventDefault();
        try{
            const dataForm = {
                email: enteredEmail,
                newpassword: enteredPassword,
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
        }catch (err) {
            console.log(err);
        }

        emailResetInput(); // Reset function from useInput hook
        passwordResetInput(); // Reset function from useInput hook
        passRepeatResetInput(); // Reset function from useInput hook

        setOpen(!open);
    }


    // const classes for styling inputs
    const emailInputClasses = emailInputHasError ? 'border-red-500 border-2' : 'border-2 border-black';
    const nameInputClasses = nameInputHasError ? 'border-red-500 border-2' : 'border-2 border-black';
    const passwordInputClasses = passwordInputHasError ? 'border-red-500 border-2' : 'border-2 border-black';
    const repeatPasswordInputClasses = passwordRepeatInputHasError ? 'border-red-500 border-2' : 'border-2 border-black';

    const notify = () => toast.success("Succesfully loged in", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 6,
        textAlign: 'center',
    };
    const styleResetPassword = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 6,
        textAlign: 'center',
        height: 500,
    };

    return(
        <>
        <Modal
            open={errorBol}
            onClose={clearError}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <p className={"uppercase text-red-700"}>An Error Occurred</p>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <p>{error}</p>
                    <div className={"flex flex-row items-start mt-6"}>
                        <button className={"bg-red-700 w-20 h-11 text-white rounded-md hover:bg-red-800 "} onClick={clearError}>Close</button>
                    </div>
                </Typography>
            </Box>
        </Modal>
        <Modal
            open={open}
            onClose={handleModalReset}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleResetPassword}>
                <div className={"flex flex-col items-center justify-center"}>
                    <form className={"flex flex-col items-center justify-center"} onSubmit={handleSubmitReset}>
                        <h1 className={"text-4xl font-bold p-4"}>Reset your password</h1>
                        <hr className={"border-gray-500 w-full"}/>
                        <div className={"mt-8 flex flex-col items-baseline "}>
                            <label className={"text-2xl font-bold "}>Email</label>
                            <div className={"flex flex-row items-center"}>
                                <input type={"text"} className={` ${emailInputClasses} transform transition-all focus:scale-105`} onChange={emailChangeHandler} onBlur={emailInputBlurHandler} value={enteredEmail}/>
                                <Exclamation title={"Email have to contain @ and ."} placement={"right"} hasError={emailInputHasError}/>
                            </div>
                            <div className={"flex flex-col items-baseline"}>
                                <label className={"text-2xl font-bold "}>New Password</label>
                                <div className={"flex flex-row items-center"}>
                                    <input type={"password"} className={` ${passwordInputClasses} transform transition-all focus:scale-105`} onChange={passwordChangeHandler} onBlur={passwordInputBlurHandler} value={enteredPassword}/>
                                    <Exclamation title={"Password have to contain 6 digits and one have to be number"} placement={"right"} hasError={passwordInputHasError}/>
                                </div>
                            </div>
                            <div className={"flex flex-col items-baseline"}>
                                <label className={"text-2xl font-bold "}>Repeat password</label>
                                <div className={"flex flex-row items-center"}>
                                    <input type={"password"} className={` ${repeatPasswordInputClasses} transform transition-all focus:scale-105`} onChange={enteredPasswordRepeatChangeHandler} onBlur={passwordRepeatInputBlurHandler} value={enteredPasswordRepeat}/>
                                    <Exclamation title={"Passwords have to be the same"} placement={"right"} hasError={passwordRepeatInputHasError}/>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-row items-center justify-center mt-5"}>
                            <button type={"submit"} className={"bg-blue-700 w-20 h-11 text-white rounded-md hover:bg-blue-800 mr-4 w-40"} disabled={isLoading}>
                                {isLoading ? <LoadingButton/> : 'Reset password'}
                            </button>
                            <button className={"bg-red-700 w-20 h-11 text-white rounded-md hover:bg-red-800 "} onClick={handleModalReset}>Close</button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>

        <div className={"flex flex-col md:w-1/2 ms:w-full mx-auto bg-white p-8  drop-shadow-2xl min-h-[800px] rounded-md shadow-xl"}>
            {isLoginMode && <form className={"flex flex-col items-center "} onSubmit={handleSubmitForm}>
                <h1 className={"text-4xl font-bold p-4"}>Log in</h1>
                <hr className={"border-gray-500 w-3/4"}/>
                <div className={"mt-16 flex flex-col items-baseline mb-4"}>
                    <label className={"text-2xl font-bold "}>Email</label>
                    <div className={"flex flex-row items-center"}>
                        <input type={"email"} className={`${emailInputClasses} transform transition-all focus:scale-105`} onChange={emailChangeHandler}  onBlur={emailInputBlurHandler} value={enteredEmail}/>
                        <Exclamation title={"Email have to contain @ and ."} placement={"right"} hasError={emailInputHasError}/>
                    </div>
                </div>
                <div className={"flex flex-col items-baseline"}>
                    <label className={"text-2xl font-bold  "}>Password</label>
                    <div className={"flex flex-row items-center"}>
                        <input type={"password"} className={` ${passwordInputClasses} transform transition-all focus:scale-105`} onChange={passwordChangeHandler} onBlur={passwordInputBlurHandler} value={enteredPassword}/>
                        <Exclamation title={"Password have to contain 6 digits and one have to be number"} placement={"right"} hasError={passwordInputHasError}/>
                    </div>
                </div>
                <button type={"submit"} className={"text-white p-4 bg-indigo-500 hover:bg-red-700 rounded-full mt-12 w-48 disabled:cursor-not-allowed"} disabled={!logInForm || isLoading}>
                    {isLoading ? <LoadingButton/> : 'Log in'}
                </button>
            </form>}
            {!isLoginMode && <form className={"flex flex-col items-center"} onSubmit={handleSubmitForm}>
                <h1 className={"text-4xl font-bold p-4"}>Sign up</h1>
                <hr className={"border-gray-500 w-3/4"}/>
                <div className={"mt-16 flex flex-col items-baseline "}>
                    <label className={"text-2xl font-bold "}>Name</label>
                    <div className={"flex flex-row items-center"}>
                        <input type={"text"} className={` ${nameInputClasses} transform transition-all focus:scale-105`} onChange={enteredNameChangeHandler} onBlur={nameInputBlurHandler} value={enteredName}/>
                        <Exclamation title={"This field can't be empty"} placement={"right"} hasError={nameInputHasError}/>
                    </div>
                </div>
                <div className={" flex flex-col items-baseline "}>
                    <label className={"text-2xl font-bold "}>Email</label>
                    <div className={"flex flex-row items-center"}>
                        <input type={"email"}  className={` ${emailInputClasses} transform transition-all focus:scale-105`} onChange={emailChangeHandler} onBlur={emailInputBlurHandler} value={enteredEmail}/>
                        <Exclamation title={"Email have to contain @ and ."} placement={"right"} hasError={emailInputHasError}/>
                    </div>
                </div>
                <div className={"flex flex-col items-baseline"}>
                    <label className={"text-2xl font-bold "}>Password</label>
                    <div className={"flex flex-row items-center"}>
                        <input type={"password"} className={` ${passwordInputClasses} transform transition-all focus:scale-105`} onChange={passwordChangeHandler} onBlur={passwordInputBlurHandler} value={enteredPassword}/>
                        <Exclamation title={"Password have to contain 6 digits and one have to be number"} placement={"right"} hasError={passwordInputHasError}/>
                    </div>
                </div>
                <div className={"flex flex-col items-baseline"}>
                    <label className={"text-2xl font-bold "}>Repeat password</label>
                    <div className={"flex flex-row items-center"}>
                        <input type={"password"} className={` ${repeatPasswordInputClasses} transform transition-all focus:scale-105`} onChange={enteredPasswordRepeatChangeHandler} onBlur={passwordRepeatInputBlurHandler} value={enteredPasswordRepeat}/>
                        <Exclamation title={"Passwords have to be the same"} placement={"right"} hasError={passwordRepeatInputHasError}/>
                    </div>
                </div>
                <button type={"submit"} className={"text-white p-4 bg-red-600 hover:bg-red-700 rounded-full mt-12 w-48 disabled:cursor-not-allowed"} disabled={!signInForm || isLoading}>
                    {isLoading ? <LoadingButton/> : 'Sign up'}
                </button>
            </form>}
            <div className={"flex md:flex-row sm:flex-col w-full sm:gap-y-4 "}>
                <div className={"flex md:items-start md:justify-start w-1/2 "}>
                    <button className={"md:mt-20 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ring "} onClick={handleLoginMode}>{isLoginMode ? 'Switch to Sign in':'Switch to Log in'}</button>
                </div>
                <div className={"flex md:items-end md:justify-end w-1/2 "}>
                    <button className={"md:mt-20 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ring "} onClick={handleModalReset}>Forget password</button>
                </div>
            </div>
        </div>
        </>
    );

}

export default Auth;