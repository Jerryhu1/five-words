import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "..";
import WordRow from "./WordRow";
import { startTimer } from "../store/timer/action";
import { Card } from "../store/card/type";
type Props = {
  card?: Card;
  showWords?: boolean;
  isSelectMode?: boolean;
};

type Dispatchers = {
  startTimer: () => {};
};

const submit = () => {};

const WordCard: React.FC<Props & Dispatchers> = ({
  card,
  showWords,
  startTimer,
  isSelectMode,
}) => {
  return (
    <>
      {!card ? null : (
        <ul>
          {showWords &&
            card.words.map((word, i) => (
              <li key={i}>
                <WordRow
                  index={i}
                  word={word}
                  canCheck={!isSelectMode ? false : isSelectMode}
                />
              </li>
            ))}
        </ul>
      )}
      {!isSelectMode ? (
        <button onClick={startTimer}>Start</button>
      ) : (
        <button onClick={submit}>Submit</button>
      )}
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  card: state.card.currentCard,
  showWords: state.card.showWords,
  isSelectMode: state.card.isSelectMode,
});

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({
  startTimer: () => dispatch(startTimer()),
});

export default connect(mapStateToProps, mapStateToDispatchers)(WordCard);
