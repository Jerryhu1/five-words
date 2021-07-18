import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../";
import {startRound} from "../../store/room/actions";

type Props = {};


const WordCard: React.FC<Props> = () => {
  const card = useSelector((state: AppState) => state.room.currentCard);
  const roomName = useSelector((state: AppState) => state.room.name)
  const roundDone = useSelector((state: AppState) => state.room.timer === 0)
  const isExplainer = useSelector((state: AppState) =>
    state.session.sessionID === state.room.currExplainer)
  const dispatch = useDispatch()
  const submit = () => {
    // TODO: These settings should not need to be passed for each round, settings have to be persisted
    dispatch(startRound(roomName, 3, 30))
  };

  return (
    <>
      <h3>Card</h3>
      {card && (
        <ul>
          {card.words &&
          card.words.map((word, i) => (
            <li key={i}>
                <span
                  style={{textDecoration: word.correct ? "line-through" : ""}}
                >
                  {word.text}
                </span>
            </li>
          ))}
        </ul>
      )}
      {(roundDone && isExplainer) && <button onClick={_ => submit()}>Submit</button>}
    </>
  );
};

export default WordCard;
