import * as React from "react";
import VerticalSlider from "./VerticalSlider";
import { useState, useEffect } from "react";
import "./RgbSlider.css";

let classNames = require("classnames");

export default function RgbSlider(props) {
    let sldrGrpClass = classNames({ sliderGroup: true });
    const sliderSettings = { min: 0, max: 255 };
    const headerCss = { color: "black" };
    const [red, setRed] = useState(127);
    const [green, setGreen] = useState(127);
    const [blue, setBlue] = useState(127);
    const onChange = props.onChange;

    useEffect(() => {
        onChange([red, green, blue]);
    }, [red, green, blue, onChange]);

    return (
        <div>
            <h1 style={headerCss}>Choose Your Color</h1>
            <div className={sldrGrpClass}>
                <VerticalSlider setColor={setRed} {...sliderSettings} />
                <VerticalSlider setColor={setGreen} {...sliderSettings} />
                <VerticalSlider setColor={setBlue} {...sliderSettings} />
            </div>
        </div>
    );
}
