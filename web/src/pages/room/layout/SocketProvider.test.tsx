import useWebSocket, {ReadyState} from "react-use-websocket";
import {render, waitFor} from "@testing-library/react";
import SocketProvider from "./SocketProvider";
import * as useWebsocket from "react-use-websocket";

describe("SocketProvider", () => {
  jest.mock('useWebsocket', () => ({
    __esModule: true,
    default: jest.fn(() => {
      return {
        lastMessage: {
          type: "CLIENT_REGISTERED",
          data: {
            body: "1"
          }
        },
        readyState: 1,
        sendMessage: () => {
        },
      }

    }),
  }));

  it("should receive messages correctly", async () => {

    const {getByText} = render(<SocketProvider/>)
    await waitFor(() => getByText("CLIENT_REGISTERED"));

    expect(getByText("Open")).toBeInTheDocument();
    expect(getByText("1")).toBeInTheDocument();

  })
});
