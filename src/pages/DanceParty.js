import React, { useState, useEffect } from "react";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";
import SpotifyWebApi from "spotify-web-api-js";
import { useCookies } from "react-cookie";
import useServerCommunication from "../serverCommunication";
import spotifyPlaybackData from "../spotifyPlaybackData";
import MuiMusicPlayer from "./components/MuiMusicPlayer";

let spotify = new SpotifyWebApi();

function DanceParty(props) {
    const [display, setDisplay] = useState(<SpotifyLogin />);
    const [cookies, setCookie, removeCookie] = useCookies();
    const [authToken, setAuthToken] = useState(null);
    const [currentPlayback, setCurrentPlayback] = useState();
    const [remoteProgressMs, setRemoteProgressMs] = useState();
    const { postSpotifyVisualizeData } = useServerCommunication();

    function updatePlaybackState() {
        let currentAlbumId = null;

        spotify.getMyCurrentPlaybackState().then(
            (res) => {
                setCurrentPlayback(res);
            },
            (err) => {
                // console.log(err);
            }
        );
    }

    function checkPlaybackChanged() {
        spotify.getMyCurrentPlaybackState().then((res) => {
            setRemoteProgressMs(res.progress_ms);
            if (res.item.id !== currentPlayback.item.id) {
                console.log("Updating playback state");
                setCurrentPlayback(res);
            }
        });
    }

    useEffect(() => {
        let currentAlbumId = null;
        let currentTrackId = null;
        let trackProgress = null;
        const start = new Date();
        let start_ms = start.getTime();

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
        //     spotify.getAudioAnalysisForTrack(currentTrackId).then((res) => {
        //         const analysisData = res;
        //         const end = new Date();
        //         const lagTimeMs = end.getTime() - start_ms;
        //         postSpotifyVisualizeData(
        //             props.currentDevice,
        //             trackProgress,
        //             analysisData,
        //             lagTimeMs
        //         );
        //     });
        // })
    }, [authToken]);

    useEffect(() => {
        const checkRemotePlaybackInterval = setInterval(
            checkPlaybackChanged,
            3000
        );

        return () => {
            clearInterval(checkRemotePlaybackInterval);
        };
    }, [currentPlayback]);

    useEffect(() => {
        if (currentPlayback) {
            setDisplay(
                <MuiMusicPlayer
                    currentPlayback={currentPlayback}
                    updatePlaybackState={updatePlaybackState}
                    remoteProgressMs={remoteProgressMs}
                />
            );
        }
    }, [currentPlayback, remoteProgressMs]);

    return <div>{display}</div>;
}

export default DanceParty;
