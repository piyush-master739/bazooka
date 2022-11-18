import Head from "next/head";
import Link from "next/link";

import { usePointsContext } from "../context/context";
import { useEffect } from "react";

import Card from "../components/Card";

import { contractAddress, contractABI } from "../abi/contract";

import { ethers } from "ethers";

import axios from "axios";

import {
  useAccountContext,
  checkIfWalletIsConnected,
  connectWallet,
} from "../context/accountContext";

export default function Home() {
  /*
  ==================
  CONTEXT AND EFFECT
  ==================
  */

  const { points, updatePoints } = usePointsContext();

  const [accountState, accountDispatch] = useAccountContext();

  useEffect(() => {
    checkIfWalletIsConnected(accountDispatch);
  }, []);

  /*
  =========
  FUNCTIONS
  =========
  */

  async function insertTransaction(
    transactionID,
    tokenToClaim,
    transactionType,
    from,
    to,
    game,
    date
  ) {
    const newTransaction = {
      transactionId: transactionID,
      date: date,
      transactionType: transactionType,
      from: from,
      to: to,
      game: game,
      tokenToClaim: tokenToClaim,
    };

    axios.post("http://localhost:3001/makeTransaction", newTransaction);
  }

  // Button text
  let buttonText;

  if (accountState.metamaskNotFound) {
    buttonText = "Please install metamask";
  } else if (accountState.isAppDisabled) {
    buttonText = "Switch Network";
  } else {
    buttonText = "Connect Wallet";
  }

  const claimbazooka = async () => {
    try {
      const { ethereum } = window;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tokenToClaim = points / 25000;

      let transaction = await connectedContract.claimbazooka(
        ethers.utils.parseUnits(tokenToClaim.toString(), "ether")
      );

      /*
      ==============================================
      VARIABLES THAT SHOULD BE INSERTED TO
      DATABASE ALONG WITH tokenToClaim WHICH'S ABOVE
      ==============================================
      */

      const transactionType = "Reward";

      const transactionID = transaction.hash;

      // I'm confused about this, transaction.to seems to be the address Dominic provided,
      // and transaction.from is my wallet address, isn't it supposed to be the other way around?
      // For now, I'm switching them up, please correct any mistakes
      const from = transaction.to;
      const to = transaction.from;

      const game = "Crypto Shooter";

      const d = new Date();
      const date = d.toLocaleDateString() + "-" + d.toLocaleTimeString();

      await transaction.wait();

      insertTransaction(
        transactionID,
        tokenToClaim,
        transactionType,
        from,
        to,
        game,
        date
      );

      const consoleMsg =
        "**********************************\n" +
        "\nTransaction ID: " +
        transactionID +
        "\n\nFrom: " +
        from +
        "\n\nTo: " +
        to +
        "\n\nTransaction Type: " +
        transactionType +
        "\n\nbazooka Amount: " +
        tokenToClaim +
        "\n\nGame: " +
        game +
        "\n\nDate: " +
        date +
        "\n\n**********************************";

      /*
      ===================================================
      INSERT THE FOLLOWING DATA TO THE TRANSACTIONS TABLE

      string transactionID

      double tokenToClaim: Amount of bazooka tokens claimed
      
      string transactionType: Type of transaction processed

      string from: User wallet address

      string to: Wallet address from which bazooka is withdrawn 

      string game: The game in which the bazooka is earned

      string date: Local date and time of transaction
      ===================================================
      */

      updatePoints(0);

      console.log(transaction);
      console.log(consoleMsg);
    } catch (error) {
      console.log(error);
    }
  };

  /*
  ======
  RETURN
  ======
  */

  return (
    <>
      <Head>
        <title>Bazooka</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h2>Game Points: {points}</h2>
        <div className="conversion">
          <div className="conversion__btn-container">
            <button
              className="conversion__wallet-btn"
              onClick={() => connectWallet(accountDispatch)}
            >
              {accountState.account
                ? `${formatAccount(accountState?.account.address)} | $ROSE : ${
                    accountState?.account.balance
                  }`
                : buttonText}
            </button>
            <button className="conversion__btn" onClick={claimbazooka}>
              Convert Game <br /> Points
            </button>
          </div>
          <p className="conversion__exchange-info">
          </p>
        </div>
      </header>

      <h1 className="title">CRYPTO SHOOTER</h1>

      <div className="btn-container">
        <Card
          destination={"/game-modes/level-one"}
          level={1}
          modeName={"Spot Trader"}
          description={"Win/Lose 1 points per hit"}
          img={"/static/images/Level 1 - Spot Trader.png"}
        />
        <Card
          destination={"/game-modes/level-two"}
          level={2}
          modeName={"Leverage Trader"}
          description={"Win/Lose 2 points per hit"}
          img={"/static/images/Level 2 - Leverage Trader.png"}
        />
        <Card
          destination={"/game-modes/level-three"}
          level={3}
          modeName={"HODLer"}
          description={"Win/Lose 3 points per hit"}
          img={"/static/images/Level 3 - Hodler.png"}
        />
        <Card
          destination={"/game-modes/level-four"}
          level={4}
          modeName={"Developer"}
          description={"Win/Lose 4 points per hit"}
          img={"/static/images/Level 4 - Developer.png"}
        />
        <Card
          destination={"/game-modes/level-five"}
          level={5}
          modeName={"Satoshi"}
          description={"Win/Lose 5 points per hit"}
          img={"/static/images/Level 5 - Satoshi.png"}
        />
      </div>

      <div className="guide">
        <h2 className="guide__title">How to Play</h2>
        <p className="guide__para">
          If you hit cryptocurrencies, you win Game Points
        </p>
        <p className="guide__para">
          If you hit fiat money, you lose Game Points earned in the same round
        </p>
      </div>
      <footer>
        <div className="attribution">
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik">Freepik</a>,{" "}
          <a href="https://www.flaticon.com/authors/blak1ta">Blak1ta</a> from{" "}
          <a href="https://www.flaticon.com/">Flaticon</a>
        </div>
      </footer>
    </>
  );
}

export const formatAccount = (str) =>
  str && str.substr(0, 5) + "..." + str.substr(str.length - 5, str.length);
