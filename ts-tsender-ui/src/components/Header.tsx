"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub, FaRocket } from "react-icons/fa"

export default function Header() {
    return (
        <nav className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* 로고 섹션 */}
                <div className="flex items-center gap-4">
                    <a href="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <FaRocket className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            TSender
                        </h1>
                    </a>
                    
                    {/* GitHub 링크 */}
                    <a
                        href="https://github.com/cyfrin/TSender"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-200 border border-gray-700 hover:border-gray-600 hover:scale-105"
                        title="GitHub Repository"
                    >
                        <FaGithub className="h-4 w-4 text-white" />
                    </a>
                </div>

                {/* 중앙 설명 텍스트 */}
                <div className="hidden lg:block">
                    <p className="text-gray-600 font-medium">
                        ⚡ 지구상에서 가장 가스 효율적인 에어드롭 컨트랙트
                        <span className="ml-2">🐎</span>
                    </p>
                </div>

                {/* 연결 버튼 */}
                <div className="flex items-center">
                    <ConnectButton />
                </div>
            </div>
        </nav>
    )
}