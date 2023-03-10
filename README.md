
# Crypto Investors Tool
This project was created using the Express framework and the React.js library. The mongoDB technology was used as the database. The application allows browsing data on cryptocurrencies and conducting simulations/sales of the selected cryptocurrency.




## Run Locally

To run this project you have to first clone the repo and after you have to make this command in each directory backend / crypto-currency-app / smart_contracts. Futhermore you have to install mongoDB database or use their online hosting (https://www.mongodb.com/cloud/atlas/register).

Clone the project

```bash
  git clone https://github.com/ValadaRP/Crypto_Investors_Tool.git
```

Go to the project directory. You have to repeat this for this two directories backend / crypto-currency-app.

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

#### First in the backend directory

`DB_USER: "Username"`  
`DB_PASS: "Password"`  
`DB_NAME: "Database name"`  
`JWT_KEY: "Your key"`  

#### In frontend(crypto-currency-app)
Here you have to pass just one enviroment variable that is url to backend  

`REACT_APP_BACKEND_URL: "http://localhost:5000/api"`

## Screenshots of the app

### Table with coins
![image](https://user-images.githubusercontent.com/79703007/222826583-597b1edc-c5fd-49cf-85f1-bc4f399c679a.png)
### Chart created by chart.js library
![image](https://user-images.githubusercontent.com/79703007/222826720-b2a75881-83ef-4a9e-8c7e-257632be773c.png)
### Buy Modal
![image](https://user-images.githubusercontent.com/79703007/222827054-ffecedeb-ca6b-47ac-a019-e11232bd4f91.png)
### Table with owned coins
![image](https://user-images.githubusercontent.com/79703007/222827137-d1ac2a90-8bde-4c43-8147-b4b0808e3c35.png)

## If you want to see more you have to 👉 try it on your own

