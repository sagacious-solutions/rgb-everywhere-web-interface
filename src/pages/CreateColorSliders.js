import classNames from "classnames";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import RgbSlider from "./components/RgbSlider";
import BasicButton from "./components/BasicButton";
import "./CreateColorSlider.css";
import useServerCommunication from "../serverCommunication";

const CHRISTMAS_TREE_URL = process.env.REACT_APP_CHRISTMAS_TREE_URL;

let socket = null;

function sendColorUpdate(color) {
    socket.emit("set_color", color);
}

function CreateColorSliders(props) {
    const { postColorRequest } = useServerCommunication();
    const [rgb, setRgb] = useState([0, 0, 0]);
    const [socketEnabled, setSocketEnabled] = useState(false);
    const [timeoutHasPassed, setTimeoutHasPassed] = useState(true);
    const [serverUnavailable, setServerUnavailable] = useState(false);
    let bttnGrpClass = classNames({ buttonGroup: true });
    let componentClass = classNames({ mainComponent: true });
    let liveButtonClass = classNames({
        serverUnavailable: serverUnavailable,
    });
    const rgbString = `${rgb[0]},${rgb[1]},${rgb[2]}`;

    const connectToSocket = () => {
        socket = io(CHRISTMAS_TREE_URL, { reconnectionAttempts: 1 });

        socket.on("connect_error", (error) => {
            setServerUnavailable(true);
        });

        socket.on("connect", () => {
            sendColorUpdate(rgb);
            setServerUnavailable(false);
            setSocketEnabled(true);
        });
        socket.on("disconnect", () => {
            setSocketEnabled(false);
        });
    };

    const setColorButton = (
        <BasicButton
            onClick={() => postColorRequest(rgb, props.currentDevice)}
            buttonText={`Set Tree to RGB(${rgbString})`}
            style={{
                backgroundColor: `rgb(${rgbString})`,
            }}
        />
    );
    const disconnectTreeButton = (
        <BasicButton
            onClick={() => {
                setSocketEnabled(false);
            }}
            buttonText={"Disconnect from tree."}
            style={{ backgroundColor: `black` }}
        />
    );
    const setColorOrDisconnectButton = socketEnabled
        ? disconnectTreeButton
        : setColorButton;

    useEffect(() => {
        // Set timeout before sending further light change requests
        // This is necessary to allow the server time to stop polling and run the routine to
        // change the lights. I feel this isn't necessarily the best strategy as that time
        // could be effected by other variables.
        let TIMEOUT_MS = 1;
        if (socketEnabled && timeoutHasPassed) {
            sendColorUpdate(rgb);
            setTimeoutHasPassed(false);
            setTimeout(() => {
                setTimeoutHasPassed(true);
            }, TIMEOUT_MS);
        }
    }, [rgb]);

    let buttonBackground = socketEnabled ? `rgb(${rgbString})` : "green";
    buttonBackground = serverUnavailable ? "red" : buttonBackground;
    let connectionButtonText = socketEnabled
        ? `Tree set to RGB(${rgbString})`
        : "Start Live Connection";
    connectionButtonText = serverUnavailable
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
            <RgbSlider onChange={setRgb} />
            <div className={bttnGrpClass}>
                {setColorOrDisconnectButton}
                {connectionButton}
            </div>
        </div>
    );
}

export default CreateColorSliders;
