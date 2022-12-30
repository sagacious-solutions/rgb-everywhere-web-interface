import * as React from "react";
import VerticalSlider from "./VerticalSlider";
import "./RgbSlider.css";

let classNames = require("classnames");

export default function RgbSlider(props) {
    let sldrGrpClass = classNames({ sliderGroup: true });
    const sliderSettings = { min: 0, max: 255 };

    return (
        <div>
            <div className={sldrGrpClass}>
                <VerticalSlider
                    setColor={(val) => {
                        props.onChange([val, props.rgb[1], props.rgb[2]]);
                    }}
                    value={props.rgb[0]}
                    {...sliderSettings}
                />
                <VerticalSlider
                    setColor={(val) => {
                        props.onChange([props.rgb[0], val, props.rgb[2]]);
                    }}
                    value={props.rgb[1]}
                    {...sliderSettings}
                />
                <VerticalSlider
                    setColor={(val) => {
                        props.onChange([props.rgb[0], props.rgb[1], val]);
                    }}
                    value={props.rgb[2]}
                    {...sliderSettings}
                />
            </div>
        </div>
    );
}
