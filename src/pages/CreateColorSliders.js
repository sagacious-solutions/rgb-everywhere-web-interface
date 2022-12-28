import classNames from "classnames";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import RgbSlider from "./components/RgbSlider";
import BasicButton from "./components/BasicButton";
import "./CreateColorSlider.css";
import useServerCommunication from "../serverCommunication";
// import CreateNewColorPopup from "./components/CreateNewColorPopup";

let socket = null;

function sendColorUpdate(color) {
    socket.emit("set_color", color);
}

function CreateColorSliders(props) {
    const { postColorRequest } = useServerCommunication();
    const [state, setState] = useState({
        rgb: [0, 0, 0],
        socketEnabled: false,
        // timeoutHasPassed: true,
        serverUnavailable: false,
    });
    // const [state.rgb, setRgb] = useState([0, 0, 0]);
    // const [state.socketEnabled, setSocketEnabled] = useState(false);
    const [timeoutHasPassed, setTimeoutHasPassed] = useState(true);
    // const [state.serverUnavailable, setServerUnavailable] = useState(false);
    let bttnGrpClass = classNames({ buttonGroup: true });
    let componentClass = classNames({ mainComponent: true });
    let liveButtonClass = classNames({
        serverUnavailable: state.serverUnavailable,
    });
    const rgbString = `${state.rgb[0]},${state.rgb[1]},${state.rgb[2]}`;

    const connectToSocket = () => {
        socket = io(`http://${props.currentDevice}:5000/`, {
            reconnectionAttempts: 1,
        });

        socket.on("connect_error", () => {
            setState({ ...state, serverUnavailable: true });
            setState({ ...state, timeoutHasPassed: true });
        });

        socket.on("connect", () => {
            sendColorUpdate(state.rgb);
            setState({ ...state, serverUnavailable: false });
            setState({ ...state, socketEnabled: true });
        });
        socket.on("disconnect", () => {
            setState({ ...state, socketEnabled: false });
        });
    };

    const setColorButton = (
        <BasicButton
            onClick={() => postColorRequest(state.rgb, props.currentDevice)}
            buttonText={`Set device to RGB(${rgbString})`}
            style={{
                backgroundColor: `rgb(${rgbString})`,
            }}
        />
    );
    const disconnectTreeButton = (
        <BasicButton
            onClick={() => {
                setState({ ...state, socketEnabled: false });
            }}
            buttonText={"Disconnect from tree."}
            style={{ backgroundColor: `black` }}
        />
    );
    const setColorOrDisconnectButton = state.socketEnabled
        ? disconnectTreeButton
        : setColorButton;

    useEffect(() => {
        // Set timeout before sending further light change requests
        // This is necessary to allow the server time to stop polling and run the routine to
        // change the lights. I feel this isn't necessarily the best strategy as that time
        // could be effected by other variables.
        let TIMEOUT_MS = 2;
        if (state.socketEnabled && timeoutHasPassed) {
            sendColorUpdate(state.rgb);
            setTimeoutHasPassed(false);
            setTimeout(() => {
                setTimeoutHasPassed(true);
            }, TIMEOUT_MS);
        }
    }, [state.rgb]);

    let buttonBackground = state.socketEnabled ? `rgb(${rgbString})` : "green";
    buttonBackground = state.serverUnavailable ? "red" : buttonBackground;
    let connectionButtonText = state.socketEnabled
        ? `Device set to RGB(${rgbString})`
        : "Start Live Connection";
    connectionButtonText = state.serverUnavailable
        ? "Server Unavailable"
        : connectionButtonText;
    const connectionButton = (
        <BasicButton
            className={liveButtonClass}
            onClick={() => {
                connectToSocket();
            }}
            buttonText={connectionButtonText}
            style={{
                backgroundColor: buttonBackground,
            }}
        />
    );

    return (
        <div className={componentClass}>
            <RgbSlider
                onChange={(val) => {
                    setState({ ...state, rgb: val });
                }}
            />
            <div className={bttnGrpClass}>
                {setColorOrDisconnectButton}
                {connectionButton}
            </div>
        </div>
    );
}

export default CreateColorSliders;
