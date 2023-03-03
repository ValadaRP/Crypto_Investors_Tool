// https://eth-goerli.g.alchemy.com/v2/YNe0_-dTyyyMtw6g5zRQE21DZHiCUgRG

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli:{
      url:'https://eth-goerli.g.alchemy.com/v2/YNe0_-dTyyyMtw6g5zRQE21DZHiCUgRG',
      accounts: ['c6d7d68a9f6b26ecbccc23c710e7e9d9a5bf5041edd1255077e316ae94f2cdd4']
    }
  }
}