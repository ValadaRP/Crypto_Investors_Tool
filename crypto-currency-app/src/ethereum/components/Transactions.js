import React, {useContext} from "react";

import {TransactionContext} from "../../context/transaction-context";
import History from "../../shared/UIElements/History";
import FavoriteNavigation from "../../shared/UIElements/FavoriteNavigation";


const TransactionCard = ({addressTo, addressFrom, timestamp, message, amount }) => {
    const {currentAccount} = useContext(TransactionContext);
    return (
        <div className={"bg-[#181918] m-4 flex flex-1 flex-col p-6 rounded-md hover:shadow-2xl "}>
            <div className={"flex flex-col items-center w-full "}>
                <div className={"flex justify-start w-full mb-6 p-2 flex-col"}>
                    <div className={"flex justify-center items-center mb-2"}>
                        <p className={"text-white text-base text-3xl"}>Transaction</p>
                    </div>
                    <div className={"bg-black p-3 px-5 w-max rounded-3xl shadow-2xl mb-5"}>
                        <p className={"text-[#37c7da] font-bold text-center"}>{timestamp}</p>
                    </div>
                        <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target={"_blank"} rel={"noopener norefferrer"}>
                            <p className={"text-base text-white text-lg hover:underline"}>From: {addressFrom.slice(0, 5) + "..." + addressFrom.slice(-4)}</p>
                        </a>
                        <a href={`https://goerli.etherscan.io/address/${addressTo}`} target={"_blank"} rel={"noopener norefferrer"}>
                            <p className={"text-base text-white text-lg hover:underline"}>To: {addressTo.slice(0, 5) + "..." + addressTo.slice(-4)}</p>
                        </a>
                        <p className={"text-white text-base text-lg"}>Amount: {amount} ETH</p>
                    {message && (
                        <>
                                <p className={"text-white text-base text-lg"}>Message: {message}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}


const Transactions = () => {

    const {currentAccount, transactions} = useContext(TransactionContext);
    return(
        <>
            <div className={"flex w-full  justify-center items-center bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600"}>
                <div className={"flex flex-col md:p-12 py-12 px-4"}>
                    {currentAccount ? (
                        <h3 className={"text-[5rem] text-center"}>Transactions History</h3>
                    ) : (
                        <h3 className={"text-[5rem] text-center"}>Connect your account to see the latest transactions</h3>
                    )}

                    <div className={"flex flex-wrap justify-center items-center mt-10"}>
                        {transactions.reverse().map((transaction, index) => (
                          <TransactionCard key={index} {...transaction} />
                        ))}
                    </div>
                </div>
            </div>
            <FavoriteNavigation />
            <History />
        </>
    );
}

export default Transactions;