"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AirdropForm from "./AirdropForm";

export default function HomeContent() {
    const { isConnected } = useAccount();
    
    if(isConnected) {
        return (
            <AirdropForm />
        )
    }
    
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200 text-center">
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    지갑을 연결해주세요
                </h2>
                <p className="text-gray-600 mb-6">
                    TSender를 사용하여 토큰 에어드롭을 시작하려면 지갑 연결이 필요합니다.
                </p>
                <ConnectButton />
            </div>
            
            <div className="text-sm text-gray-500 border-t pt-4">
                <p>💡 <strong>TSender</strong>는 가스비를 최대 90%까지 절약할 수 있는 에어드롭 플랫폼입니다</p>
            </div>
        </div>
    )
}