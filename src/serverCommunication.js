import axios from "axios";

const DB_URL = process.env.REACT_APP_DB_URL;

export default function useServerCommunication() {
    const deviceUrl = (ip) => {
        return `https://${ip}:5000`;
    };

    function sayHello(ip) {
        return axios.get("http://" + ip + ":5000/bonjour/");
    }

    function getDeviceList() {
        return axios.get(DB_URL + "/getDevices/");
    }
    function getPatternsList() {
        return axios.get(DB_URL + "/getPatterns/");
    }
    function postNewDevice(device) {
        return axios.post(DB_URL + "/putNewDevice/", { device });
    }
    function postNewPattern(pattern) {
        return axios.post(DB_URL + "/putNewPattern/", { pattern });
    }
    function postUpdateDevice(device) {
        return axios.post(DB_URL + "/updateDevice/", { device });
    }
    function postUpdatePattern(old_pattern, new_pattern) {
        return axios.post(DB_URL + "/updatePattern/", {
            old_pattern,
            new_pattern,
        });
    }
    function postDeleteDevice(device) {
        return axios.post(DB_URL + "/deleteDevice/", { device });
    }
    function postDeletePattern(pattern) {
        return axios.post(DB_URL + "/deletePattern/", { pattern });
    }

    function postSpotifyDualBeats(device, trackProgress, trackData, lagTimeMs) {
        return axios.post(`${deviceUrl(device)}/spotifyVisualizeDualBeat/`, {
            track_progress: trackProgress,
            track_data: trackData,
            lag_time_ms: lagTimeMs,
        });
    }

    function postDeviceConfig(device, color_mode, led_count) {
        return axios.post(`${deviceUrl(device)}/configDevice/`, {
            color_mode: color_mode,
            led_count: led_count,
        });
    }

    function postSetSolidPreset(color, device) {
        axios
            .post(`${deviceUrl(device)}/setSolidPreset/`, {
                color: color,
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function postColorRequest(color, device) {
        return axios
            .post(`${deviceUrl(device)}/setRgbColor/`, {
                color: color,
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function postCustomPatternRequest(pattern, device) {
        axios
            .post(`${deviceUrl(device)}/setCustomPattern/`, {
                pattern: pattern,
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function postAninmationRequest(pattern, device) {
        axios
            .post(`${deviceUrl(device)}/setPattern/`, {
                pattern: pattern,
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function postTurnOffRequest(device) {
        axios
            .post(`${deviceUrl(device)}/turnOffLights/`, {})
            .catch(function (error) {
                console.log(error);
            });
    }

    function getDataFromUrl(url) {
        return axios.get(url);
    }

    return {
        postColorRequest,
        postSetSolidPreset,
        postCustomPatternRequest,
        postAninmationRequest,
        postTurnOffRequest,
        getDeviceList,
        postNewDevice,
        postUpdateDevice,
        postDeleteDevice,
        sayHello,
        postDeviceConfig,
        postNewPattern,
        postDeletePattern,
        postUpdatePattern,
        getPatternsList,
        getDataFromUrl,
        postSpotifyDualBeats,
    };
}
