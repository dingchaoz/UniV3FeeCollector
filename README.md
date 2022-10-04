## Table of content

- [Setup](#Setup)
    - [Installation](#Installation)
    - [Environemnt file setup](#Env)
    - [Start server](#Server-start)
    - [Enter fee collection request](#Enter-request)
    - [Demo](#Demo)
    - [Test](#Test)

This repo is a simple and quick implementation of querying collected fees on Uniswap V3 pools from a given pool with a given price range and time window, user can enter the request information in a prompt window on terminal, and the server will query historic logs from Ethereum mainnet, filter them and aggregate collected fees represented in base token and quote token. 

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
    
- ### Demo
    ![demo](https://raw.githubusercontent.com/dingchaoz/UniV3FeeCollector/functionImp/output.gif)
- ### Test

    `npm run test`

