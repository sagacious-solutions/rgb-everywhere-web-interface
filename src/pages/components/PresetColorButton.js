import React from "react";
import Button from "@mui/material/Button";

export default function PresetColorButton(props) {
    return (
        <Button
            sx={{
                width: "33%",
                height: "7.5em",
                fontWeight: "1000",
                backgroundColor: props.backgroundColor,
                color: props.textColor,
            }}
            variant="contained"
            onClick={props.onClick}
        >
            {props.buttonText}
        </Button>
    );
}
