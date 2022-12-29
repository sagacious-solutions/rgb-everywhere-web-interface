import axios from "axios";

const DB_URL = process.env.REACT_APP_DB_URL;

export default function useServerCommunication() {
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
    function postDeleteDevice(device) {
        return axios.post(DB_URL + "/deleteDevice/", { device });
    }

    function postDeviceConfig(ip, color_mode, led_count) {
        return axios.post("http://" + ip + ":5000/configDevice/", {
            color_mode: color_mode,
            led_count: led_count,
        });
    }

    function postSetSolidPreset(color, device) {
        axios
            .post(`http://${device}:5000/setSolidPreset/`, {
                color: color,
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function postColorRequest(color, device) {
        return axios
            .post(`http://${device}:5000/setRgbColor/`, {
                color: color,
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function postCustomPatternRequest(pattern, device) {
        axios
            .post(`http://${device}:5000/setCustomPattern/`, {
                pattern: pattern,
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function postAninmationRequest(pattern, device) {
        axios
            // .post(BOOKSHELF_URL + "/setPattern/", {
            .post(`http://${device}:5000/setPattern/`, {
                pattern: pattern,
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function postTurnOffRequest(device) {
        axios
            .post(`http://${device}:5000/turnOffLights/`, {})
            .catch(function (error) {
                console.log(error);
            });
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
        getPatternsList,
    };
}
