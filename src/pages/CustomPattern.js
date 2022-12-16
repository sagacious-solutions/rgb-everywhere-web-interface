import { useEffect, useState } from "react";
import BasicButton from "./components/BasicButton";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import useServerCommunication from "../serverCommunication";
import { SketchPicker } from "react-color";

function getRgb(color) {
    const r = color.rgb.r;
    const g = color.rgb.g;
    const b = color.rgb.b;
    return [r, g, b];
}

function generatePatternDots(pattern) {
    let avatars = [];

    pattern.forEach((color, index) => {
        avatars.push(
            <div style={{ marginTop: "0.33em" }}>
                <Avatar
                    key={`color-circle-${index}`}
                    sx={{
                        backgroundColor: color.hex,
                        marginLeft: index ? "0px" : "15px",
                    }}
                    children={""}
                />
            </div>
        );
    });

    return avatars;
}

function CustomPattern(props) {
    const { postColorRequest, postCustomPatternRequest } =
        useServerCommunication();
    const [pattern, setPattern] = useState([]);
    const [color, setColor] = useState({ rgb: { r: 50, g: 0, b: 0 } });
    const [rgb, setRgb] = useState(0);

    const handleColorChange = (color, _event) => {
        setColor(color);
    };

    
    function sendPatternToServer(pattern) {
        const rgbList = [];

        pattern.forEach((color) => {
            rgbList.push([color.rgb.r, color.rgb.g, color.rgb.b]);
        });
        postCustomPatternRequest(rgbList, props.currentDevice);
    }

    useEffect(() => {
        setRgb(getRgb(color));
        console.log(color);
    }, [color]);

    return (
        <div>
            <h2>Make your own pattern.</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <SketchPicker onChange={handleColorChange} color={color} />
                <BasicButton
                    style={{ width: "221px", backgroundColor: "#48AAF1" }}
                    buttonText={"Preview Color"}
                    onClick={() => postColorRequest(rgb, props.currentDevice)}
                />
                <BasicButton
                    style={{ width: "221px" }}
                    buttonText={"Add color to Pattern"}
                    onClick={() => setPattern([...pattern, color])}
                />
            </div>
            <Stack
                style={{
                    display: "flex",
                    marginTop: 50,
                    height: "4em",
                    backgroundColor: "grey",
                    borderRadius: "25px",
                    border: "3px solid black",
                }}
                direction="row"
                spacing={2}
            >
                {generatePatternDots(pattern)}
            </Stack>
            <div
                style={{
                    marginTop: 50,
                    display: "Flex",
                    justifyContent: "space-evenly",
                }}
            >
                <BasicButton
                    style={{}}
                    buttonText={"Set device to Pattern"}
                    onClick={() => sendPatternToServer(pattern)}
                />
                <BasicButton
                    style={{}}
                    buttonText={"Clear Pattern"}
                    onClick={() => setPattern([])}
                />
            </div>
        </div>
    );
}

export default CustomPattern;
