import Head from "next/head"
import styles from "../styles/Home.module.css"
import AutoHeader from "../components/AutoHeader"
import LotteryEnterance from "../components/LotteryEnterance"

export default function Home() {
    const auto = "Decentralized Lottery"
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our smart contract lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AutoHeader auto={auto} />
            <LotteryEnterance className="p-8" />
        </div>
    )
}
