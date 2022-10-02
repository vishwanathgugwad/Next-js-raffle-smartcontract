import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { contractAddresess, abi } from "../constants"
import { Bell, useNotification } from "web3uikit"
import { ethers, BigNumber } from "ethers"
import { resolve } from "styled-jsx/css"

export default function LotteryEnterance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresess ? contractAddresess[chainId][0] : null
    // Declare a new state variable
    const [enteranceFee, setEnteranceFee] = useState("")
    const [numPlayers, setNumPlayers] = useState("")
    const [recentWinner, setRecentWinner] = useState("")

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: enteranceFee,
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const dispatch = useNotification()
    const { runContractFunction: getEnterenceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEnterenceFee",
        params: {},
    })

    async function updateUI() {
        const entrenceFeeFromCall = (await getEnterenceFee()).toString()
        const numPlayers = (await getNumberOfPlayers()).toString()
        const recentWinner = await getRecentWinner()
        setRecentWinner(recentWinner)
        setNumPlayers(numPlayers)
        setEnteranceFee(entrenceFeeFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        await updateUI()
    }
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Transaction Notification",
            icon: Bell,
            position: "topR",
        })
    }
    new Promise(async (resolve, reject) => {})
    return (
        <div className="p-5">
            Hi from lottery entrance!
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () => {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        "Enter Raffle"
                    )}
                </button>
            </div>
            {raffleAddress ? (
                <div>
                    <div> Lottery Enterance Enterence Fee : {enteranceFee} ETH </div>
                    <div> Players : {numPlayers}</div>
                    <div> RecentWinner : {recentWinner}</div>
                </div>
            ) : (
                <div> No Raffle Address detected</div>
            )}
        </div>
    )
}
