import { useState } from "react";
import TextField from "@mui/material/TextField";
import Popup from "reactjs-popup";
import BasicButton from "./BasicButton";
import useServerCommunication from "../../serverCommunication";

function isRgbValueValid(value) {
    const validRGBValues = ["rgb"];
    return validRGBValues.includes(value.toLowerCase());
}

export default function AddNewDevicePopup(props) {
    const { sayHello, postNewDevice } = useServerCommunication();
    const [state, setState] = useState({
        name: "",
        description: "",
        ip_address: "192.168.x.x",
        color_mode: "rgb",
        rgbValid: true,
        canConnect: false,
    });

    const defaultFieldStyle = {
        marginTop: "2%",
        marginBottom: "2%",
    };

    const fieldGroupStyle = {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
    };

    return (
        <Popup open={props.open} defaultOpen={false}>
            <div>
                <h3>Add new device</h3>
                <div style={fieldGroupStyle}>
                    <TextField
                        style={defaultFieldStyle}
                        required
                        id="deviceName"
                        label="Name"
                        value={state.name}
                        onChange={(event) => {
                            setState({
                                ...state,
                                name: event.target.value,
                            });
                        }}
                    />
                    <TextField
                        style={defaultFieldStyle}
                        id="deviceDescription"
                        label="Description"
                        value={state.description}
                        onChange={(event) => {
                            setState({
                                ...state,
                                description: event.target.value,
                            });
                        }}
                    />
                    <TextField
                        style={defaultFieldStyle}
                        required
                        id="deviceIP"
                        label="IP Address"
                        value={state.ip_address}
                        onChange={(event) => {
                            setState({
                                ...state,
                                ip_address: event.target.value,
                                canConnect: false,
                            });
                        }}
                    />
                    <TextField
                        style={defaultFieldStyle}
                        required
                        id="deviceIP"
                        label="Color Mode"
                        value={state.color_mode}
                        color={state.rgbValid ? null : "warning"}
                        onChange={(event) => {
                            setState({
                                ...state,
                                color_mode: event.target.value,
                                rgbValid: isRgbValueValid(event.target.value),
                            });
                        }}
                    />
                </div>
                <div style={{ display: "flex" }}>
                    <BasicButton
                        buttonText="Check Device Communication"
                        style={{
                            background: state.canConnect ? "green" : null,
                        }}
                        onClick={() => {
                            sayHello(state.ip_address)
                                .then((_res) =>
                                    setState({ ...state, canConnect: true })
                                )
                                .catch((err) => console.log(err));
                        }}
                    />
                    <BasicButton
                        buttonText="Add New Device"
                        disabled={true}
                        style={{
                            background: state.canConnect ? "green" : "red",
                        }}
                        onClick={() => {
                            if (state.canConnect)
                                postNewDevice({
                                    name: state.name,
                                    description: state.description,
                                    ip_address: state.ip_address,
                                    color_mode: state.color_mode,
                                })
                                    .then(() => {
                                        props.closePopup();
                                    })
                                    .catch(() => {});
                        }}
                    />
                </div>
            </div>
        </Popup>
    );
}
