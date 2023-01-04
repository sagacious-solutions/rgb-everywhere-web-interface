import React, { useState, useEffect } from "react";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";
import SpotifyWebApi from "spotify-web-api-js";
import { useCookies } from "react-cookie";
import useServerCommunication from "../serverCommunication";

let spotify = new SpotifyWebApi();

function DanceParty(props) {
    const [display, setDisplay] = useState(<SpotifyLogin />);
    const [cookies, setCookie, removeCookie] = useCookies();
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const { postSpotifyVisualizeData } = useServerCommunication();

    useEffect(() => {
        if (currentAlbum) {
            setDisplay(<SpotifyNowPlaying currentAlbum={currentAlbum} />);
        }
    }, [currentAlbum]);

    if (cookies.spotifyAuthToken) {
        spotify.setAccessToken(cookies.spotifyAuthToken);
        setTimeout(() => {
            removeCookie("spotifyAuthToken");
        }, 1000);

        let currentAlbumId = null;
        let currentTrackId = null;
        let trackProgress = null;
        const start = new Date();
        let start_ms = start.getTime();

        spotify
            .getMyCurrentPlaybackState()
            .then(
                (res) => {
                    currentTrackId = res.item.id;
                    trackProgress = res.progress_ms;
                    currentAlbumId = res.item.album.id;
                    console.log(res);
                },
                (err) => {
                    console.log(err);
                }
            )
            .then(() => {
                spotify.getAudioAnalysisForTrack(currentTrackId).then((res) => {
                    const analysisData = res;
                    const end = new Date();
                    const lagTimeMs = end.getTime() - start_ms;
                    postSpotifyVisualizeData(
                        props.currentDevice,
                        trackProgress,
                        analysisData,
                        lagTimeMs
                    );
                });
            })
            .then(() => {
                spotify.getAlbum(currentAlbumId).then(
                    function (data) {
                        setCurrentAlbum(data);
                        console.log("Album information", data);
                    },
                    function (err) {
                        console.error(err);
                    }
                );
            });
    }
    return <div>{display}</div>;
}

export default DanceParty;
