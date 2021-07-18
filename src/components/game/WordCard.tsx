import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../";
type Props = {};

const submit = () => {};

const WordCard: React.FC<Props> = () => {
  const card = useSelector((state: AppState) => state.room.currentCard);
  return (
    <>
      <h3>Card</h3>
      {card && (
        <ul>
          {card.words &&
            card.words.map((word, i) => (
              <li key={i}>
                <span
                  style={{ textDecoration: word.correct ? "line-through" : "" }}
                >
                  {word.text}
                </span>
              </li>
            ))}
        </ul>
      )}
      {<button onClick={submit}>Submit</button>}
    </>
  );
};

export default WordCard;
