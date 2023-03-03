import React, {useEffect, useState} from "react";
import axios from "axios";
import {ClockLoader} from "react-spinners";
import { Line } from "react-chartjs-2";

import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);


const HistoricalChart = ({coin, styles} ) => {
     const [historicData, setHistoricData] = useState();
     const [totalVolumes, setTotalVolumes] = useState();
     const [marketCap, setMarketCap] = useState();
     const [days, setDays] = useState(1);
     const [currency, setCurrency] = useState("EUR");
     const [selectedButton, setSelectedButton] = useState(1);

 const fetchData = async () => {
     const {data} = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin?.id}/market_chart?vs_currency=${currency}&days=${days}`);
     setHistoricData(data?.prices);
     setTotalVolumes(data?.total_volumes);
     setMarketCap(data?.market_caps);
 }

 const buttonHandler = (days) => {
     setDays(days);
     setSelectedButton(days);
 }

 const buttonData = [ // Const that holds data for the buttons
    {label: "1 Day", value: 1},
    {label: "30 Days", value: 30},
    {label: "90 Days", value: 90},
    {label: "1 Year", value: 365},
 ];

 useEffect(() => {
        fetchData();
 } ,[days, currency]);

 const buttonStylesUnselected = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded hover:cursor-pointer";
 const buttonStylesSelected = "bg-blue-500 hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded hover:cursor-pointer";


 return(
        <div className={`${styles}`}>
            <>
                <div className={"flex flex-col items-center p-5 rounded-md bg-white shadow-xl"} >
                {!historicData ? <div className={"flex flex-col items-center h-64 p-20"}><ClockLoader color={"#5a4da8"} size={60} /></div> :
                    <Line
                        data={{
                            labels: historicData.map((coin) => {
                                let date = new Date(coin[0]);
                                let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                                return days === 1 ? time : date.toLocaleDateString();
                            }),
                            datasets: [{
                                data: historicData.map((coin) => coin[1]),
                                label: `Price (Past ${days} days) in ${currency}`,
                                borderColor: "#5a4da8",
                                fill: true,
                                tension: 0.4,
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointBackgroundColor: "#afabbe",

                            },{
                                data: totalVolumes.map((coin) => coin[1]),
                                label: `Volume (Past ${days} days) in ${currency}`,
                                borderColor: "#ff0000",
                                hidden: true,
                                fill: true,
                                tension: 0.4,
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointBackgroundColor: "yellow",
                            },{
                                data: marketCap.map((coin) => coin[1]),
                                label: `Market Cap (Past ${days} days) in ${currency}`,
                                borderColor: "#1d80c0",
                                hidden: true,
                                fill: true,
                                tension: 0.4,
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointBackgroundColor: "#dddbe1",
                            }]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {text: `Price (Past ${days} days) in ${currency}`, display: true,font: {size: 20}},
                                legend: {position: "bottom"},
                            },
                            transitions: {
                                show: {
                                    animations: {
                                        x: {
                                            from: 0
                                        },
                                        y: {
                                            from: 0
                                        }
                                    }
                                },
                                hide: {
                                    animations: {
                                        x: {
                                            to: 0
                                        },
                                        y: {
                                            to: 0
                                        }
                                    }
                                }
                            },

                            }}
                    />
                }
                    <div className={"flex flex-row  mt-12 space-x-6 w-full md:justify-start sm:justify-center ml-6"}>
                        {buttonData.map((day) => {
                            return(
                                <historicButtons key={day.value} onClick={() => buttonHandler(day.value)} className={selectedButton === day.value ? buttonStylesSelected : buttonStylesUnselected}>{day.label}</historicButtons>
                            );
                        })}
                    </div>

                </div>
            </>
        </div>
 );
}

export default HistoricalChart;