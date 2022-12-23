import { useState } from "react";
import TextField from "@mui/material/TextField";
import Popup from "reactjs-popup";
import BasicButton from "./BasicButton";
import useServerCommunication from "../../serverCommunication";
import { Box } from "@mui/system";
import RGBTestButtonGroup from "./RGBTestButtonGroup";

function isRgbValueValid(value) {
    const validRGBValues = ["rgb"];
    return validRGBValues.includes(value.toLowerCase());
}

export default function AddNewDevicePopup(props) {
    const { sayHello, postNewDevice, postDeviceConfig, postColorRequest } =
        useServerCommunication();
    const [state, setState] = useState({
        name: "",
        description: "",
        ip_address: "192.168.x.x",
        color_mode: "rgb",
        pixel_count: 50,
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
                <h3 style={{ marginLeft: "5%" }}>Add new device</h3>
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <TextField
                            style={defaultFieldStyle}
                            required
                            id="colorMode"
                            label="Color Order"
                            value={state.color_mode}
                            color={state.rgbValid ? null : "warning"}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    color_mode: event.target.value,
                                    rgbValid: isRgbValueValid(
                                        event.target.value
                                    ),
                                });
                            }}
                        />
                        <TextField
                            style={defaultFieldStyle}
                            required
                            id="pixelCount"
                            label="Pixel Count"
                            value={state.pixel_count}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    pixel_count: event.target.value,
                                });
                            }}
                        />
                        {/* <Box sx={{ flexGrow: 0.1 }} /> */}
                    </div>
                </div>
                <div style={{ display: "flex", marginTop: "2%" }}>
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
                        buttonText="Set device config"
                        disabled={true}
                        style={{
                            background: state.canConnect ? "blue" : "red",
                            marginLeft: "1%",
                        }}
                        onClick={() => {
                            if (state.canConnect)
                                postDeviceConfig(
                                    state.ip_address,
                                    state.color_mode,
                                    state.pixel_count
                                )
                                    .then((res) => {
                                        console.log(res);
                                    })
                                    .catch((res) => {
                                        console.log(res);
                                    });
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
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
                    <RGBTestButtonGroup
                        postColorRequest={postColorRequest}
                        ip_address={state.ip_address}
                        disabled={state.canConnect}
                    />
                </div>
            </div>
        </Popup>
    );
}
