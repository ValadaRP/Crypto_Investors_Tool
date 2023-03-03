import React, {useEffect, useState, createContext} from "react";
import {ethers} from "ethers";

import  {contractABI,contractAddress} from "../utils/constants";
import {notifyAnswer, notifySucces, notifyWarr} from "../toastFunctions/toastFun";

export const TransactionContext = createContext();

const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress,contractABI,signer);

    return transactionsContract;
}

export const TransactionsProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);




    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
        // console.log(formData);
    };

    const getAllTransactions = async () => {
        try {
            if (!ethereum) {
                notifyAnswer("Please install MetaMask", "error");
                return;
            }
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.reciever,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
            setTransactions(structuredTransactions);
        }catch (e) {
            console.log(e);
        }
    }


    const checkIfWalletIsConnected = async () => {
        if (!ethereum) return notifyAnswer("Please install MetaMask first", "error");

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if(accounts.length){
            setCurrentAccount(accounts[0]);

            getAllTransactions();
        }else {
            console.log("No authorized account found");
            notifyWarr("No authorized account found");
        }

        // console.log(accounts);
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount",transactionCount);
        }catch (err) {
            console.log(err);
            throw new Error("No ethereum object found");
        }

    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return notifyAnswer("Please install MetaMask first");
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
            window.location.reload();
            notifySucces("Wallet connected");
            // console.log("Connected", accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No account found");
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return notifyAnswer("Please install MetaMask first");
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5280', //2100 GWEI
                    value: parsedAmount._hex, // 0.00001 ETH
                }],
            });
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash}`);
            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            window.location.reload();
            notifySucces("Transaction sent");
        }catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    },[transactionCount]);

    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData,handleChange, sendTransaction,isLoading, transactions }}>
            {children}
        </TransactionContext.Provider>
    );
}