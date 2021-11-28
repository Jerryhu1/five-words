import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../";
import { startRound } from "../../store/room/actions";

type Props = {};

const WordCard: React.FC<Props> = () => {
  const card = useSelector((state: AppState) => state.room.currentCard);
  const roomName = useSelector((state: AppState) => state.room.name);
  const roundDone = useSelector((state: AppState) => state.room.timer === 0);
  const isExplainer = useSelector(
    (state: AppState) => state.session.sessionID === state.room.currExplainer
  );
  const dispatch = useDispatch();
  const submit = () => {
    // TODO: These settings should not need to be passed for each round, settings have to be persisted
    dispatch(startRound(roomName, 3, 30));
  };

  return (
    <div className="flex flex-col bg-blue rounded-md shadow-md w-3/4 p-8 text-center">
      {card && (
        <div className="flex flex-col justify-between h-full gap-4">
          {card.words &&
            card.words.map((word, i) => (
              <div key={i}>
                <span
                  className="f font-medium text-2xl uppercase"
                  style={{ textDecoration: word.correct ? "line-through" : "" }}
                >
                  {word.text}
                </span>
              </div>
            ))}
        </div>
      )}
      {isExplainer && (
        <button
          className="bg-purple-300 rounded w-max p-2 text-white self-center"
          onClick={(_) => submit()}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default WordCard;
