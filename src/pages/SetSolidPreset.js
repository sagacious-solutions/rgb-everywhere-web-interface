import PresetColorButton from "./components/PresetColorButton";

import useServerCommunication from "../serverCommunication";

const buttonDetails = [
    // colorName is passed in the post request to get the correct color
    {
        buttonText: "White",
        backgroundColor: "rgb(255, 255, 255)",
        textColor: "black",
        colorName: "white",
    },
    {
        buttonText: "Warm White",
        backgroundColor: "rgb(245, 153, 108)",
        colorName: "warmWhite",
    },
    {
        buttonText: "Autum Orange",
        backgroundColor: "rgb(232, 94, 26)",
        colorName: "autumnOrange",
    },
    {
        buttonText: "Light Orange",
        backgroundColor: "rgb(247, 129, 2)",
        colorName: "lightOrange",
    },
    {
        buttonText: "Yellow",
        backgroundColor: "rgb(255, 243, 18)",
        textColor: "black",
        colorName: "yellow",
    },
    {
        buttonText: "Fall Yellow",
        backgroundColor: "rgb(248, 255, 112)",
        textColor: "black",
        colorName: "fallYellow",
    },
    {
        backgroundColor: "red",
        buttonText: "Red",
        colorName: "red",
    },
    {
        backgroundColor: "Blue",
        buttonText: "Blue",
        colorName: "blue",
    },
    {
        backgroundColor: "Green",
        buttonText: "Green",
        colorName: "green",
    },
    {
        backgroundColor: "rgb(50, 26, 94)",
        buttonText: "Purple",
        colorName: "purple",
    },
    {
        backgroundColor: "rgb(115, 12, 138)",
        buttonText: "Bright Purple",
        colorName: "brightPurple",
    },
    {
        backgroundColor: "rgb(74, 2, 110)",
        buttonText: "Dark Purple",
        colorName: "darkPurple",
    },
    {
        backgroundColor: "#008080",
        buttonText: "Teal",
        colorName: "teal",
    },
    {
        backgroundColor: "#FFC0CB",
        buttonText: "Pink",
        colorName: "pink",
    },
    {
        backgroundColor: "rgb(255, 59, 239)",
        buttonText: "Bright Violet",
        colorName: "brightViolet",
    },
];

function SetSolidPreset(props) {
    const { postSetSolidPreset } = useServerCommunication();

    let generateButtons = (currentDevice) => {
        let html = buttonDetails.map((button) => {
            return (
                <PresetColorButton
                    key={button.colorName}
                    {...button}
                    onClick={() => {
                        postSetSolidPreset(button.colorName, currentDevice);
                    }}
                />
            );
        });

        return html;
    };

    return (
        <div className="SelectPattern">
            Select the color you'd like to see.
            <div>{generateButtons(props.currentDevice)}</div>
        </div>
    );
}

export default SetSolidPreset;
