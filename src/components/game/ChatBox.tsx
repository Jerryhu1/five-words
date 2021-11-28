import React, { FormEvent, useEffect } from "react";
import { AppState } from "../..";
import { Message } from "../../store/chat/types";
import { sendMessage } from "../../store/chat/actions";
import { connect } from "react-redux";

type Props = {
  roomName?: string;
  messages?: Message[];
  sessionID?: string;
  playerName?: string;
};

const dispatchProps = {
  sendMessage: sendMessage,
};

const ChatBox: React.FC<Props & typeof dispatchProps> = ({
  roomName,
  messages,
  sendMessage,
  sessionID,
  playerName,
}) => {
  const [inputText, setInputText] = React.useState("");

  const onSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    sendMessage(roomName ?? "", inputText, sessionID ?? "", playerName ?? "");
    setInputText("");
  };

  const chatBottom = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    chatBottom.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="rounded-xl flex flex-col h-full w-full bg-purple-2">
      <div className="p-2 border-b-2">
        <h2 className="font-bold">Chatbox</h2>
      </div>
      <div id="chatbox-container" className="flex h-full flex-col">
        <div
          id="chatbox-screen"
          className="flex flex-auto flex-col p-2 overflow-auto h-80"
        >
          <ul>
            {messages?.map((v, i) => (
              <li key={`${v.playerID}-${i}`}>
                <span
                  className={`${v.playerID === sessionID && "font-semibold"}`}
                >
                  {v.playerName}
                </span>
                : {v.text}
              </li>
            ))}
          </ul>
          <div ref={chatBottom} />
        </div>
        <div id="chatbox-input" className="flex border-t-2 mt-2 pt-2">
          <form
            onSubmit={onSubmit}
            className="flex w-full justify-items-stretch gap-1 p-2"
          >
            <input
              className="rounded border-gray-200 text-black"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="button"
              onClick={onSubmit}
              className="bg-green-400 p-2 rounded text-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState, _: Props) => {
  return {
    roomName: state.room.name,
    messages: state.chat.messages,
    sessionID: state.session.sessionID,
    playerName: state.session.activePlayer,
  };
};

export default connect(mapStateToProps, dispatchProps)(ChatBox);
