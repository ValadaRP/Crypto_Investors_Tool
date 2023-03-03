import React,{useState} from "react";

export const SortingHook = () => {
    const [orderBy, setOrderBy] = useState('ASC');

    const handleSortArray = (field = "", setFunction, coins) => {
        const copyArrayCoins = [...coins];
        if (orderBy === "ASC") {
            copyArrayCoins.sort((a, b) => (a[field] > b[field]) ? -1 : 1);
            setOrderBy("DESC");
        } else {
            copyArrayCoins.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
            setOrderBy("ASC");
        }
        setFunction(copyArrayCoins);
    }

    return {handleSortArray};
}