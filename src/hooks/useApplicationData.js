// import React from "react";
import { useState, useEffect } from "react";
import useServerCommunication from "../serverCommunication";
import { DictToDeviceList } from "../DisplayDevice";

export default function useApplicationData() {
    const [devices, setDevices] = useState([]);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [savedPatterns, setSavedPatterns] = useState(null);
    const { getPatternsList, getDeviceList } = useServerCommunication();

    function updateDeviceList() {
        getDeviceList().then((res) => {
            setDevices(DictToDeviceList(res.data));
        });
    }

    function updateSavedPatterns() {
        getPatternsList().then((res) => {
            let patterns = [];
            for (const [_, value] of Object.entries(res.data)) {
                patterns.push(value);
            }
            setSavedPatterns(patterns);
        });
    }

    useEffect(() => {
        updateSavedPatterns();
    }, []);

    return {
        currentDevice,
        setCurrentDevice,
        devices,
        setDevices,
        savedPatterns,
        setSavedPatterns,
        updateSavedPatterns,
        updateDeviceList,
    };
}
