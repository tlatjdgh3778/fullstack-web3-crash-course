import { 
    defineChain, 
    createPublicClient, 
    createWalletClient, 
    custom, 
    parseEther, 
    formatEther,
    type Chain,
    type WalletClient,
    type PublicClient,
    type Address
  } from 'viem';
  import "viem/window";
  
  import { contractAddress, abi } from './constants-ts';
  
  // DOM 요소 타입 정의
  const connectWalletButton = document.getElementById("connect-wallet-button") as HTMLButtonElement;
  const getBalanceButton = document.getElementById("balance-button") as HTMLButtonElement;
  const withdrawButton = document.getElementById("withdraw-button") as HTMLButtonElement;
  const connectedWalletAddressesList = document.getElementById("connected-wallet-addresses") as HTMLUListElement;
  const fundButton = document.getElementById("fund-button") as HTMLButtonElement;
  const ethAmountInput = document.getElementById("eth-amount") as HTMLInputElement;
  
  // 전역 변수 타입 정의
  let walletClient: WalletClient | undefined;
  let publicClient: PublicClient | undefined;
  
  /**
   * 지갑 연결
   */
  const connectWallet = async (): Promise<void> => {
      console.log("connectWallet");
      if (typeof window.ethereum !== "undefined") {
          walletClient = createWalletClient({
              transport: custom(window.ethereum)
          });
          console.log(walletClient);
  
          const connectedWalletAddresses: Address[] = await walletClient.requestAddresses();
          connectedWalletAddresses.forEach((address: Address) => {
              const li = document.createElement("li");
              li.innerHTML = address;
              connectedWalletAddressesList.appendChild(li);
          });
          
          connectWalletButton.innerHTML = "Connected";
      } else {
          connectWalletButton.innerHTML = "Please Install Metamask";
      }
  };
  
  /**
   * 펀딩
   */
  const fund = async (): Promise<void> => {
      const ethAmount: string = ethAmountInput.value;
      console.log(`funding with ${ethAmount} ETH`);
  
      if (typeof window.ethereum !== "undefined") {
          walletClient = createWalletClient({
              transport: custom(window.ethereum)
          });
          publicClient = createPublicClient({
              transport: custom(window.ethereum)
          });
  
          const [connectedWalletAddress]: Address[] = await walletClient.requestAddresses();
          const currentChain: Chain = await getCurrentChain(publicClient);
          
          try {
              // 시뮬레이션 테스트
              const { request } = await publicClient.simulateContract({
                  address: contractAddress,
                  abi,
                  functionName: "fund",
                  account: connectedWalletAddress,
                  chain: currentChain,
                  value: parseEther(ethAmount),
              });
  
              console.log(request);
              
              // 실제 fund 함수 호출
              const txHash: `0x${string}` = await walletClient.writeContract(request);
              console.log(txHash);
          } catch (error) {
              console.error("Fund transaction failed:", error);
          }
      } else {
          connectWalletButton.innerHTML = "Please Install Metamask";
      }
  };
  
  /**
   * 잔액 조회
   */
  const getBalance = async (): Promise<void> => {
      if (typeof window.ethereum !== "undefined") {
          publicClient = createPublicClient({
              transport: custom(window.ethereum)
          });
  
          try {
              const balance: bigint = await publicClient.getBalance({
                  address: contractAddress,
              });
  
              console.log(formatEther(balance));
          } catch (error) {
              console.error("Failed to get balance:", error);
          }
      }
  };
  
  /**
   * 출금
   */
  const withdraw = async (): Promise<void> => {
      console.log(`Withdrawing...`);
    
      if (typeof window.ethereum !== "undefined") {
          try {
              walletClient = createWalletClient({
                  transport: custom(window.ethereum),
              });
              publicClient = createPublicClient({
                  transport: custom(window.ethereum),
              });
              
              const [account]: Address[] = await walletClient.requestAddresses();
              const currentChain: Chain = await getCurrentChain(publicClient);
    
              console.log("Processing transaction...");
              const { request } = await publicClient.simulateContract({
                  account,
                  address: contractAddress,
                  abi,
                  functionName: "withdraw",
                  chain: currentChain,
              });
              
              const hash: `0x${string}` = await walletClient.writeContract(request);
              console.log("Transaction processed: ", hash);
          } catch (error) {
              console.error("Withdraw failed:", error);
          }
      } else {
          withdrawButton.innerHTML = "Please install MetaMask";
      }
  };
  
  /**
   * 현재 체인 정보 가져오기
   */
  const getCurrentChain = async (client: PublicClient | WalletClient): Promise<Chain> => {
      console.log("getCurrentChain");
      console.log(client);
      
      const chainId: number = await client.getChainId();
      const currentChain: Chain = defineChain({
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
      });
      
      return currentChain;
  };
  
  // 이벤트 리스너 등록
  connectWalletButton.addEventListener("click", connectWallet);
  fundButton.addEventListener("click", fund);
  getBalanceButton.addEventListener("click", getBalance);
  withdrawButton.addEventListener("click", withdraw);