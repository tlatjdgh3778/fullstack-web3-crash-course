"use client";

import { useMemo, useState } from "react";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal, formatTokenAmount } from "@/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function AirdropForm() {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  
  // 로컬스토리지를 사용한 상태 관리
  const [tokenAddress, setTokenAddress] = useLocalStorage<string>("airdrop_tokenAddress", "");
  const [recipients, setRecipients] = useLocalStorage<string>("airdrop_recipients", "");
  const [amounts, setAmounts] = useLocalStorage<string>("airdrop_amounts", "");

  const { data: tokenData, isLoading: isTokenDataLoading } = useReadContracts({
    contracts: tokenAddress && tokenAddress.length === 42 ? [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "symbol",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
      },
    ] : undefined,
  });

  const total: number = useMemo(() => calculateTotal(amounts), [amounts])
  
  const getApprovedAmount = async (tSenderAddress: string | null): Promise<number> => {
    if (!tSenderAddress) {
        alert("TSender 주소를 찾을 수 없습니다.");
        return 0;
    }
    const response = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'allowance',
        args: [account.address, tSenderAddress as `0x${string}`],
    });
    // => token.allowance(account.address, tSenderAddress)
    return response as number;
  }

  // 폼 초기화 함수 추가
  const clearForm = () => {
    setTokenAddress("");
    setRecipients("");
    setAmounts("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(`전송 버튼 클릭`);
    e.preventDefault();
    
    try {
      // 1a.  이미 허가했다면 이 단계 건너뛰기
      // 1b. TSender 컨트랙트가 내 토큰을 대신 보낼 수 있도록 허가
      // 2. TSender의 에어드롭 함수 호출 (실제 토큰 전송)
      // 3. 블록체인에서 거래가 완료될 때까지 대기

      const tSenderAddress = chainsToTSender[chainId]['tsender'];
      const approvedAmount = await getApprovedAmount(tSenderAddress);
      console.log(`approvedAmount: ${approvedAmount}`);
      
      if(approvedAmount < total) {
          const approvalHash = await writeContractAsync({
              abi: erc20Abi,
              address: tokenAddress as `0x${string}`,
              functionName: 'approve',
              args: [tSenderAddress as `0x${string}`, BigInt(total)],
          });
          console.log(`approvalHash: ${approvalHash}`);
          const approvalReceipt = await waitForTransactionReceipt(config, {
              hash: approvalHash
          });
          console.log("approvalReceipt", approvalReceipt);

          await writeContractAsync({
              abi: tsenderAbi,
              address: tSenderAddress as `0x${string}`,
              functionName: 'airdropERC20',
              args: [
                  tokenAddress,
                  // Comma or new line separated
                  recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                  amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                  BigInt(total),
              ],
          })
      }else {
          await writeContractAsync({
              abi: tsenderAbi,
              address: tSenderAddress as `0x${string}`,
              functionName: 'airdropERC20',
              args: [
                  tokenAddress,
                  // Comma or new line separated
                  recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                  amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                  BigInt(total),
              ],
          })
      }
      
      // 성공 시 폼 초기화 (선택사항)
      alert("에어드롭이 성공적으로 완료되었습니다!");
      // clearForm(); // 원한다면 주석 해제
      
    } catch (error) {
      console.error("handleSubmit error:", error);
      alert("거래 실행 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            ERC20 토큰 에어드롭
          </h2>
          {/* 폼 초기화 버튼 추가 */}
          <button
            type="button"
            onClick={clearForm}
            className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-md transition-colors"
          >
            폼 초기화
          </button>
        </div>
        <p className="text-gray-600">
          토큰 주소, 수신자 목록, 그리고 각 수신자별 금액을 입력하세요.
          <span className="text-sm text-blue-600 ml-2">💾 입력한 데이터는 자동으로 저장됩니다</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="토큰 주소 (Token Address)"
          placeholder="ERC20 토큰 컨트랙트 주소를 입력하세요 (예: 0x...)"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          type="text"
        />

        <InputField
          label="수신자 목록 (Recipients)"
          placeholder={`수신자 주소들을 한 줄씩 입력하세요
0x742d35Cc6634C0532925a3b8D98e5d8d2D8b0f8e
0x8ba1f109551bD432803012645Hac136c86d8c7b2`}
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          large={true}
        />

        <InputField
          label="금액 목록 (Amounts)"
          placeholder={`각 수신자별 토큰 금액을 한 줄씩 입력하세요
100
250
50`}
          value={amounts}
          onChange={(e) => setAmounts(e.target.value)}
          large={true}
        />

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
            트랜잭션 상세
            </h3>
            
            <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">토큰 이름: </span>
                <span className="text-gray-900 font-semibold">Mock Token</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Amount (wei):</span>
                <span className="text-gray-900 font-mono">
                {total}
                </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Amount (tokens): </span>
                <span className="text-gray-900 font-semibold">
                {formatTokenAmount(total, tokenData?.[0]?.result as number)}
                </span>
            </div>
            </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!account.isConnected || isPending || !tokenAddress.trim() || !recipients.trim() || !amounts.trim()}
            className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              !account.isConnected || isPending || !tokenAddress.trim() || !recipients.trim() || !amounts.trim()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isPending ? (
              <>
                {/* 로딩 스피너 */}
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>처리 중...</span>
              </>
            ) : !account.isConnected ? (
              <span>지갑을 연결해주세요</span>
            ) : (
              <>
                <span>토큰 전송하기</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">사용법 안내</p>
            <ul className="space-y-1 text-blue-700">
              <li>• 토큰 주소는 유효한 ERC20 컨트랙트 주소여야 합니다</li>
              <li>• 수신자와 금액의 개수는 일치해야 합니다</li>
              <li>• 충분한 토큰 잔고와 가스비를 확인하세요</li>
            </ul>
          </div>
        </div>
      </div>

      
    </div>
  );
}