import React, {useContext, useEffect, useState} from "react";
import {useHttpClient} from "../../hooks/http-hook";
import {AuthContext} from "../../context/auth-context";
import Image from "./Image";
import {useNavigate} from "react-router-dom";
import { Pagination, Tooltip} from "@mui/material";

const FavoriteNavigation = (props) => {

    const [favoriteCoins, setFavoriteCoins] = useState([]);
    const [page, setPage] = useState(1);
    const {sendRequest,isLoading} = useHttpClient();

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const navigateToCoin = (coinId = "") => {
        navigate(`/coins/${coinId}`);
    }

    const fetchFavoriteCoins = async () => {
        try {
            const {coins} = await sendRequest(`http://localhost:5000/api/coin/getcoins/${auth.userId}`, "GET", null,
                {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token});
            setFavoriteCoins(coins);
        } catch (err) {
            console.log(err);
        }
    }
    const handlePagination = () => {
        return Math.ceil(parseFloat(favoriteCoins?.length / 4));
    }

    useEffect(() => {
        fetchFavoriteCoins();
        console.log(favoriteCoins);
    },[]);



    return(
        <div className={"w-1/6 flex ml-24 mt-12"}>
            <div className={"w-full bg-[#181918] p-2 shadow-md rounded-xl"}>
                <table className={"w-full "}>
                    <tbody className={"w-full "}>
                    {favoriteCoins.slice((page - 1) * 4, (page - 1) * 4 + 4).map((coin) => {
                        return(
                            <tr key={coin.id} className={"text-white"}>
                                <Tooltip title={`Click to move you for details about ${coin.name}`} placement={"right"}>
                                    <td className={"hover:bg-black hover:cursor-pointer hover:rounded-xl p-2"} onClick={() => navigateToCoin(coin.coinId)}>
                                        <div className={"flex flex-row items-center w-full "}>
                                            <Image src={coin.image} alt={coin.name} width={35} height={35}/>
                                            <span className={"ml-2"}>{coin.name}</span>
                                        </div>
                                    </td>
                                </Tooltip>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className={"hover:bg-[#4c524c] duration-500 rounded-xl"}>
                    <Pagination
                        count={parseInt(handlePagination())} //Error with the count solved
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            padding: "8px",
                            color: "white",
                        }}
                        onChange={(_, value) => {
                            setPage(value);
                            window.scroll(0, 1000);
                        }}
                        color={"secondary"}
                    />
                </div>
            </div>
        </div>
    )
}

export default FavoriteNavigation;