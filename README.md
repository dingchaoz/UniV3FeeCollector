## Table of content

- [Setup](#Setup)
    - [Installation](#Installation)
    - [Environemnt file setup](#Env)
    - [Start server](#Server-start)
    - [Enter fee collection request](#Enter-request)
    - [Demo](#Demo)
    - [Test](#Test)

This repo is a simple and quick implementation of querying collected fees on Uniswap V3 pools from a given pool with a given price range and time window, user can enter the request information in a prompt window on terminal, and the server will query historic logs from Ethereum mainnet, filter them and aggregate collected fees represented in base token and quote token. 

Alchemy node provider is used to call getLogs and to filter only `Collect` events emitted from the specified pool
and from the starting and ending block, as well as in the specified ticks range.


## Setup

- ### Installation
    If you do no have node.js and npm installed, first get these two installed following this [instruction](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac), then cd to the directory and run the following installation
    `npm install`
- ### Env
    Copy `.env.example` and save it into `.env`, and add your ALCHEMY_KEY from Ethereuem mainnet app 
- ### Server-start
    `npm run dev`
- ### Enter-request
    The terminal will prompt and ask user to enter the following information
    ```
      prompt('Enter a pool address to check collected fees: ')
      prompt('Enter the lower price for the collected fees liquidity range : ')
      prompt('Enter upper price for the collected fees liquidity range: ')
      prompt('Enter start time in epoch unix time for the collected fees time window: ')
      prompt('Enter end time in epoch unix time for the collected fees time window : ')
    ```
    example values to be entered: 

    ```
        pool : 0xCBCdF9626bC03E24f779434178A73a0B4bad62eD // WBTC-WETH
        priceLower: 10
        priceUpper: 15
        startTime = 1664739963
        endTime = 1664808363

    ```
    
- ### Demo
    ![demo](https://raw.githubusercontent.com/dingchaoz/UniV3FeeCollector/functionImp/output.gif)

- ### Test

    `npm run test`

    Tests are added to verify the correction of price to tick conversion, as well as uniswap v3 sdk functionality

