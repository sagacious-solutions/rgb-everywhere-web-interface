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

    function startDualBeatOnCurrentDevice() {
        const start_ms = new Date().getTime();
        getAudioAnalysis().then((res) => {
            const finish_ms = new Date().getTime();
            const lagTimeMs = finish_ms - start_ms;
            postSpotifyDualBeats(
                props.currentDevice,
                playbackState.progressMs,
                res,
                lagTimeMs
            );
        });
    }

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
            </div>
        );
    }

    function restartActiveVisualization() {
        if (danceMode == "DualBeatCurrentDevice") {
            startDualBeatOnCurrentDevice();
        }
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

    useEffect(() => {
        if (playbackState.currentTrackId && danceMode) {
            restartActiveVisualization();
        }
    }, [playbackState.currentTrackId]);

    return <div>{display}</div>;
}

export default DanceParty;
