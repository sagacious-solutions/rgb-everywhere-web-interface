import React, { useState, useEffect } from "react";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";
import { useCookies } from "react-cookie";
import useServerCommunication from "../serverCommunication";
import useSpotifyData from "../hooks/useSpotifyData";
import { Button } from "@material-ui/core";

function DanceParty(props) {
    const { authorize, playbackState, updatePlaybackState, getAudioAnalysis } =
        useSpotifyData();
    const [display, setDisplay] = useState(
        playbackState.currentTrackId ? displayNowPlaying() : <SpotifyLogin />
    );
    const [danceMode, setDanceMode] = useState(null);
    const [cookies, _setCookie, removeCookie] = useCookies();
    const [authToken, setAuthToken] = useState(null);
    const { postSpotifyDualBeats } = useServerCommunication();

    function startDualBeatOnDevice(device) {
        const start_ms = new Date().getTime();
        updatePlaybackState();
        const analysisData = getAudioAnalysis();
        const finish_ms = new Date().getTime();
        const lagTimeMs = finish_ms - start_ms;

        postSpotifyDualBeats(
            device ? device.ip_address : props.currentDevice,
            playbackState.progressMs,
            analysisData,
            lagTimeMs
        );
    }

    function startDualBeatOnCurrentDevice() {
        const start_ms = new Date().getTime();
        const analysisData = getAudioAnalysis();
        const finish_ms = new Date().getTime();
        const lagTimeMs = finish_ms - start_ms;

        postSpotifyDualBeats(
            props.currentDevice,
            playbackState.progressMs,
            analysisData,
            lagTimeMs
        );
    }

    function startDualBeatOnAllDevices() {
        props.devices.forEach(startDualBeatOnDevice);
    }

    // function checkPlaybackChanged() {
    //     spotify.getMyCurrentPlaybackState().then((res) => {
    //         setRemoteProgressMs(res.progress_ms);
    //         if (res.item.id !== props.currentSpotifyPlayback.item.id) {
    //             props.setCurrentSpotifyPlayback(res);
    //         }
    //     });
    // }

    function displayNowPlaying() {
        return (
            <div>
                <SpotifyNowPlaying playbackState={playbackState} />
                <Button
                    style={{
                        marginTop: "20%",
                        background: "blue",
                        color: "white",
                    }}
                    onClick={() => {
                        startDualBeatOnCurrentDevice();
                        setDanceMode("DualBeatCurrentDevice");
                    }}
                >
                    Start Dual Beats Visualization On Current Device
                </Button>
                <Button
                    style={{
                        marginLeft: "5%",
                        marginTop: "20%",
                        background: "blue",
                        color: "white",
                    }}
                    onClick={() => {
                        setDanceMode("DualBeatAllDevices");
                        startDualBeatOnAllDevices();
                    }}
                >
                    Start Dual Beats Visualization On All Devices
                </Button>
            </div>
        );
    }

    useEffect(() => {
        if (props.spotifyAuthToken) {
            authorize(props.spotifyAuthToken);
            updatePlaybackState();
            setAuthToken(props.spotifyAuthToken);
        }

        if (cookies.spotifyAuthToken) {
            authorize(props.spotifyAuthToken);
            if (!authToken) {
                updatePlaybackState();
                setAuthToken(cookies.spotifyAuthToken);
            }
            setTimeout(() => {
                removeCookie("spotifyAuthToken");
            }, 1000);
        }
    }, [authToken]);

    useEffect(() => {
        if (playbackState.currentTrackId) {
            setDisplay(displayNowPlaying());
        }
    }, [playbackState]);

    return <div>{display}</div>;
}

export default DanceParty;
