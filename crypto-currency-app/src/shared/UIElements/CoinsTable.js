import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import Image from "./Image";
import {Pagination, Tooltip} from "@mui/material";
import {ClockLoader} from "react-spinners";
import {useNavigate} from "react-router-dom";
import {StarIcon} from "@heroicons/react/outline";
import {useHttpClient} from "../../hooks/http-hook";
import {AuthContext} from "../../context/auth-context";
import Numeral from 'react-numeral';
import ToastNotify from "./ToastNotify";
import {notifySucces, notifyWarr} from "../../toastFunctions/toastFun";
import {SortingHook} from "../../hooks/sorting-hook";


const CoinsTable = props => {
    const [coins, setCoins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState("ASC");
    const [favoritesCoins, setFavoritesCoins] = useState([]);

    const {sendRequest} = useHttpClient(); // useHttpClient hook for sending requests to the backend

    const navigate = useNavigate(); // useNavigate is a hook that allows us to navigate to a different page

    const auth = useContext(AuthContext); // useContext hook for getting the auth context

    const {handleSortArray} = SortingHook(); // SortingHook is a custom hook for sorting the coins array

    const handleFiltrer = () => {
        return coins.filter(coin => coin.name.toLowerCase().includes(searchInput.toLowerCase()) || coin.symbol.toLowerCase().includes(searchInput.toLowerCase()));
    }

    const fetchCoins = async () => {
        setIsLoading(true);
        const {data} = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        setCoins(data);
        setIsLoading(false);
    }

    const fetchFavorites = async () => {
        try {
            const {coins} = await sendRequest(process.env.REACT_APP_BACKEND_URL+`/coin/getcoins/${auth.userId}`, "GET", null,
                {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token});
            console.table(coins);
            console.log(coins);
            setFavoritesCoins(coins);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchCoins();
        fetchFavorites();
    }, []);


    const handleSortFavorites = () => {
        const copyArrayCoins = [...coins];
        copyArrayCoins.sort((a, b) => {
            // Check if a is in the favoriteCoins array
            const aInFavorites = favoritesCoins.find(coin => coin.name === a.name);
            // Check if b is in the favoriteCoins array
            const bInFavorites = favoritesCoins.find(coin => coin.name === b.name);

            // If both a and b are in the favoriteCoins array, sort them based on the order
            // specified in the `order` variable
            if (aInFavorites && bInFavorites) {
                if (order === "ASC") {
                    return 1;
                } else {
                    return -1;
                }
            }
            // If only a is in the favoriteCoins array, it should be placed at the start
            // of the array, so return -1
            if (aInFavorites) {
                return -1;
            }

            // If only b is in the favoriteCoins array, it should be placed at the start
            // of the array, so return 1
            if (bInFavorites) {
                return 1;
            }

            // If neither a nor b are in the favoriteCoins array, they should be placed at
            // the end of the array, so return 0
            return 0;
        });
        setCoins(copyArrayCoins);
    }
    const handleRedirectToSingleCoin = (id = "") => {
        navigate(`/coins/${id}`);
    }

    const handleCoinAdd = async (coinName,coinId,image) => {
        try {
            if (favoritesCoins.find(coin => coin.name === coinName)) {
                const filteredFavoriteCoinsTable = favoritesCoins.filter(coin => coin.name !== coinName);
                setFavoritesCoins(filteredFavoriteCoinsTable);
                notifyWarr("Coin deleted from favorites!");
            }
            await sendRequest(process.env.REACT_APP_BACKEND_URL+`/coin/addcoin`,
                'POST',
                JSON.stringify({
                    name: coinName,
                    creator: auth.userId,
                    coinId: coinId,
                    image: image,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                });
            notifySucces("Coin added to favorites!");
        } catch (err) {
            console.log(err);

        }
        await fetchFavorites();
    }

    return (
        <div className={"bg-white w-[95%] mx-auto mt-8 rounded-xl shadow-xl"}>
            {isLoading ?
                <div className={"flex flex-col items-center h-64 p-20"}><ClockLoader color={"#5a4da8"} size={60}/>
                </div> :
                <>
                    <div className={"flex justify-center py-6"}>
                        <input className={"w-[30%] transform transition-all focus:scale-105"} placeholder={"Type the name of the currency or symbolm"}
                               onChange={(e) => setSearchInput(e.target.value)} type={"text"}/>
                    </div>
                    <table className="table-auto mx-auto w-full">
                        <thead>
                            <tr className="text-center bg-blue-500 text-xl ">
                                <th className="px-4 py-4 hover:cursor-pointer hover:bg-blue-400 duration-500"
                                    onClick={() => handleSortArray("name",setCoins,coins)}>Name
                                </th>
                                <th className="px-4 py-4 hover:cursor-pointer hover:bg-blue-400 duration-500"
                                    onClick={() => handleSortArray("current_price",setCoins,coins)}>Price
                                </th>
                                <th className="px-4 py-4 hover:cursor-pointer hover:bg-blue-400 duration-500"
                                    onClick={() => handleSortArray("market_cap",setCoins,coins)}>Market Cap
                                </th>
                                <th className="px-4 py-4 hover:cursor-pointer hover:bg-blue-400 duration-500"
                                    onClick={() => handleSortArray("market_cap_change_percentage_24h",setCoins,coins)}>Market Cap Change
                                    24h
                                </th>
                                <th className="px-4 py-4 hover:cursor-pointer hover:bg-blue-400 duration-500" onClick={() => handleSortFavorites()}>Favorites</th>
                            </tr>
                        </thead>
                        <tbody>
                        {handleFiltrer().slice((page - 1) * 10, (page - 1) * 10 + 10).map(coin => {
                            const coinProfit = coin.market_cap_change_percentage_24h > 0;
                            let coinProfitClass = coinProfit ? 'text-[#0bb337]' : 'text-[#ed2618]';
                            return (
                                <tr key={coin.id}
                                    className="text-center hover:cursor-pointer hover:bg-gray-200 duration-700 ">
                                    <Tooltip title={"Click to see more details and buy or sell coin!"} placement={"left"} arrow>
                                        <td className="border px-4 py-2 "
                                            onClick={() => handleRedirectToSingleCoin(coin.id)}>
                                            <div className={"md:flex md:flex-row sm:flex sm:flex-col "}>
                                                <Image src={coin.image} alt={coin.name} width={80}/>
                                                <div className={"flex flex-col justify-center pl-4"}>
                                                    <p className={"font-bold"}>{coin.symbol.toUpperCase()}</p>
                                                    <p className={"font-bold"}>{coin.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </Tooltip>
                                    <td className="border px-4 py-2">{coin.current_price}&#8364;</td>
                                    <td className="border px-4 py-2">{<Numeral value={coin.market_cap}
                                                                               format={"0.0a"}/>}</td>
                                    <td className="border px-4 py-2 "><span
                                        className={`${coinProfitClass} font-bold`}>{coinProfit && "+"}{coin.market_cap_change_percentage_24h.toFixed(2)}%</span>
                                    </td>
                                    <td className="border px-4 py-2 "
                                        onClick={() => handleCoinAdd(coin.name,coin.id,coin.image)}>{favoritesCoins.find(favoriteCoin => favoriteCoin.coinId === coin.id) ?
                                        <StarIcon className={"w-10 fill-yellow-300 mx-auto"}/> :
                                        <StarIcon className={"w-10 fill-white mx-auto"}/>}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <Pagination
                        count={parseInt((handleFiltrer()?.length / 10).toFixed(0))} //Error with the count solved
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 20,
                            width: "100%",
                        }}
                        onChange={(_, value) => {
                            setPage(value);
                            window.scroll(0, 450);
                        }}
                        color={"secondary"}
                    />
                </>}
            <ToastNotify />
        </div>
    );
}


export default CoinsTable;