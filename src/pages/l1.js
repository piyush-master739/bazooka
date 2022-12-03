import { useEffect, useState, useRef } from "react";

import Head from "next/head";
import Link from "next/link";

import FinishModal from "../../components/FinishModal";

import { usePointsContext } from "../../context/context.js";

const iconPathArray = [
  "/static/icons/pound-sterling.png",
];

const L1 = () => {
  const [isGameOn, setIsGameOn] = useState(false);
  const [isTargetOn, setIsTargetOn] = useState(false);
  const [targetSpecs, setTargetSpecs] = useState({
    iconPath: "/static/icons/bitcoin.png",

    isCrypto: true,
    position: null,
  });
  const [countdown, setCountdown] = useState(30);
  const [isCountdownOn, setIsCountdownOn] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const { points, updatePoints } = usePointsContext();
  const containerRef = useRef();
  const intervalRef = useRef();

  // USING REF HOOKS TO MAKE UPDATED STATE VALUE WORK INSIDE CALLBACK FUNCTION OF SETINTERVAL
  const countdownTimerRef = useRef();
  const countdownRef = useRef();
  const pointsEarnedRef = useRef();

  useEffect(() => {
    if (isCountdownOn) {
      countdownTimerRef.current = setInterval(checkCountdown, 1000);
    }

    return () => clearInterval(countdownTimerRef.current);
  }, [isCountdownOn]);
  useEffect(() => {
    if (isGameOn) {
      intervalRef.current = setInterval(spawnTarget, 1500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isGameOn]);
  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);
  useEffect(() => {
    pointsEarnedRef.current = pointsEarned;
  }, [pointsEarned]);

  const startGame = () => {
    setIsGameOn(true);
    setIsTargetOn(true);
    setIsCountdownOn(true);
  };

  const spawnTarget = () => {
    const containerHeight = containerRef.current.offsetHeight;
    const containerWidth = containerRef.current.offsetWidth;

    const randomTop = Math.random() * (containerHeight - 300);
    const randomLeft = Math.random() * (containerWidth - 200);

    const iconIndex = Math.floor(Math.random() * 6);

    const targetIcon = iconPathArray[iconIndex];

    setTargetSpecs({
      iconPath: targetIcon,
      isCrypto: iconIndex <= 2,
      position: { top: randomTop + "px", left: randomLeft + "px" },
    });

    setIsTargetOn(true);
  };

  const hitTarget = () => {
    setIsTargetOn(false);
    if (targetSpecs.isCrypto) setPointsEarned((prev) => prev + 1);
    else {
      if (pointsEarned > 0) setPointsEarned((prev) => prev - 1);
    }
  };

  const countdown =  () => {
    if (countdownRef.current > 0) {
      setCountdown((prev) => prev - 1);
    } else {
      finishGame();
    }
  };
  return (
    <main>
      <Head>
        <title>Level One | Crypto Shooter</title>
        <meta
          name="description"
          content="Level One of the game Crypto Shooter"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="game-header">
        {!isGameOn && !isGameFinished && (
          <Link href="/">
            <a className="logo">CRYPTO SHOOTER</a>
          </Link>
        )}

        <h3>Points earned: {pointsEarned}</h3>
        <h3>{countdown} seconds remain</h3>
      </header>

      {!isGameOn && !isGameFinished && (
        <div className="start-btn-container">
          <button className="start-btn" onClick={startGame}>
            Start
          </button>
        </div>
      )}

      <div style={{ display: "none" }}>
        <img
          src="/static/icons/bitcoin.png"
          alt="false image"
          className="target"
        />
        <img
          src="/static/icons/ethereum.png"
          alt="false image"
          className="target"
        />
        <img
          src="/static/icons/rose.png"
          alt="false image"
          className="target"
        />
        <img
          src="/static/icons/dollar-symbol.png"
          alt="false image"
          className="target"
        />
        <img
          src="/static/icons/euro.png"
          alt="false image"
          className="target"
        />
        <img
          src="/static/icons/pound-sterling.png"
          alt="false image"
          className="target"
        />
      </div>

      {isGameFinished && <FinishModal pointsEarned={pointsEarned} />}
    </main>
  );
};

export default LevelOne;
