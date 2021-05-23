import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "../../";
import WordRow from "./WordRow";
import { Card } from "../../store/card/type";
type Props = {
  card?: Card;
  isSelectMode?: boolean;
};

type Dispatchers = {
};

const submit = () => {};

const WordCard: React.FC<Props & Dispatchers> = ({
  card,
  isSelectMode,
}) => {
  return (
    <>
      <h3>Card</h3>
      {!card ? null : (
        <ul>
          {
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
      {
        <button onClick={submit}>Submit</button>
      }
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  card: state.room.currentCard,
  isSelectMode: state.card.isSelectMode,
});

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({
});

export default connect(mapStateToProps, mapStateToDispatchers)(WordCard);
