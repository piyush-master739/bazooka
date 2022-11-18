import { useEffect, useState, useRef } from "react";

import Head from "next/head";
import Link from "next/link";

import FinishModal from "../../components/FinishModal";

import { usePointsContext } from "../../context/context.js";

const iconPathArray = [
  "/static/icons/bitcoin.png",
  "/static/icons/ethereum.png",
  "/static/icons/rose.png",
  "/static/icons/dollar-symbol.png",
  "/static/icons/euro.png",
  "/static/icons/pound-sterling.png",
];

const LevelTwo = () => {
  /*
  ===========
  STATE HOOKS
  ===========
  */

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

  /*
  =======
  CONTEXT
  =======
  */

  const { points, updatePoints } = usePointsContext();

  /*
  ============
  EFFECT HOOKS
  ============
  */

  useEffect(() => {
    if (isGameOn) {
      intervalRef.current = setInterval(spawnTarget, 1250);
    }

    return () => clearInterval(intervalRef.current);
  }, [isGameOn]);

  useEffect(() => {
    if (isCountdownOn) {
      countdownTimerRef.current = setInterval(checkCountdown, 1000);
    }

    return () => clearInterval(countdownTimerRef.current);
  }, [isCountdownOn]);

  // USING REF HOOKS TO MAKE UPDATED STATE VALUE WORK INSIDE CALLBACK FUNCTION OF SETINTERVAL
  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  useEffect(() => {
    pointsEarnedRef.current = pointsEarned;
  }, [pointsEarned]);

  /*
  =========
  REF HOOKS
  =========
  */

  const containerRef = useRef();
  const intervalRef = useRef();

  // USING REF HOOKS TO MAKE UPDATED STATE VALUE WORK INSIDE CALLBACK FUNCTION OF SETINTERVAL
  const countdownTimerRef = useRef();
  const countdownRef = useRef();
  const pointsEarnedRef = useRef();

  /*
  =========
  FUNCTIONS
  =========
  */

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
    if (targetSpecs.isCrypto) setPointsEarned((prev) => prev + 2);
    else {
      if (pointsEarned > 0) setPointsEarned((prev) => prev - 2);
    }
  };

  const checkCountdown = () => {
    if (countdownRef.current > 0) {
      setCountdown((prev) => prev - 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    updatePoints(points + pointsEarnedRef.current);
    setIsGameOn(false);
    setIsTargetOn(false);
    setIsCountdownOn(false);
    setIsGameFinished(true);
  };

  /*
  ======
  RETURN
  ======
  */

  return (
    <main>
      <Head>
        <title>Level Two | Crypto Shooter</title>
        <meta
          name="description"
          content="Level Two of the game Crypto Shooter"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="game-header">
        {!isGameOn && !isGameFinished && (
          <Link href="/">
            <a className="logo">Crypto Shooter</a>
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

      <div ref={containerRef} className="game-container">
        {isTargetOn && (
          <img
            style={targetSpecs.position}
            src={targetSpecs.iconPath}
            alt="target"
            className="target"
            onClick={hitTarget}
            draggable="false"
          />
        )}
      </div>

      {/*THIS IS FOR EMULATING THE EFFECTS OF PRE-CACHING
      THE IMAGES WERE LAGGING DUE TO CONSTANT RE-DOWNLOADING OF EVERY NEW IMAGE
      NOT THE CLEANEST CODE, BUT IT DOES THE JOB  */}
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

export default LevelTwo;
