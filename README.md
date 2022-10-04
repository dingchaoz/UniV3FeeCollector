## Table of content

- [Setup](#Setup)
    - [Installation](#Installation)
    - [Environemnt file setup](#Env)
    - [Start server](#Server-start)
    - [Enter fee collection request](#Enter-request)
    - [Demo](#Demo)
    - [Test](#Test)


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
      const pool = prompt('Enter a pool address to check collected fees: ')
      const priceLower = prompt('Enter the lower price for the collected fees liquidity range : ')
      const priceUpper = prompt('Enter upper price for the collected fees liquidity range: ')
      const startTime = prompt('Enter start time for the collected fees time window: ')
      const endTime = prompt('Enter end timefor the collected fees time window : ')
    ```
    
- ### Test

    `npm run test`

