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
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
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

function createTableRows(patterns) {
    const rows = [];
    console.log(patterns);
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
                    <PublishedWithChanges />
                </TableCell>
                <TableCell align="right">
                    <HighlightOff />
                </TableCell>
            </TableRow>
        );
    });
    console.log(rows);
    return rows;
}

export default function PatternTable(props) {
    console.log(props.patterns);
    return (
        <TableContainer
            sx={{ height: "400px", width: "60%" }}
            component={Paper}
        >
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pattern</TableCell>
                        <TableCell align="right">Replace Current</TableCell>
                        <TableCell align="right">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{createTableRows(props.patterns)}</TableBody>
            </Table>
        </TableContainer>
    );
}
