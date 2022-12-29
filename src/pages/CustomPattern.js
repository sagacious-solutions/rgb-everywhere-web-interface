import { useEffect, useState } from "react";
import BasicButton from "./components/BasicButton";
import PatternTable from "./components/PatternTable";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import useServerCommunication from "../serverCommunication";
import { SketchPicker, HuePicker } from "react-color";
import { Button } from "@mui/material";
import { getRgb, patternToRgbArray, colorToCssRgb } from "../helpers";

function generatePatternDots(pattern, selectedDot, setSelectedDot) {
    let avatars = [];

    const selectedStyle = {
        border: "5px solid black",
    };

    pattern.forEach((color, index) => {
        avatars.push(
            <div
                key={`dot-spacing-div-${index}`}
                style={{ marginTop: "0.33em" }}
            >
                <Avatar
                    key={`circle-dot-${index}`}
                    sx={{
                        backgroundColor: colorToCssRgb(color),
                        marginLeft: index ? "0px" : "15px",
                        ...(index == selectedDot ? selectedStyle : {}),
                        "&:hover": {
                            ...selectedStyle,
                        },
                    }}
                    children={""}
                    onClick={() => setSelectedDot(index)}
                />
            </div>
        );
    });

    return avatars;
}

function CustomPattern(props) {
    const { postColorRequest, postCustomPatternRequest, postNewPattern } =
        useServerCommunication();
    const [pattern, setPattern] = useState([]);
    const [color, setColor] = useState({ rgb: { r: 50, g: 0, b: 0 } });
    const [rgb, setRgb] = useState(0);
    const [selectedDot, setSelectedDot] = useState(null);

    const handleColorChange = (color, _event) => {
        setColor(color);
    };

    function sendPatternToServer(pattern) {
        const rgbList = patternToRgbArray(pattern);

        postCustomPatternRequest(rgbList, props.currentDevice);
    }

    useEffect(() => {
        setSelectedDot(null);
    }, [pattern]);

    useEffect(() => {
        setRgb(getRgb(color));
    }, [color]);

    return (
        <div>
            <h2>Make your own pattern.</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <SketchPicker onChange={handleColorChange} color={color} />
                    <BasicButton
                        style={{ width: "221px", backgroundColor: "#48AAF1" }}
                        buttonText={"Preview Color"}
                        onClick={() =>
                            postColorRequest(rgb, props.currentDevice)
                        }
                    />
                    <BasicButton
                        style={{ width: "221px" }}
                        buttonText={
                            selectedDot
                                ? "Replace Color"
                                : "Add color to Pattern"
                        }
                        onClick={() => {
                            if (selectedDot) {
                                const newPattern = pattern;
                                newPattern[selectedDot] = color;
                                setPattern([...newPattern]);
                                return;
                            }
                            setPattern([...pattern, color]);
                        }}
                    />
                </div>

                <PatternTable
                    patterns={props.savedPatterns}
                    updateSavedPatterns={() => props.updateSavedPatterns()}
                    editPattern={setPattern}
                    currentPattern={pattern}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "75px",
                }}
            >
                <HuePicker
                    width="90%"
                    onChange={handleColorChange}
                    color={color}
                />
                <Stack
                    style={{
                        display: "flex",
                        marginTop: 50,
                        width: "90%",
                        height: "4em",
                        backgroundColor: "grey",
                        borderRadius: "25px",
                        border: "3px solid black",
                    }}
                    direction="row"
                    spacing={2}
                >
                    {generatePatternDots(pattern, selectedDot, setSelectedDot)}
                </Stack>
            </div>
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
                <Button
                    sx={{ background: "blue", color: "white" }}
                    onClick={() => {
                        postNewPattern(patternToRgbArray(pattern)).then(() => {
                            props.updateSavedPatterns();
                        });
                    }}
                >
                    Save Pattern
                </Button>
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
