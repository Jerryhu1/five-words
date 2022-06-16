import React from "react";
import { AppState } from "../../";
import useWebSocket from "../../hooks/useWebsocket";
import { useAppSelector } from "../../store/hooks";
import { startRound } from "../../../message/types";

type Props = {};

const WordCard: React.FC<Props> = () => {
  const card = useAppSelector((state: AppState) => state.room.currentCard);
  const roomName = useAppSelector((state: AppState) => state.room.name);
  const isExplainer = useAppSelector(
    (state: AppState) => state.session.sessionID === state.room.currExplainer
  );
  const { sendMessage } = useWebSocket(true);

  const submit = () => {
    // TODO: These settings should not need to be passed for each round, settings have to be persisted
    sendMessage(
      startRound({ countdownTime: 3, roomName: roomName, roundTime: 30 })
    );
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
          onClick={submit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default WordCard;
