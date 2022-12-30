import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

export default function VerticalSlider(props) {
    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    }

    return (
        <Box sx={{ height: 300 }}>
            <Slider
                sx={{
                    '& input[type="range"]': {
                        WebkitAppearance: "slider-vertical",
                    },
                }}
                orientation="vertical"
                valueLabelDisplay="on"
                onKeyDown={preventHorizontalKeyboardNavigation}
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={(_e, val) => props.setColor(val)}
            />
        </Box>
    );
}
