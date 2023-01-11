import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    login: {
        display: "grid",
        placeItems: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",

        "& img": {
            width: "50%",
        },

        "& a": {
            padding: "20px",
            borderRadius: "99px",
            backgroundColor: "#1db954",
            fontWeight: 600,
            color: "white",
            textDecoration: "none",
        },

        "& a:hover": {
            backgroundColor: " white",
            borderColor: "#1db954",
            color: "#1db954",
        },
    },
});

var client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
var redirect_uri = "https://localhost:3000/";

// random text
var state = "solkjngfposdjngfposndf";

var scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "app-remote-control",
];

let scope = scopes.join(" ");

var url = "https://accounts.spotify.com/authorize";
url += "?response_type=token";
url += "&client_id=" + encodeURIComponent(client_id);
url += "&scope=" + encodeURIComponent(scope);
url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
url += "&state=" + encodeURIComponent(state);

function SpotifyLogin(props) {
    const classes = useStyles();
    return (
        <div className={classes.login}>
            <img
                src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
                alt="Spotify-Logo"
            />
            <a href={url}>LOGIN WITH SPOTIFY</a>
        </div>
    );
}

export default SpotifyLogin;
