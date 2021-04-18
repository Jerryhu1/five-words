import React, { ChangeEvent } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { toggleWordCheck } from "../../store/card/action";
import { Word } from "../../store/card/type";
import { AppState } from "../..";

type Props = {
  index: number;
  word: Word;
  checked?: boolean;
  canCheck: boolean;
};

type Dispatchers = {
  toggleWordCheck: (index: number) => void;
};

const onWordClick = (i: number, onClicked: (i: number) => void) => {
  onClicked(i);
};

const WordRow: React.FC<Props & Dispatchers> = ({
  index,
  word,
  toggleWordCheck,
  checked,
  canCheck,
}) => {
  return (
    <>
      <span
        style={{ textDecoration: checked ? "line-through" : "" }}
        onClick={() => (canCheck ? onWordClick(index, toggleWordCheck) : {})}
      >
        {word.text}
      </span>
    </>
  );
};

const mapStateToProps = (state: AppState, ownProps: Props) => ({
  word: ownProps.word,
  index: ownProps.index,
  canClick: ownProps.canCheck,
  checked: state.card.currentCard.words[ownProps.index].correct,
});

const mapStateToDispatchers = (dispatch: Dispatch): Dispatchers => ({
  toggleWordCheck: (index: number) => {
    dispatch(toggleWordCheck(index));
  },
});

export default connect(mapStateToProps, mapStateToDispatchers)(WordRow);
