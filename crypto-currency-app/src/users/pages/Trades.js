import React from "react";
import Transactions from "../../ethereum/components/Transactions";
import Welcome from "../../ethereum/components/Welcome";


const Trades = () => {
    return(
        <div>
            <Welcome />
            <Transactions />
        </div>
    );
}

export default Trades;