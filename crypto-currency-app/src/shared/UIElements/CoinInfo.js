import React from "react";
import {TrendingDownIcon, TrendingUpIcon} from "@heroicons/react/outline";
import Image from "./Image";





const CoinInfo = ({coin}) => {
    const euroSign = String.fromCharCode(8364);

    return(
        <div className={"w-[90%] mx-auto mt-20 rounded-xl shadow-xl bg-[#ffa07a]"}>
            <div className={"flex flex-row items-center justify-center bg-[#5580aa] p-6"}>
                <div className={"w-3/4"}>
                    <p className={"text-center md:text-3xl sm:text-2xl"}>Specific info about <span className={"font-bold"}>{coin?.name}</span></p>
                </div>
                <div className={"w-1/4"}>
                    <p className={"md:text-3xl sm:text-2xl"}>Genesis Date: {coin?.genesis_date}</p>
                </div>
            </div>
            {/*<hr className={"border-black my-12 w-[90%] mx-auto "}></hr>*/}
            <div className={"flex flex-col "}>
                <p className={"text-center text-4xl mt-4 font-bold"}>Coin ranking</p>
                <div className={"flex flex-row mt-5 w-full p-6 h-48 gap-x-2 "}>
                    <div className={"flex items-center justify-center w-1/3 border-[0.5px] shadow-md rounded-md bg-[#f5deb3]"}>
                        <p className={"sm:text-center text-base md:text-4xl sm:text-2xl "}>Market Cap Rank: <span className={"font-bold"}>{coin?.market_cap_rank}</span></p>
                    </div>
                    <div className={"flex items-center justify-center w-1/3 border-[0.5px] shadow-md rounded-md bg-[#f5deb3]"}>
                        <p className={"sm:text-center text-base md:text-4xl sm:text-2xl  "}>CoinGecko Rank: <span className={"font-bold"}>{coin?.coingecko_rank}</span></p>
                    </div>
                    <div className={"flex items-center justify-center w-1/3 border-[0.5px] shadow-md rounded-md bg-[#f5deb3]"}>
                        <p className={"sm:text-center text-base  md:text-4xl sm:text-2xl  "}>Alexa Rank: <span className={"font-bold"}>{coin?.public_interest_stats.alexa_rank}</span></p>
                    </div>
                </div>
                <div className={"flex md:flex-row sm:flex-col w-full bg-[#ffa07a] h-full sm:items-center sm:justify-center p-4"}>
                    <div className={"flex flex-col md:w-1/2 sm:w-full border-[0.5px] items-center justify-center mx-2 shadow-md bg-[#f5deb3] rounded-md"}>
                        <span className={"text-center text-4xl my-4"}>ATH</span>
                        <div className={"flex flex-row items-center justify-center w-1/2 sm:my-4 "}>
                            <p className={"text-center text-3xl "}><span className={"font-bold text-4xl"}>{coin?.market_data.ath.eur}{euroSign}</span></p>
                        </div>
                        <div className={"flex flex-row items-center justify-center"}>
                            <p className={"text-center text-3xl font-bold text-4xl"}>{coin?.market_data.ath_change_percentage.eur.toFixed(2)}%</p>
                            <p>{coin?.market_data.ath_change_percentage.eur < 0 ? <TrendingDownIcon className={"text-red-700 w-20"}/> : <TrendingUpIcon className={"text-green-600 w-20"}/>}</p>
                        </div>
                    </div>
                    <div className={"flex flex-col md:w-1/2 sm:w-full items-center justify-center border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                        <span className={"text-center text-4xl my-4"}>ATL</span>
                        <div className={"flex flex-row items-center justify-center sm:my-4 "}>
                            <p className={"text-center text-3xl "}><span className={"font-bold text-4xl"}>{coin?.market_data.atl.eur}{euroSign}</span></p>
                        </div>
                        <div className={"flex flex-row items-center justify-center w-1/2 "}>
                            <p className={`text-center text-3xl font-bold text-4xl`}>{coin?.market_data.atl_change_percentage.eur.toFixed(2)}%</p>
                            <p>{coin?.market_data.atl_change_percentage.eur < 0 ? <TrendingDownIcon className={"text-red-700 w-20"}/> : <TrendingUpIcon className={"text-green-600 w-20"}/>}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row h-48 w-full p-4"}>
                <div className={"flex flex-col h-full w-1/2 items-center justify-center gap-y-4 border-[0.5px] mx-2 shadow-md bg-[#f5deb3] rounded-md"}>
                    <p className={"md:text-4xl sm:text-2xl"}>Total Volume</p>
                    <p className={"md:text-4xl sm:text-2xl font-bold"}>{coin?.market_data.total_volume.eur}{euroSign}</p>
                </div>
                <div className={"flex flex-row h-full w-1/2 "}>
                    <div className={"flex flex-row items-center justify-center w-full border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                        <div className={"flex flex-col w-1/2 items-center justify-center gap-y-2 border-r-[0.5px] border-black"}>
                            <span className={"md:text-4xl sm:text-2xl"}>High 24h</span>
                            <span className={"md:text-4xl sm:text-2xl font-bold"}>{coin?.market_data.high_24h.eur}{euroSign}</span>
                        </div>
                        <div className={"flex flex-col w-1/2 items-center justify-center gap-y-2 bg-[#f5deb3] rounded-md"}>
                            <span className={"md:text-4xl sm:text-2xl"}>Low 24h</span>
                            <span className={"md:text-4xl sm:text-2xl font-bold"}>{coin?.market_data.low_24h.eur}{euroSign}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col w-full md:h-64 mt-8"}>
                <span className={"sm:text-2xl md:text-4xl text-center mt-4 font-bold"}>Price</span>
                <div className={"flex flex-row h-full p-4"}>
                    <div className={"flex flex-col items-center justify-center w-1/4 gap-y-4 mr-2 border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                        <span className={"sm:text-2xl md:text-4xl"}>Current Price </span>
                        <span className={"sm:text-2xl md:text-4xl font-bold"}>{coin?.market_data.current_price.eur}{euroSign}</span>
                    </div>
                    <div className={"grid md:grid-cols-5 w-full md:gap-x-2 sm:gap-y-2"}>
                        <div className={"flex flex-col items-center justify-center gap-y-8 border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                            <span className={"text-3xl"}>Price 24h</span>
                            <span className={"text-4xl font-bold"}>{coin?.market_data.price_change_24h_in_currency.eur.toFixed(5)}{euroSign}</span>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-y-8 border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                            <span className={"text-2xl"}>Percentage 24h</span>
                            <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                <span className={"text-4xl font-bold"}>{coin?.market_data.price_change_percentage_24h.toFixed(2)}%</span>
                                <span> {coin?.market_data.price_change_percentage_24h < 0 ? <TrendingDownIcon className={"text-red-700 w-8"}/> : <TrendingUpIcon className={"text-green-600 w-8"}/>}</span>
                            </div>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-y-8 border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                            <span className={"text-2xl"}>Percentage 7d</span>
                            <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                <span className={"text-4xl font-bold"}>{coin?.market_data.price_change_percentage_7d.toFixed(2)}%</span>
                                <span> {coin?.market_data.price_change_percentage_7d < 0 ? <TrendingDownIcon className={"text-red-700 w-8"}/> : <TrendingUpIcon className={"text-green-600 w-8"}/>}</span>
                            </div>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-y-8 border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                            <span className={"text-2xl"}>Percentage 14d</span>
                            <div className={"flex flex-row items-center justify-center gap-x-2 "}>
                                <span className={"text-4xl font-bold"}>{coin?.market_data.price_change_percentage_14d.toFixed(2)}%</span>
                                <span> {coin?.market_data.price_change_percentage_14d < 0 ? <TrendingDownIcon className={"text-red-700 w-8"}/> : <TrendingUpIcon className={"text-green-600 w-8"}/>}</span>
                            </div>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-y-8 border-[0.5px] shadow-md bg-[#f5deb3] rounded-md"}>
                            <span className={"text-2xl"}>Percentage 30d</span>
                            <div className={"flex flex-row items-center justify-center gap-x-2"}>
                                <span className={"text-4xl font-bold"}>{coin?.market_data.price_change_percentage_30d.toFixed(2)}%</span>
                                <span> {coin?.market_data.price_change_percentage_30d < 0 ? <TrendingDownIcon className={"text-red-700 w-8"}/> : <TrendingUpIcon className={"text-green-600 w-8"}/>}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoinInfo;