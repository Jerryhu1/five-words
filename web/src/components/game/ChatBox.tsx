import React, { FormEvent, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import useWebSocket from "../../../hooks/useWebsocket";
import { chatMessage } from "../../../message/types";

const ChatBox = () => {
  const [inputText, setInputText] = React.useState(() => {
    return "";
  });
  const roomName = useAppSelector(state => state.room.name);
  const { sessionID, activePlayer } = useAppSelector(state => state.session);
  const { messages } = useAppSelector(state => state.chat);
  const { sendMessage } = useWebSocket(true);

  const onSubmit = (e: MouseEvent | FormEvent) => {
    if (inputText === "") {
      return;
    }
    e.preventDefault();
    sendMessage(
      chatMessage({
        playerID: sessionID,
        playerName: activePlayer,
        roomName: roomName,
        text: inputText,
      })
    );
    console.log("test");
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
              onChange={e => setInputText(e.target.value)}
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

export default ChatBox;
