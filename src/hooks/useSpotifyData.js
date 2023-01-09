import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

let spotify = new SpotifyWebApi();

export default function useSpotifyData() {
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
                        playbackState.progressSecs + timeDiff / 1000
                    ),
                    progressMs: playbackState.progressMs + timeDiff,
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [playbackState]);

    // Monitor for change of song or seek to positions
    useEffect(() => {
        const monitorForPlaybackChangeInterval = setInterval(() => {
            checkPlaybackChanged();
        }, 5000);

        return () => clearInterval(monitorForPlaybackChangeInterval);
    }, []);

    function authorize(accessToken) {
        spotify.setAccessToken(accessToken);
    }

    function getRemotePlaybackState() {
        return spotify.getMyCurrentPlaybackState();
    }

    function checkPlaybackChanged() {
        getRemotePlaybackState().then((res) => {
            const remoteProgressMs = res.progress_ms;
            let progressMs = playbackState.progressMs;
            if (
                res.item.id !== playbackState.currentTrackId ||
                progressMs - 3 > remoteProgressMs > progressMs + 3
            ) {
                updateStateFromResponse(res);
            }
        });
    }

    function updateStateFromResponse(res) {
        const remoteProgressMs = res.progress_ms;
        let progressMs = playbackState.progressMs;

        if (!progressMs || progressMs - 3 > remoteProgressMs > progressMs + 3) {
            progressMs = remoteProgressMs;
        }
        setPlaybackState({
            ...playbackState,
            remoteProgressMs: res.progress_ms,
            currentTrackId: res.item.id,
            albumCoverUrl: res.item.album.images[0].url,
            durationMs: res.item.duration_ms,
            durationSecs: Math.floor(res.item.duration_ms / 1000),
            progressMs: progressMs,
            progressSecs: Math.floor(progressMs / 1000),
            albumCoverUrl: res.item.album.images[0].url,
            artists: res.item.artists,
            trackName: res.item.name,
            albumName: res.item.album.name,
            remoteProgressMs: remoteProgressMs,
        });
    }

    function updatePlaybackState() {
        return getRemotePlaybackState().then((res) => {
            updateStateFromResponse(res);
        });
    }

    function updateAudioAnalysis() {
        spotify.getMyCurrentPlaybackState().then((res) => {
            spotify
                .getAudioAnalysisForTrack(playbackState.currentTrackId)
                .then((res) => {
                    setAudioAnalysis(res);
                });
        });
    }

    function getAudioAnalysis() {
        return audioAnalysis;
    }

    return {
        authorize,
        playbackState,
        audioAnalysis,
        updatePlaybackState,
        getAudioAnalysis,
        checkPlaybackChanged,
    };
}
