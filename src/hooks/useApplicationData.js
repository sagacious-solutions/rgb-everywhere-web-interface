// import React from "react";
import { useState } from "react";

export default function useApplicationData() {
    const [appState, setAppState] = useState({
        currentDevice: null,
        devices: [],
    });

    function setCurrentDevice(device) {
        setAppState({ ...appState, currentDevice: device });
    }
    function setDevices(devices) {
        setAppState({ ...appState, devices: devices });
    }

    return { appState, setCurrentDevice, setDevices };
}
