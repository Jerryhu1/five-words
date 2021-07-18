import React, {FormEvent} from "react";
import {AppState} from "../..";
import {Message} from "../../store/chat/types";
import {sendMessage} from "../../store/chat/actions";
import {connect} from "react-redux";

type Props = {
  roomName?: string
  messages?: Message[]
  sessionID?: string,
  playerName?: string
}

const dispatchProps = {
  sendMessage: sendMessage
}

const ChatBox: React.FC<Props & typeof dispatchProps> = ({
  roomName,
   messages,
   sendMessage,
   sessionID,
  playerName
  }) => {
  const [inputText, setInputText] = React.useState("")

  const onSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault()
    sendMessage(roomName ?? "", inputText, sessionID ?? "", playerName ?? "")
    setInputText("")
  }

  console.log(sessionID)

  return (
    <>
      <h2>Chatbox</h2>
      <div id="chatbox-container">
        <div id="chatbox-screen">
          {
            messages?.map((i, v) =>
              (
                <li key={v}>
                  [{i.timestamp}] {i.playerName}: {i.text}
                </li>
              ))
          }
        </div>
        <div id="chatbox-input">
          <form onSubmit={onSubmit}>
            <input type="text"
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}>
            </input>
            <button type="button" onClick={onSubmit}>Send
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state: AppState, _: Props) => {
  return ({
  roomName: state.room.name,
  messages: state.chat.messages,
  sessionID: state.session.sessionID,
  playerName: state.session.activePlayer
  })
}

export default connect(mapStateToProps, dispatchProps)(ChatBox)