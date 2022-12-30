import classNames from "classnames";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { HuePicker } from "react-color";

import RgbSlider from "./components/RgbSlider";
import BasicButton from "./components/BasicButton";
import "./CreateColorSlider.css";
import useServerCommunication from "../serverCommunication";

let socket = null;

function sendColorUpdate(color) {
    socket.emit("set_color", color);
}

function LiveDeviceControl(props) {
    const { postColorRequest } = useServerCommunication();
    const [state, setState] = useState({
        rgb: [127, 127, 127],
        socketEnabled: false,
        serverUnavailable: false,
    });
    const [timeoutHasPassed, setTimeoutHasPassed] = useState(true);
    let bttnGrpClass = classNames({ buttonGroup: true });
    let componentClass = classNames({ mainComponent: true });
    let liveButtonClass = classNames({
        serverUnavailable: state.serverUnavailable,
    });
    const rgbString = `${state.rgb[0]},${state.rgb[1]},${state.rgb[2]}`;

    const handleColorChange = (color, _event) => {
        const rgb = [color.rgb.r, color.rgb.g, color.rgb.b];

        setState({ ...state, rgb: rgb });
    };

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

    useEffect(() => {
        setState({ ...state, socketEnabled: false });
    }, [props.currentDevice]);

    const setColorButton = (
        <BasicButton
            onClick={() => postColorRequest(state.rgb, props.currentDevice)}
            buttonText={`Set device to RGB(${rgbString})`}
            style={{
                backgroundColor: `rgb(${rgbString})`,
            }}
        />
    );
    const disconnectDeviceButton = (
        <BasicButton
            onClick={() => {
                setState({ ...state, socketEnabled: false });
            }}
            buttonText={`Disconnect from ${props.currentDeviceName}.`}
            style={{ backgroundColor: `black` }}
        />
    );
    const setColorOrDisconnectButton = state.socketEnabled
        ? disconnectDeviceButton
        : setColorButton;

    useEffect(() => {
        // Set timeout before sending further light change requests
        // This is necessary to allow the server time to stop polling and run the routine to
        // change the lights. I feel this isn't necessarily the best strategy as that time
        // could be effected by other variables.
        let TIMEOUT_MS = 10;
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
        : `Start Live Connection with ${props.currentDeviceName}`;
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
            <h1 style={{ color: "black" }}>Live device control</h1>

            <RgbSlider
                onChange={(val) => {
                    setState({ ...state, rgb: val });
                }}
                rgb={state.rgb}
                defaultColor={[127, 127, 127]}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "7.5%",
                }}
            >
                <HuePicker
                    width="90%"
                    onChange={handleColorChange}
                    color={{
                        rgb: {
                            r: state.rgb[0],
                            g: state.rgb[1],
                            b: state.rgb[2],
                        },
                    }}
                />
            </div>
            <div className={bttnGrpClass}>
                {setColorOrDisconnectButton}
                {connectionButton}
            </div>
        </div>
    );
}

export default LiveDeviceControl;
