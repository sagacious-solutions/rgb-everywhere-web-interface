import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

let spotify = new SpotifyWebApi();

export default function useSpotifyData() {
    const checkRemoteStateIntervalSecs = 5;
    const oneSecondInMs = 1000;
    const thresholdTimeChangeMs = 3000;
    const [playbackState, setPlaybackState] = useState({
        currentTrackId: null,
        durationMs: null,
        durationSecs: null,
        progressMs: null,
        progressSecs: null,
        albumCoverUrl: null,
        remoteProgressMs: null,
        artists: null,
        trackName: null,
        albumName: null,
    });
    const [audioAnalysis, setAudioAnalysis] = useState(null);
    // Handle tracking song progress
    useEffect(() => {
        if (playbackState.currentTrackId) {
            const startTime = new Date().getTime();
            const interval = setInterval(() => {
                const timeDiff = new Date().getTime() - startTime;
                setPlaybackState({
                    ...playbackState,
                    progressSecs: Math.floor(
                        playbackState.progressSecs + timeDiff / oneSecondInMs
                    ),
                    progressMs: playbackState.progressMs + timeDiff,
                });
            }, oneSecondInMs);

            return () => {
                clearInterval(interval);
            };
        }
    }, [playbackState]);

    // Monitor for change of song or seek to positions
    useEffect(() => {
        if (
            playbackState.currentTrackId &&
            playbackState.progressSecs % checkRemoteStateIntervalSecs == 0
        ) {
            checkPlaybackChanged();
        }
    }, [playbackState.progressSecs]);

    /**
     * Authorizes spotify API to retrieve data
     * @param {string} accessToken
     */
    function authorize(accessToken) {
        spotify.setAccessToken(accessToken);
    }

    /**
     * Makes a call to Spotify API for current play back state and returns the promise
     * @returns Promise of Spotify API Results
     */
    function getRemotePlaybackState() {
        return spotify.getMyCurrentPlaybackState();
    }

    /**
     * Fetches the remote playback state. If the song has changed or track progress
     * no longer matches the local track progress, updates the playback state
     */
    function checkPlaybackChanged() {
        getRemotePlaybackState().then((res) => {
            if (
                res.item.id !== playbackState.currentTrackId ||
                res.progress_ms <
                    playbackState.progressMs - thresholdTimeChangeMs ||
                res.progress_ms >
                    playbackState.progressMs + thresholdTimeChangeMs
            ) {
                updateStateFromResponse(res);
            }
        });
    }

    /**
     * Updates the playback state object from a response object from spotify API
     * @param {response} res Response from rquest to API
     */
    function updateStateFromResponse(res) {
        const remoteProgressMs = res.progress_ms;

        setPlaybackState({
            ...playbackState,
            remoteProgressMs: res.progress_ms,
            currentTrackId: res.item.id,
            albumCoverUrl: res.item.album.images[0].url,
            durationMs: res.item.duration_ms,
            durationSecs: Math.floor(res.item.duration_ms / oneSecondInMs),
            progressMs: remoteProgressMs,
            progressSecs: Math.floor(remoteProgressMs / oneSecondInMs),
            albumCoverUrl: res.item.album.images[0].url,
            artists: res.item.artists,
            trackName: res.item.name,
            albumName: res.item.album.name,
            remoteProgressMs: remoteProgressMs,
        });
    }

    /**
     * Updates the current playbackState object
     */
    function updatePlaybackState() {
        getRemotePlaybackState().then((res) => {
            updateStateFromResponse(res);
        });
    }

    /**
     * Gets the Audio Analysis data from the spotify api for the current track
     * @returns Promise of API Call for data
     */
    function getAudioAnalysis() {
        return spotify.getAudioAnalysisForTrack(playbackState.currentTrackId);
    }

    return {
        authorize,
        playbackState,
        audioAnalysis,
        updatePlaybackState,
        getAudioAnalysis,
        // checkPlaybackChanged,
    };
}
