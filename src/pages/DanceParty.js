import React, { useState, useEffect } from "react";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";
import SpotifyWebApi from "spotify-web-api-js";
import { useCookies } from "react-cookie";
import useServerCommunication from "../serverCommunication";
import spotifyPlaybackData from "../spotifyPlaybackData";
import SpotifyPlayerSmall from "./components/SpotifyPlayerSmall";
import { Button } from "@material-ui/core";

let spotify = new SpotifyWebApi();

function DanceParty(props) {
    const [remoteProgressMs, setRemoteProgressMs] = useState();
    const [danceModeEnabled, setDanceModeEnabled] = useState(false);
    const [display, setDisplay] = useState(
        props.currentSpotifyPlayback ? (
            <SpotifyPlayerSmall
                currentPlayback={props.currentSpotifyPlayback}
                updatePlaybackState={updatePlaybackState}
                remoteProgressMs={remoteProgressMs}
                pause={() => {
                    spotify.pause();
                }}
            />
        ) : (
            <SpotifyLogin />
        )
    );
    const [cookies, setCookie, removeCookie] = useCookies();
    const [authToken, setAuthToken] = useState(null);
    const { postSpotifyVisualizeData } = useServerCommunication();

    function startDanceParty() {
        const start_ms = new Date().getTime();

        spotify.getMyCurrentPlaybackState().then((res) => {
            const trackProgress = res.progress_ms;
            spotify.getAudioAnalysisForTrack(res.item.id).then((res) => {
                const analysisData = res;
                const end = new Date();
                const lagTimeMs = end.getTime() - start_ms;
                postSpotifyVisualizeData(
                    props.currentDevice,
                    trackProgress,
                    analysisData,
                    lagTimeMs
                );
                setDanceModeEnabled(true);
            });
        });
    }

    function updatePlaybackState() {
        spotify.getMyCurrentPlaybackState().then(
            (res) => {
                props.setCurrentSpotifyPlayback(res);
            },
            (err) => {}
        );
    }

    function checkPlaybackChanged() {
        spotify.getMyCurrentPlaybackState().then((res) => {
            setRemoteProgressMs(res.progress_ms);
            if (res.item.id !== props.currentSpotifyPlayback.item.id) {
                console.log("Updating playback state");
                props.setCurrentSpotifyPlayback(res);
            }
        });
    }

    useEffect(() => {
        let currentTrackId = null;
        let trackProgress = null;
        const start = new Date();
        let start_ms = start.getTime();

        if (props.spotifyAuthToken) {
            spotify.setAccessToken(props.spotifyAuthToken);
            updatePlaybackState();
            setAuthToken(props.spotifyAuthToken);
        }

        if (cookies.spotifyAuthToken) {
            spotify.setAccessToken(cookies.spotifyAuthToken);
            if (!authToken) {
                updatePlaybackState();
                setAuthToken(cookies.spotifyAuthToken);
            }
            setTimeout(() => {
                removeCookie("spotifyAuthToken");
            }, 1000);
        }

        // .then(() => {

        // })
    }, [authToken]);

    useEffect(() => {
        const checkRemotePlaybackInterval = setInterval(
            checkPlaybackChanged,
            3000
        );

        if (danceModeEnabled) {
            startDanceParty();
        }

        return () => {
            clearInterval(checkRemotePlaybackInterval);
        };
    }, [props.currentSpotifyPlayback]);

    useEffect(() => {
        if (props.currentSpotifyPlayback) {
            setDisplay(
                <SpotifyPlayerSmall
                    currentPlayback={props.currentSpotifyPlayback}
                    updatePlaybackState={updatePlaybackState}
                    remoteProgressMs={remoteProgressMs}
                    pause={() => spotify.pause()}
                />
            );
        }
    }, [props.currentSpotifyPlayback, remoteProgressMs]);

    return (
        <div>
            {display}
            <Button onClick={startDanceParty}>Start the party</Button>
        </div>
    );
}

export default DanceParty;
