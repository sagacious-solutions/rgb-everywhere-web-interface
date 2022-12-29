// import React from "react";
import { useState, useEffect } from "react";
import useServerCommunication from "../serverCommunication";

export default function useApplicationData() {
    const [devices, setDevices] = useState([]);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [savedPatterns, setSavedPatterns] = useState(null);
    const { getPatternsList } = useServerCommunication();

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
    };
}
