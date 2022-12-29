import * as React from "react";
import { Avatar } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { HighlightOff, PublishedWithChanges } from "@mui/icons-material";
import useServerCommunication from "../../serverCommunication";

/**
 * Takes a color as an Array or Color object and returns the CSS color string
 * @param {*} color
 * @returns a CSS compatible color string
 */
function colorToCssRgb(color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`;
}

function generatePatternDots(pattern) {
    let avatars = [];

    pattern.forEach((color, index) => {
        avatars.push(
            <Avatar
                key={`color-circle-${index}`}
                sx={{
                    backgroundColor: colorToCssRgb(color),
                    marginLeft: "2px",
                    width: "20px",
                    height: "20px",
                }}
                children={""}
            />
        );
    });

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>{avatars}</div>
    );
}

function createTableRows(patterns, postDeletePattern, updateSavedPatterns) {
    const rows = [];
    patterns.forEach((pattern, i) => {
        rows.push(
            <TableRow
                key={`pattern-${i}`}
                sx={{
                    "&:last-child td, &:last-child th": {
                        border: 0,
                    },
                }}
            >
                <TableCell component="th" scope="row">
                    {generatePatternDots(pattern)}
                </TableCell>
                <TableCell align="right">
                    <PublishedWithChanges sx={{ marginRight: "20px" }} />
                    <HighlightOff
                        sx={{ marginRight: "15px" }}
                        onClick={() => {
                            postDeletePattern(pattern).then(
                                updateSavedPatterns
                            );
                        }}
                    />
                </TableCell>
            </TableRow>
        );
    });
    return rows;
}

export default function PatternTable(props) {
    const { postDeletePattern } = useServerCommunication();

    return (
        <TableContainer
            sx={{ height: "400px", width: "60%" }}
            component={Paper}
        >
            <Table aria-label="pattern table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pattern</TableCell>
                        <TableCell align="right">Replace / Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createTableRows(
                        props.patterns,
                        postDeletePattern,
                        props.updateSavedPatterns
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
