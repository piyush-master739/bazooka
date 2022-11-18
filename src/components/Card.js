import Link from "next/link";

const Card = ({ destination, level, modeName, description, img }) => {
  return (
    <Link href={destination}>
      <a className="card">
        <img src={img} alt="game mode image" className="card__img" />
        <div className="card__text">
          <h3 className="card__level">Level {level}</h3>
          <h4 className="card__name">{modeName}</h4>
          <p className="card__desc">{description}</p>
        </div>
      </a>
    </Link>
  );
};

export default Card;
