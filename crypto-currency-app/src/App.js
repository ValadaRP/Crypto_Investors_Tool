import React from "react";
import Navbar from "./shared/Navigation/navbar";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./users/pages/Home";
import Auth from "./users/pages/Auth";
import {AuthContext} from "./context/auth-context";
import {useAuth} from "../src/hooks/auth-hook";
import Cocpit from "./users/pages/Cocpit";
import SingleCoin from "./users/pages/SingleCoin";
import Footer from "./users/pages/Footer";
import Trades from "./users/pages/Trades";
import {TransactionsProvider} from "./context/transaction-context";
import Tools from "./users/pages/Tools";
import MyProfile from "./users/pages/MyProfile";


function App() {
    const {token, login, logout, userId, email, accountBalance, refreshAccountBalance, name, spending, earnings} = useAuth();

    let routes;

    if (token) {
        routes = (
            <Routes>
                <Route path="/" element={<Cocpit />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/coins/:id" element={<SingleCoin />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/redirect" element={<Navigate to={"/"} />} />
            </Routes>
        );
    }else {
        routes = (
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Home />} />
                <Route path="/redirect" element={<Navigate to={"/"} />} />
                <Route path="/tools" element={<Tools />} />
            </Routes>
        );
    }

  return (
    <AuthContext.Provider value={{
        isLoggedIn: !!token,
        userId: userId,
        email: email,
        accountBalance: accountBalance,
        name: name,
        spending: spending,
        earnings: earnings,
        token: token,
        login: login,
        logout: logout,
        refreshAccountBalance: refreshAccountBalance
    }}>
        <div className={"min-h-screen bg-[#ecf0f4] w-full"}>
            <Router>
                <Navbar />
                    <TransactionsProvider>
                        {routes}
                    </TransactionsProvider>
                <Footer />
            </Router>
        </div>
    </AuthContext.Provider>
  );
}

export default App;
