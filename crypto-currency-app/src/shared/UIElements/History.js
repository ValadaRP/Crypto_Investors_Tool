import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/auth-context";
import {useHttpClient} from "../../hooks/http-hook";
import Image from "./Image";
import {Pagination, Tooltip} from "@mui/material";



const History = () => {
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [transType, setTransType] = useState("Buy");
    const [page, setPage] = useState(1);
    const {sendRequest} = useHttpClient();

    const auth = useContext(AuthContext);

    const fetchTransactionsHistory = async () => {
        try{
            const {transactionsHistory} = await sendRequest(`http://localhost:5000/api/transactionHistory`, "POST", null, {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.token
            });
            setTransactionHistory(transactionsHistory);
        }catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTransactionsHistory();
    }, []);

    const euroSign = String.fromCharCode(8364);

    const handlePageChange = () => {
        if (transType === "Buy") {
            return Math.ceil(parseFloat(transactionHistory.filter(transaction => transaction.type === "Buy").length / 10));
        }else if (transType === "Sell") {
            return Math.ceil(parseFloat(transactionHistory.filter(transaction => transaction.type === "Sell").length / 10));
        }else {
            return Math.ceil(parseFloat(transactionHistory?.length / 10));
        }
    }

    return(
        <div className={"w-full mx-auto"}>
            <table className={"md:table-auto sm:table-fixed md:w-[90%] sm:w-full text-center shadow-xl mt-10 bg-white rounded-xl mx-auto"}>
                <thead className={""}>
                    {transType === "Buy" && <tr className={"bg-[#1969B9] opacity-70 text-white text-xl text-base font-mono "}>
                        <th className={"md:p-4 sm:p-2"}>
                            Transaction Type
                            <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                <button className={`${transType === "All" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black `} onClick={() => setTransType("All")}>All</button>
                                <button className={`${transType === "Buy" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black `} onClick={() => setTransType("Buy")}>Buy</button>
                                <button className={`${transType === "Sell" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black`} onClick={() => setTransType("Sell")}>Sell</button>
                            </div>
                        </th>
                        <th>Quantity</th>
                        <th className={""}>Price</th>
                        {transType === "Sell" ? <th className={""}>Sell Price</th> : null}
                        <th className={""}>You Paid</th>
                        {transType === "Sell" ? <th className={""}>Transaction Balance</th> : null}
                        <th className={""}>Transaction Currency</th>
                        <th className={""}>Transaction Date</th>
                    </tr>}
                    {transType === "Sell" && <tr className={"bg-[#1969B9] opacity-70 text-white text-xl text-base font-mono "}>
                        <th className={"md:p-4 sm:p-2"}>
                            Transaction Type
                            <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                <button className={`${transType === "All" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black `} onClick={() => setTransType("All")}>All</button>
                                <button className={`${transType === "Buy" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black `} onClick={() => setTransType("Buy")}>Buy</button>
                                <button className={`${transType === "Sell" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black`} onClick={() => setTransType("Sell")}>Sell</button>
                            </div>
                        </th>
                        <th>Quantity</th>
                        <th className={""}>Price</th>
                        {transType === "Sell" ? <th className={""}>Sell Price</th> : null}
                        <th className={""}>You Paid</th>
                        {transType === "Sell" ? <th className={""}>Transaction Balance</th> : null}
                        <th className={""}>Transaction Currency</th>
                        <th className={""}>Transaction Date</th>
                    </tr>}
                    {transType === "All" && <tr className={"bg-[#1969B9] opacity-70 text-white text-xl text-base font-mono "}>
                        <th className={"md:p-4 sm:p-2"}>
                            Transaction Type
                            <div className={"flex md:flex-row sm:flex-col items-center justify-center gap-x-2 sm:gap-y-2"}>
                                <button className={`${transType === "All" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black `} onClick={() => setTransType("All")}>All</button>
                                <button className={`${transType === "Buy" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black `} onClick={() => setTransType("Buy")}>Buy</button>
                                <button className={`${transType === "Sell" ? "bg-purple-600 text-black hover:bg-purple-700 duration-300" : "bg-[#1969B9] text-white"} text-md rounded-md px-2 border-[0.5px] border-black`} onClick={() => setTransType("Sell")}>Sell</button>
                            </div>
                        </th>
                        <th>Quantity</th>
                        <th className={""}>Price</th>
                        <th className={""}>Sell Price</th>
                        <th className={""}>You Paid</th>
                        <th className={""}>Transaction Balance</th>
                        <th className={""}>Transaction Currency</th>
                        <th className={""}>Transaction Date</th>
                    </tr>}
                </thead>
                <tbody className={"md:text-2xl sm:text-lg"}>
                    {transType === "Buy" && (transactionHistory.filter(transaction => transaction.type === "Buy").slice((page - 1) * 10, (page - 1) * 10 + 10).map((transaction) => {
                        return(
                            <tr key={transaction.id} className={"border-b-[0.5px]"}>
                                <td className={"md:p-4 font-bold md:text-2xl sm:text-xl text-black "}>{transaction.type}</td>
                                <td className={""}>{transaction.quantity}</td>
                                <td className={""}>{transaction.price}{euroSign}</td>
                                <td>{transaction.value.toFixed(6)}{euroSign}</td>
                                <td>
                                    <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                        <Image src={transaction.image} width={40} />{transaction.name}
                                    </div>
                                </td>
                                <td className={""}>{transaction.date}</td>
                            </tr>
                        )}))}
                    {transType === "Sell" && transactionHistory.filter(transaction => transaction.type === "Sell").slice((page - 1) * 10, (page - 1) * 10 + 10).map((transaction) => {
                            const checkPrice = parseFloat(transaction.price) > parseFloat(transaction.sellPrice) ? "text-red-500" : "text-[#10ad1d]";
                            return(
                                <tr key={transaction.id} className={"border-b-[0.5px] sm:text-md"}>
                                    <td className={`md:p-4 font-bold ${checkPrice} md:text-2xl sm:text-xl`}>{transaction.type}</td>
                                    <td className={""}>{transaction.quantity}</td>
                                    <td className={""}>{transaction.price}{euroSign}</td>
                                    <td className={""}><span className={`${checkPrice} font-bold`}>{transaction.sellPrice}{euroSign}</span></td>
                                    <td>{transaction.value.toFixed(6)}{euroSign}</td>
                                    <Tooltip title={`Transaction Balance is: ${transaction.transactionBalance.toFixed(10)}`} placement="top">
                                        <td><span className={`${checkPrice} font-bold`}>{transaction.transactionBalance.toFixed(6)}{euroSign}</span></td>
                                    </Tooltip>
                                    <td>
                                        <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                            <Image src={transaction.image} width={40} />{transaction.name}
                                        </div>
                                    </td>
                                    <td className={""}>{transaction.date}</td>
                                </tr>
                            )
                        })}
                    {transType === "All" && transactionHistory.slice((page - 1) * 10, (page - 1) * 10 + 10).map((transaction) => {
                        const checkPrice = parseFloat(transaction.price) > parseFloat(transaction.sellPrice) ? "text-black" : "text-[#10ad1d]";
                        const checkTransactionBalance = parseFloat(transaction.transactionBalance) < 0  ? "text-red-600" : "text-black";
                        return(
                            <tr key={transaction.id} className={"border-b-[0.5px] sm:text-md"}>
                                <td className={`md:p-4 font-bold ${checkPrice} ${checkTransactionBalance} md:text-2xl sm:text-xl overflow-hidden`}>{transaction.type}</td>
                                <td className={"overflow-hidden"}>{transaction.quantity}</td>
                                <td className={"overflow-hidden"}>{transaction.price}{euroSign}</td>
                                <td className={"overflow-hidden"}><span className={`${checkPrice} ${checkTransactionBalance} font-bold`}>{transaction.sellPrice}{euroSign}</span></td>
                                <td className={"overflow-hidden"}>{transaction.value.toFixed(6)}{euroSign}</td>
                                <Tooltip title={`You earn ${transaction.transactionBalance === 0 ? "0" : parseFloat(transaction.transactionBalance).toFixed(10)}${euroSign}`}>
                                    <td className={"overflow-hidden"}><span className={`${checkPrice} ${checkTransactionBalance} font-bold`}>{transaction.transactionBalance === 0 ? "0" : parseFloat(transaction.transactionBalance).toFixed(7)}{euroSign}</span></td>
                                </Tooltip>
                                <td>
                                    <div className={"flex flex-row items-center justify-center gap-x-2 overflow-hidden"}>
                                        <Image src={transaction.image} width={40} />{transaction.name}
                                    </div>
                                </td>
                                <td className={"overflow-hidden"}>{transaction.date}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination
                count={parseInt(handlePageChange())} //Error with the count solved
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 20,
                    width: "100%",

                }}
                onChange={(_, value) => {
                    setPage(value);
                    window.scroll(0, 1000);
                }}
                color={"secondary"}
            />
        </div>

    )
}

export default History;