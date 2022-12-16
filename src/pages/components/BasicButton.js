import React from "react";
import Button from "@mui/material/Button";

export default function BasicButton(props) {
    return (
        <Button
            sx={{
                ...props.style,
            }}
            variant="contained"
            onClick={props.onClick}
        >
            {props.buttonText}
        </Button>
    );
}
