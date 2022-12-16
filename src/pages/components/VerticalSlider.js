import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function VerticalSlider(props) {
    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    }
    const DEFAULT_VALUE = 127;
    const [value, setValue] = useState(DEFAULT_VALUE);

    const changeValue = (event, value) => {
        setValue(value);
        props.setColor(value);
    };

    return (
        <Box sx={{ height: 300 }}>
            <Slider
                sx={{
                    '& input[type="range"]': {
                        WebkitAppearance: "slider-vertical",
                    },
                }}
                orientation="vertical"
                defaultValue={127}
                valueLabelDisplay="on"
                onKeyDown={preventHorizontalKeyboardNavigation}
                min={props.min}
                max={props.max}
                value={value}
                onChange={changeValue}
            />
        </Box>
    );
}
