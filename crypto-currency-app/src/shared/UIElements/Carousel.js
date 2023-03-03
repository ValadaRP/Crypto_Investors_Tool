import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import Image from "./Image";
import {RiseLoader} from "react-spinners";
import {AuthContext} from "../../context/auth-context";


const Carousel = () => {
    const auth = useContext(AuthContext);
    const [trendingCoins, setTrendingCoins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getTrendingCoins = async () => {
        setIsLoading(true);
        const {data} = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=' +
            'gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h');
        setTrendingCoins(data);
        setIsLoading(false);
        // console.log(data);
    }
    useEffect(() => {
        getTrendingCoins();
    },[])

    const responsive = {
        0: { items: 2 },
        600: { items: 3 },
        1024: { items: 5 },
    };


    const items = trendingCoins.map((coin) => {
        let coinProfit = coin.price_change_percentage_24h >= 0;
        let coinProfitClass = coinProfit ? 'text-[#0bb337]' : 'text-[#ed2618]';

        return(
            <>
                <div className={" flex flex-col items-center h-80"}>
                    <Image src={coin.image} alt={coin.name} width={190} />
                    <p className={`mt-4 text-center text-xl font-bold `}>{coin.name} <span className={`${coinProfitClass}`}>{coinProfit && "+"}{coin.price_change_percentage_24h.toFixed(2)}%</span></p>
                    <p className={"text-center text-xl font-bold"}>{coin.current_price}€</p>
                </div>
            </>
        );
    });


    return(
    <>
        <div className={`${auth.isLoggedIn ? ("w-[90%]  rounded-xl mx-auto shadow-xl mt-4") : ("w-full rounded-xl shadow-xl ")} bg-white`}>
            {isLoading ? <div className={"flex flex-col items-center h-64 p-20"}><RiseLoader color={"#5a4da8"} size={60} /></div> :
                <>
                    <div className={"flex w-full items-center justify-center py-6 bg-[#5580aa] mb-8"}>
                        <h1 className={"text-center text-6xl font-extrabold tracking-tight leading-none "}>Top 10 Crypto (24H Price change)</h1>
                    </div>
                    <AliceCarousel
                        mouseTracking={true}
                        infinite autoPlayInterval={2500}
                        animationDuration={4500}
                        disableDotsControls
                        disableButtonsControls
                        responsive={responsive}
                        autoPlay
                        items={items} />
                </>}
        </div>
    </>

    );
}

export default Carousel;