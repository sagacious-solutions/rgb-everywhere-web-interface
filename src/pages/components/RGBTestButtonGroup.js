// import BasicButton from "./BasicButton";
import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import useServerCommunication from "../../serverCommunication";

export default function RGBTestButtonGroup(props) {
    const { postColorRequest } = useServerCommunication();

    return (
        <fieldset
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: "2px solid",
                borderRadius: "10px",
            }}
        >
            <legend>Test Color Order</legend>
            <ButtonGroup style={{ marginBottom: "3%" }} variant="contained">
                <Button
                    disabled={!props.disabled}
                    style={{
                        background: "red",
                    }}
                    onClick={() => {
                        postColorRequest([255, 0, 0], props.ip_address)
                            .then(() => {})
                            .catch(() => {});
                    }}
                >
                    Red
                </Button>
                <Button
                    disabled={!props.disabled}
                    style={{
                        background: "green",
                    }}
                    onClick={() => {
                        postColorRequest([0, 255, 0], props.ip_address)
                            .then(() => {})
                            .catch(() => {});
                    }}
                >
                    Green
                </Button>
                <Button
                    disabled={!props.disabled}
                    style={{
                        background: "blue",
                    }}
                    onClick={() => {
                        postColorRequest([0, 0, 255], props.ip_address)
                            .then(() => {})
                            .catch(() => {});
                    }}
                >
                    Blue
                </Button>
            </ButtonGroup>
        </fieldset>
    );
}
