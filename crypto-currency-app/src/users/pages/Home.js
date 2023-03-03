import React from "react";
import Hero from "../../shared/UIElements/Hero";
import cryptoImage from "../../images/bitcoin.png";
import blockChain from "../../images/block_chain.png";
import Carousel from "../../shared/UIElements/Carousel";

const Home = () => {
    return(
        <>
            <Carousel />
            <Hero src={cryptoImage} alt="Here should be a photo" chainSrc={blockChain} chainAlt={"Block chain photo"}/>
        </>
    );
}

export default Home;