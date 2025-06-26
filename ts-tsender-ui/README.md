
1. Create a basic React/NextJS app 
2. Connect our wallet, with a nicer connect ([wagmi](https://wagmi.sh/), [rainbowkit](https://www.rainbowkit.com/))
3. Implement this function

[airdropERC20](https://github.com/Cyfrin/TSender/blob/main/src/reference/TSenderReference.sol)

```solidity
    function airdropERC20(
        address tokenAddress, // ERC20  토큰 주소
        address[] calldata recipients, // 토큰을 받을 주소 목록
        uint256[] calldata amounts, // 토큰을 받을 금액 목록
        uint256 totalAmount // 총 토큰 금액
    )

    // 에어드롭 될 ERC20 토큰주소 목록, 수신자, 금액 목록, 총액 
```
4. Deploy to [Fleek](https://fleek.xyz/)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
