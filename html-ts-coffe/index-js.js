import { defineChain, createPublicClient,createWalletClient, custom, parseEther, formatEther } from 'https://esm.sh/viem'

import { contractAddress, abi } from './constants-js.js';

const connectWalletButton = document.getElementById("connect-wallet-button");
const getBalanceButton = document.getElementById("balance-button");
const withdrawButton = document.getElementById("withdraw-button");

const connectedWalletAddressesList = document.getElementById("connected-wallet-addresses");
const fundButton = document.getElementById("fund-button");
const ethAmountInput = document.getElementById("eth-amount");

let walletClient;
let publicClient;

/**
 * Connect Wallet
 */
const connectWallet = async () => {
    console.log("connectWallet");
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        console.log(walletClient);

        const connectedWalletAddresses = await walletClient.requestAddresses();
        connectedWalletAddresses.forEach((address) => {
            const li = document.createElement("li");
            li.innerHTML = address;
            connectedWalletAddressesList.appendChild(li);
        });
        
        connectWalletButton.innerHTML = "Connected";
    }else {
        connectWalletButton.innerHTML = "Please Install Metamask";
    }
};

/**
 * Fund
 */
const fund = async () => {
    const ethAmount = ethAmountInput.value;
    console.log(`funding with ${ethAmount} ETH`);

    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        const [connectedWalletAddress] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(publicClient);
        
        // simulation 테스트
        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi,
            functionName: "fund",
            account: connectedWalletAddress,
            chain: currentChain,
            value: parseEther(ethAmount),
        })

        console.log(request)
        
        // 실제 fund 함수 호출
        const tx_hash = await walletClient.writeContract(request)
        console.log(tx_hash)
    
    }else {
        connectWalletButton.innerHTML = "Please Install Metamask";
    }
};

/**
 * Get Balance
 */
const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        const balance = await publicClient.getBalance({
            address: contractAddress,
        });

        console.log(formatEther(balance));
    }
}

/**
 * Withdraw
 */
async function withdraw() {
    console.log(`Withdrawing...`)
  
    if (typeof window.ethereum !== "undefined") {
      try {
        walletClient = createWalletClient({
          transport: custom(window.ethereum),
        })
        publicClient = createPublicClient({
          transport: custom(window.ethereum),
        })
        const [account] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)
  
        console.log("Processing transaction...")
        const { request } = await publicClient.simulateContract({
          account,
          address: contractAddress,
          abi,
          functionName: "withdraw",
          chain: currentChain,
        })
        const hash = await walletClient.writeContract(request)
        console.log("Transaction processed: ", hash)
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
  }
  

async function getCurrentChain(client) {
    console.log("getCurrentChain");
    console.log(client);
    
    const chainId = await client.getChainId()
    const currentChain = defineChain({
      id: chainId,
      name: "Custom Chain",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    })
    return currentChain
  }
  
        
connectWalletButton.addEventListener("click", connectWallet);
fundButton.addEventListener("click", fund);
getBalanceButton.addEventListener("click", getBalance);
withdrawButton.addEventListener("click", withdraw);

