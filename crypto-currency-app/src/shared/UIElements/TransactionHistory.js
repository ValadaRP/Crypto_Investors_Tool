import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/auth-context";
import Image from "./Image";
import {Pagination, Tooltip} from "@mui/material";
import {SortingHook} from "../../hooks/sorting-hook";


const TransactionHistory = ({transactions, coin, handleSellCoin, handleNavigate}) => {
    const auth = useContext(AuthContext);
    const [isChecked, setIsChecked] = useState(false);
    const [page, setPage] = useState(1);

    const {handleSortArray} = SortingHook();

    const filterTransactions = transactions.filter(transaction => transaction.name === coin.name);

    const handleCheck = () => {
        setIsChecked(!isChecked);
    }

    const handlePagination = () => {
        console.log(filterTransactions.length);
        console.log(transactions.length);
        if (isChecked){
            return Math.ceil(parseFloat(filterTransactions?.length / 10));
        }else {
            return Math.ceil(parseFloat(transactions?.length / 10));
        }
    }

    return(

            <div className={"w-[98%] mx-auto mt-20 bg-white shadow-xl p-8 rounded-xl"}>
                {
                    filterTransactions.length > 0 || !isChecked ? (
                        <>
                            <div className={"w-full flex justify-between items-center mb-4"}>
                                <h1 className={"text-4xl font-bold"}>Owned Coins/Sell Coin</h1>
                                <div className={"flex items-center"}>
                                    <label className={"flex flex-row items-center gap-2"}>
                                        <span className={""}>Press to sell {coin?.name}  </span>
                                        <Image src={`${coin?.image.small}`} alt={`${coin?.name}`} width={30} />
                                        <input type={"checkbox"} value={isChecked} onChange={handleCheck} className={"mr-4"}/>
                                    </label>
                                </div>
                            </div>
                            <table className={"table-auto w-full text-center shadow-xl "}>
                                <thead>
                                <tr className={"text-xl "}>
                                    <th className={"bg-[#ecf0f4] p-4"}>Coin name</th>
                                    <th className={"bg-[#ecf0f4]"}>Date</th>
                                    <th className={"bg-[#ecf0f4]"}>Quantity</th>
                                    <th className={"bg-[#ecf0f4]"}>Price</th>
                                    <th className={"bg-[#ecf0f4]"}>You paid</th>
                                    {isChecked && <th className={"bg-[#ecf0f4]"}>Worth now</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {isChecked ? filterTransactions.slice((page - 1) * 10, (page - 1) * 10 + 10).map((transaction) => {
                                    const checkPrice = transaction.price > coin?.market_data.current_price.eur ? "text-red-500" : "text-[#10ad1d]";
                                    return(
                                        <tr key={transaction.id} >
                                            <td className="border px-4 py-2 ">
                                                <div className={"md:flex md:flex-row sm:flex sm:flex-col"}>
                                                    <Image src={transaction.image} alt={transaction?.name} width={80}/>
                                                    <div className={"flex flex-col justify-center pl-4"}>
                                                        <p className={"font-bold"}>{transaction?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">{transaction?.date}</td>
                                            <td className="border px-4 py-2">{transaction?.quantity + " " + coin?.symbol.toUpperCase()}</td>
                                            <Tooltip title={"Current price: " + coin?.market_data.current_price.eur + "€"} arrow placement={"top"}>
                                                <td className="border px-4 py-2">
                                                    <span className={`${checkPrice} font-bold `}>{transaction?.price}&#8364;</span>
                                                </td>
                                            </Tooltip>
                                            <td className="border px-4 py-2">{transaction?.value.toFixed(6)}&#8364;</td>
                                            <td className="border px-4 py-2"><span className={`${checkPrice} font-bold`}>{(transaction?.quantity * coin?.market_data.current_price.eur).toFixed(6)}&#8364;</span></td>
                                            <td className="bg-blue-400 text-2xl border-2 border-black hover:cursor-pointer hover:bg-blue-500 duration-500" onClick={(event) => handleSellCoin(event, transaction.id)}>Sell {transaction?.name}</td>
                                        </tr>
                                    )
                                }) : transactions.slice((page - 1) * 10, (page - 1) * 10 + 10).map((transaction) => {
                                    return(
                                        <tr key={transaction.id} className={""} >
                                            <td className="border px-4 py-2 " >
                                                <div className={"md:flex md:flex-row sm:flex sm:flex-col hover:cursor-pointer"} onClick={() =>  handleNavigate(transaction?.coinId)}>
                                                    <Image src={transaction.image} alt={transaction?.name} width={80}/>
                                                    <div className={"flex flex-col justify-center pl-4"}>
                                                        <p className={"font-bold"}>{transaction?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">{transaction?.date}</td>
                                            <td className="border px-4 py-2">{transaction?.quantity}</td>
                                            <td className="border px-4 py-2">{transaction?.price}&#8364;</td>
                                            <td className="border px-4 py-2">{transaction?.value.toFixed(6)}&#8364;</td>

                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                            <Pagination
                                count={parseInt(handlePagination())} //Error with the count solved
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    padding: 20,
                                    width: "100%",
                                }}
                                onChange={(_, value) => {
                                    setPage(value);
                                    window.scroll(0, 2000);
                                }}
                                color={"secondary"}

                            />
                        </>
                    ) : (
                        <div className={"w-full flex justify-center items-center text-4xl font-bold"}>
                            <span className={""}>You don't have any transaction to sell with {coin?.name}</span>
                            <Tooltip title={"Prees to show all transactions"} arrow placement={"top"}>
                                <label className={"ml-4 flex flex-row items-center justify-center gap-2"}>
                                    <Image src={`${coin?.image.small}`} alt={`${coin?.name}`} width={50} />
                                    <input type={"checkbox"} value={isChecked} onChange={handleCheck} className={"mr-4"}/>
                                </label>
                            </Tooltip>
                        </div>
                    )
                }

            </div>

    );
}


export default TransactionHistory;