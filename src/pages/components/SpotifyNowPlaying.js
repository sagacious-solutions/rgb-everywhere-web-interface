import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import { Box, Slider, Typography } from "@mui/material";
const useStyles = makeStyles({
    nowPlaying: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: "2em",
        backgroundColor: "rgba(100,100,255,0.3)",
        borderRadius: "50px",
        border: "1px solid black",
        boxShadow: "3px 3px 10px rgba(75,75,255,0.5)",
    },
    trackDetails: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Trocchi",
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        textShadow: "1px 1px 10px black",
        width: "50%",
    },
    progressBar: { width: "90%", marginBottom: "0.5em" },
    timeText: { color: "black" },
    progressSlider: {
        color: "rgba(0,0,0,0.87)",
        height: 4,
        "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px "rgb(255 255 255 / 16%)"`,
            },
            "&.Mui-active": {
                width: 20,
                height: 20,
            },
        },
        "& .MuiSlider-rail": {
            opacity: 0.28,
        },
    },
});

const TinyText = styled(Typography)({
    fontSize: "0.75rem",
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export default function SpotifyNowPlaying(props) {
    const playbackState = props.playbackState;
    const classes = useStyles();

    const artists = playbackState.artists
        .map((artist_dict) => {
            return artist_dict.name;
        })
        .join(", ");

    return (
        <div className={classes.nowPlaying}>
            <img
                src={playbackState.albumCoverUrl}
                alt="spotify-album-cover"
                height={"33%"}
                width={"33%"}
            />
            <div className={classes.trackDetails}>
                <p>{playbackState.trackName}</p>
                <p>{playbackState.albumName}</p>
                <p>{artists}</p>{" "}
                <div className={classes.progressBar}>
                    <Slider
                        className={classes.progressSlider}
                        aria-label="time-indicator"
                        size="large"
                        value={playbackState.progressSecs}
                        min={0}
                        step={1}
                        max={playbackState.durationSecs}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: -2,
                        }}
                    >
                        <TinyText className={classes.timeText}>
                            {formatDuration(playbackState.progressSecs)}
                        </TinyText>
                        <TinyText className={classes.timeText}>
                            -
                            {formatDuration(
                                playbackState.durationSecs -
                                    playbackState.progressSecs
                            )}{" "}
                            / {formatDuration(playbackState.durationSecs)}
                        </TinyText>
                    </Box>
                </div>
            </div>
        </div>
    );
}
