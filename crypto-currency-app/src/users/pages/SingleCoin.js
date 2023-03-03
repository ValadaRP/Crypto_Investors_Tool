import React, {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {ClockLoader} from "react-spinners";
import HistoricalChart from "../../shared/UIElements/HistoricalChart";
import Image from "../../shared/UIElements/Image";
import CoinInfo from "../../shared/UIElements/CoinInfo";
import Numeral from "react-numeral";
import {Box, Modal, Typography} from "@mui/material";
import Exclamation from "../../shared/UIElements/Exclamation";
import LoadingButton from "../../shared/UIElements/LoadingButton";
import {AuthContext} from "../../context/auth-context";
import useInput from "../../hooks/use-input";
import {testFloatNumber} from "../../validation/RegexFunctions";
import {notifySucces, notifyWarr} from "../../toastFunctions/toastFun";
import {useHttpClient} from "../../hooks/http-hook";
import {BsInfoCircle, RiMoneyEuroCircleLine} from "react-icons/all";
import TransactionHistory from "../../shared/UIElements/TransactionHistory";

const SingleCoin = () => {

    const {id} = useParams();
    const [coin, setCoin] = useState(null);
    const [isLoadingAxios, setIsLoadingAxios] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [transactions, setTransactions] = useState([]);


    const navigate = useNavigate(); // useNavigate is a hook that allows us to navigate to a different page
    const location = useLocation(); // useLocation is a hook that allows us to get the current location
    const [currentUrl, setCurrentUrl] = useState();



    const auth = useContext(AuthContext);


    const {isLoading, sendRequest} = useHttpClient(); // useHttpClient hook for sending requests to the backend
    const {
        value: enteredQuantity,
        isValid: enteredQuantityIsValid,
        hasError: enteredQuantityHasError,
        valueChangeHandler: enteredQuantityChangeHandler,
        inputBlurHandler: enteredQuantityBlurHandler,
        reset: resetEnteredQuantity
    } = useInput(value => testFloatNumber.test(value) && value.toString().length <= 7 );

    let formBalanceIsValid = false; // Checking if the form is valid
    if (enteredQuantityIsValid) {
        formBalanceIsValid = true;
    }

    const stripHtml = (html) => { // function for removing html tags from the description
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    const fetchTransactions = async () => {
        try{
            const {transactions} = await sendRequest(process.env.REACT_APP_BACKEND_URL+`/transaction/getTransactions/${auth.userId}`, "GET", null, {
                "Content-Type": "application/json",
            });
            setTransactions(transactions);
        }catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleBuyModal = () => { // function for showing the buy modal
        resetEnteredQuantity();
        setShowBuyModal(!showBuyModal);
    }

    const fetchCoin = async () => { // function for fetching the coin data
        setIsLoadingAxios(true);
        const {data} = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(data);
        setIsLoadingAxios(false);
    }

    useEffect(() => {
        fetchCoin();
    },[currentUrl]);

    const style = { // style for the buy modal
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

    const handleBuyCoin = async (event) => { // function for buying a coin
        event.preventDefault();
        try{
            await sendRequest(process.env.REACT_APP_BACKEND_URL+`/transaction/buy`,
                'POST',
                JSON.stringify({
                    coinId: coin.id,
                    name: coin.name,
                    image: coin.image.large,
                    quantity: parseFloat(enteredQuantity),
                    price: parseFloat(parseFloat(coin.market_data.current_price.eur).toFixed(4)),
                }),
                {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token});
            auth.refreshAccountBalance(auth.userId); // Leave for now
            await fetchTransactions();
            notifySucces(`You have successfully bought a ${coin?.name} for ${parseFloat(parseFloat(
                enteredQuantity*coin.market_data.current_price.eur).toFixed(4))}€ ! 👍`);
        }catch (err) {
            console.log(err);
            notifyWarr("Something went wrong, maybe not enough money or try again later! 😥");
        }
        auth.refreshAccountBalance(auth.userId,auth.token);
        resetEnteredQuantity();
        handleBuyModal();
    }

    const handleSellCoin = async (event, transactionId) => { // function for selling a coin
        event.preventDefault();
        try{
            await sendRequest(process.env.REACT_APP_BACKEND_URL+`/transaction/sell`,
                'POST',
                JSON.stringify({
                    transactionId: transactionId,
                }),
                {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token});
            auth.refreshAccountBalance(auth.userId); // Leave for now
            await fetchTransactions();
            const findTransaction = transactions.find(transaction => transaction.id === transactionId);
            const filteredTransaction = transactions.filter(transaction => transaction.id !== transactionId);
            setTransactions(filteredTransaction);
            notifySucces(`You have successfully sold a ${coin?.name} for ${(findTransaction?.quantity * 
                coin?.market_data.current_price.eur.toFixed(6))}€ ! 👍`);
        }catch (err) {
            console.log(err);
            notifyWarr("Something went wrong, maybe not enough money or try again later! 😥");
        }
    }

    const handleNavigate = (coinId = "") => {
        if (coinId === coin?.id) {
            return notifyWarr(`You are already on ${coinId} page 😿`);
        }
        setCurrentUrl(`/coins/${coinId}`);
        navigate(`/coins/${coinId}`); // navigate to the coin page
    }

    return(
        <div>
            {isLoadingAxios ?
                <div className={"flex flex-col items-center h-64 p-20"}><ClockLoader color={"#5a4da8"} size={60}/>
                </div> :
                <>
                    <Modal
                        open={showBuyModal}
                        onClose={handleBuyModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className={"flex flex-col"}>
                                <span className={"text-base bold text-4xl text-center w-full font-bold text-base"}>Fill the inputs to buy a coin</span>
                                <hr className={"my-8 bg-black"}/>
                                <div className={"flex md:flex-row sm:flex-col w-full sm:items-center"}>
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
                                    <div className={"w-1/2 flex flex-col items-center justify-center "}>
                                        <p className={"font-bold text-base text-2xl text-center "}>Current price of {coin?.name} </p>
                                        <p className={"font-bold text-base text-4xl text-center"}>{coin?.market_data.current_price.eur.toFixed(6)}&#8364;</p>
                                        <p className={"font-bold text-base text-2xl text-center mt-5"}>Price to pay</p>
                                        <p className={"font-bold text-base text-4xl text-center"}>{parseFloat(coin?.market_data.current_price.eur * enteredQuantity).toFixed(6)}&#8364;</p>
                                    </div>
                                </div>
                            </div>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <form onSubmit={handleBuyCoin}>
                                    <div className={"flex flex-col"}>
                                        <div className={"flex flex-col "}>
                                            <label className={"text-base text-2xl text-black ml-2 mb-2"} htmlFor={"quantity-input"}>Quantity</label>
                                            <div className={"flex flex-row items-center"}>
                                                <input id={"quantity-input"} className={` rounded-lg w-full ${enteredQuantityHasError ? "border-2 border-red-700" : "border-2 border-blue-300"}`} step={"0.0001"} min={0} type={"number"} placeholder={"Enter quantity"} onChange={enteredQuantityChangeHandler} onBlur={enteredQuantityBlurHandler} value={enteredQuantity}/>
                                                <Exclamation title={"Quantity field has to be bigger than 0 and max quantity can be 9999999 "} hasError={enteredQuantityHasError} placement={"right"}  className={"w-full"}/>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className={"flex flex-row"}>
                                    <div className={"w-1/2 mt-6 w-full flex flex-row justify-start"}>
                                        <button type={"submit"} className={"bg-blue-700 w-20 h-11 text-white rounded-md hover:bg-blue-800 w-1/2 disabled:cursor-not-allowed"} disabled={!formBalanceIsValid} onClick={handleBuyCoin}>{isLoading ? <LoadingButton /> : "Buy"}</button>
                                    </div>
                                    <div className={"w-1/2 flex flex-row mt-6 w-full justify-end"}>
                                        <button className={"bg-red-700 w-20 h-11 text-white rounded-md hover:bg-red-800 "} onClick={handleBuyModal}>Close</button>
                                    </div>
                                </div>
                            </Typography>
                        </Box>
                    </Modal>
                    <div className={"mx-auto w-[97%] flex md:flex-row sm:flex-col sm:items-center min-h-[150px] bg-white rounded-xl shadow-xl"}>
                        <div className={"md:w-1/4 sm:w-full flex flex-col items-center my-3 sm:text-center sm:p-2"}>
                            <span className={"text-4xl font-bold"}>Current price</span>
                            <span className={"text-4xl font-bold mt-5 "}>{coin?.market_data.current_price.eur}&#8364;</span>
                        </div>
                        <div className={"md:w-1/4 sm:w-full flex flex-col items-center my-3 sm:text-center sm:p-2"}>
                            <span className={"text-4xl font-bold"}>Current Market Cap</span>
                            <span className={"text-4xl font-bold mt-5 "}>{<Numeral value={coin?.market_data.market_cap.eur} format={"0.0a"}/>}&#8364;</span>
                        </div>
                        <div className={"md:w-1/4 sm:w-full flex flex-col items-center my-3 sm:text-center sm:p-2"}>
                            <span className={"text-4xl font-bold"}>Total Volume</span>
                            <span className={"text-4xl font-bold mt-5 "}>{<Numeral value={coin?.market_data.total_volume.eur} format={"0.0a"}/>}&#8364;</span>
                        </div>
                        <div className={"md:w-1/4 sm:w-full flex flex-col items-center my-3 sm:text-center sm:p-4"}>
                            <button className={"text-4xl font-bold border border-black md:p-10 sm:p-6 bg-purple-600 hover:bg-purple-700 duration-500 rounded-xl transform transition-all hover:scale-105"} onClick={handleBuyModal}>Buy {coin?.name}</button>
                        </div>
                    </div>
                    <div className={"flex sm:flex-col md:flex-row items-center mt-6 bg-white shadow-2xl"}>
                        <div className={"w-1/4 flex justify-center"}>
                            <Image src={coin?.image.large} alt={coin?.name}/>
                        </div>
                        <div className={"w-full sm:p-6 "} >
                            <h1 className={"font-medium leading-tight text-5xl pt-6 text-center"}>Short description of {coin?.name}</h1>
                            <p className={"p-6 font-light text-base text-xl "}>{stripHtml(coin?.description.en)}</p>
                        </div>
                    </div>
                    <HistoricalChart coin={coin} styles={"sm:w-full md:w-full mx-auto "}/>
                    <CoinInfo coin={coin}/>
                    <TransactionHistory transactions={transactions} coin={coin} handleSellCoin={handleSellCoin} handleNavigate={handleNavigate}/>
                </>
            }
        </div>
    );
}

export default SingleCoin;