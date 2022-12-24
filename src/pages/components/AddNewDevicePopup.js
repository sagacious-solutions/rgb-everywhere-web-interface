import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Popup from "reactjs-popup";
import BasicButton from "./BasicButton";
import useServerCommunication from "../../serverCommunication";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import RGBTestButtonGroup from "./RGBTestButtonGroup";

function isRgbValueValid(value) {
    const validRGBValues = ["rgb"];
    return validRGBValues.includes(value.toLowerCase());
}

export default function AddNewDevicePopup(props) {
    const {
        sayHello,
        postNewDevice,
        postUpdateDevice,
        postDeleteDevice,
        postDeviceConfig,
        postColorRequest,
    } = useServerCommunication();
    const defaultState = {
        name: "",
        description: "",
        ip_address: "192.168.x.x",
        color_order: "rgb",
        pixel_count: 50,
        rgbValid: true,
        canConnect: false,
        popUpTitle: "Add new device",
        addButtonText: "Add New Device",
        addOrUpdateFn: postNewDevice,
    };
    const [state, setState] = useState({ ...defaultState });

    const defaultFieldStyle = {
        marginTop: "2%",
        marginBottom: "2%",
    };

    const fieldGroupStyle = {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
    };

    useEffect(() => {
        if (!props.modifyExisting) {
            setState({ ...defaultState });
            return;
        }

        if (props.modifyExisting) {
            let deviceToModify = null;
            props.devices.forEach((device) => {
                if (device["ip_address"] == props.currentDevice) {
                    deviceToModify = device;
                }
            });

            setState({
                ...state,
                name: deviceToModify["name"],
                description: deviceToModify["description"],
                ip_address: deviceToModify["ip_address"],
                color_order: deviceToModify["color_order"],
                pixel_count: deviceToModify["pixel_count"],
                popUpTitle: "Update Existing Device",
                addButtonText: "Update Device",
                addOrUpdateFn: postUpdateDevice,
            });
        }
    }, [props.modifyExisting, props.open]);

    return (
        <Popup
            open={props.open}
            defaultOpen={false}
            contentStyle={{ borderRadius: "2%" }}
        >
            <div
                style={{
                    border: "2px solid black",
                    padding: "1%",
                    borderRadius: "2%",
                }}
            >
                <div style={{ display: "flex" }}>
                    <h3 style={{ marginLeft: "5%" }}>{state.popUpTitle}</h3>
                    <Box style={{ flexGrow: "1" }} />
                    <Button onClick={props.closePopup}>
                        <CloseIcon style={{ color: "black" }} />
                    </Button>
                </div>
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
                        disabled={props.modifyExisting}
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
                            value={state.color_order}
                            color={state.rgbValid ? null : "warning"}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    color_order: event.target.value,
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
                <hr style={{ borderWidth: "2px" }}></hr>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    <RGBTestButtonGroup
                        postColorRequest={postColorRequest}
                        ip_address={state.ip_address}
                        disabled={state.canConnect}
                    />
                    <Button
                        style={{
                            display: props.modifyExisting ? null : "none",
                            background: "black",
                            color: "white",
                            width: "30%",
                            height: "60px",
                            marginTop: "2%",
                        }}
                        onClick={() => {
                            postDeleteDevice({
                                name: state.name,
                                description: state.description,
                                ip_address: state.ip_address,
                                color_mode: state.color_order,
                            }).then(() => props.closePopup());
                        }}
                    >
                        Delete Device
                    </Button>
                </div>
                <div style={{ display: "flex", marginTop: "3%" }}>
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
                                    state.color_order,
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
                        buttonText={state.addButtonText}
                        disabled={true}
                        style={{
                            background: state.canConnect ? "green" : "red",
                        }}
                        onClick={() => {
                            if (state.canConnect)
                                state
                                    .addOrUpdateFn({
                                        name: state.name,
                                        description: state.description,
                                        ip_address: state.ip_address,
                                        color_order: state.color_order,
                                        pixel_count: state.pixel_count,
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
