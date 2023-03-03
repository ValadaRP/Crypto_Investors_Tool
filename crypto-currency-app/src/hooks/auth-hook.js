import {useState, useCallback, useEffect} from "react";
import axios from "axios";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
    const [email, setEmail] = useState(false);
    const [accountBalance, setAccountBalance] = useState(0);

    const [name, setName] = useState("");
    const [earnings, setEarnings] = useState(0);
    const [spending, setSpending] = useState(0);


    const login = useCallback((uid,email,balance ,name,earnings,spending,token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setEmail(email);
        setAccountBalance(balance);
        setName(name);
        setEarnings(earnings);
        setSpending(spending);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                email: email,
                accountBalance: balance,
                name: name,
                earnings: earnings,
                spending: spending,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        setEmail(null);
        setAccountBalance(null);
        setName(null);
        setEarnings(null);
        setSpending(null);
        localStorage.removeItem('userData');
    }, []);

    const refreshAccountBalance = async (uid,token) => {
        try {
            const requestData = await axios({
                method: 'post',
                url: process.env.REACT_APP_BACKEND_URL+'/users/getuser',
                headers: {'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token},
                data: {
                    userId: uid
                }
            });
            let userData = JSON.parse(localStorage.getItem('userData'));
            userData.accountBalance = requestData.data.user.accountBalance;
            userData.name = requestData.data.user.name;
            userData.earnings = requestData.data.user.earnings;
            userData.spending = requestData.data.user.spending;
            localStorage.setItem('userData', JSON.stringify(userData));
            setAccountBalance(requestData.data.user.accountBalance);
            setName(requestData.data.user.name);
            setEarnings(requestData.data.user.earnings);
            setSpending(requestData.data.user.spending);
        }catch (err) {
            console.log(err);
            console.log("Error in refreshAccountBalance");
        }

    };


    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    },[token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId,storedData.email,storedData.accountBalance, storedData.name,storedData.earnings,storedData.spending ,storedData.token, new Date(storedData.expiration));
        }
    }, [token, login, logout, userId, email, accountBalance]);


    return { token, login, logout, userId, email, accountBalance, refreshAccountBalance, name, earnings, spending };
}

