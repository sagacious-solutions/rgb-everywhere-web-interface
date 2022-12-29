// import React from "react";
import { useState } from "react";

export default function useApplicationData() {
    const [appState, setAppState] = useState({
        currentDevice: null,
        devices: [],
        savedPatterns: [],
    });

    function setCurrentDevice(device) {
        setAppState({ ...appState, currentDevice: device });
    }
    function setDevices(devices) {
        setAppState({ ...appState, devices: devices });
    }
    function setSavedPatterns(patterns) {
        setAppState({ ...appState, savedPatterns: patterns });
    }

    return { appState, setCurrentDevice, setDevices, setSavedPatterns };
}
