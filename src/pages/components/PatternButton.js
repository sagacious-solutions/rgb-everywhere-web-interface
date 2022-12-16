import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { purple } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        "&:hover": {
            backgroundColor: purple[700],
        },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function PatternButton(props) {
    const classes = useStyles();
    return (
        <ColorButton
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={props.onClick}
        >
            {props.buttonText}
        </ColorButton>
    );
}
