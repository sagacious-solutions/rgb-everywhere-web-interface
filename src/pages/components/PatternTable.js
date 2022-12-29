import * as React from "react";
import { Avatar } from "@mui/material";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { HighlightOff, PublishedWithChanges, Edit } from "@mui/icons-material";
import useServerCommunication from "../../serverCommunication";
import { colorToCssRgb, patternToRgbArray } from "../../helpers";

/**
 * Generates the pattern dots for visualization in the table
 * @param {*} pattern An arrar of colors to display
 * @returns A row of colored circles surrounded in a div
 */
function generatePatternDots(pattern) {
    let avatars = [];
    pattern.forEach((color, index) => {
        avatars.push(
            <Avatar
                className="Avatars"
                key={`color-circle-${index}`}
                sx={{
                    backgroundColor: colorToCssRgb(color),
                    border: "1px solid black",
                    marginLeft: "2px",
                    width: "20px",
                    height: "20px",
                    "&:hover": {
                        width: "25px",
                        height: "25px",
                    },
                }}
                children={""}
            />
        );
    });

    return (
        <Stack
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            {avatars}
        </Stack>
    );
}

function createTableRows(
    patterns,
    editPattern,
    postDeletePattern,
    postUpdatePattern,
    currentPattern,
    updateSavedPatterns,
    setCurrentDeviceToPattern
) {
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
                <TableCell
                    component="th"
                    scope="row"
                    onClick={() => {
                        setCurrentDeviceToPattern(pattern);
                    }}
                >
                    {generatePatternDots(pattern)}
                </TableCell>
                <TableCell
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "end",
                        alignContent: "center",
                    }}
                    align="right"
                >
                    <Edit
                        sx={{
                            marginRight: "24px",
                            "&:hover": {
                                fontSize: 30,
                                color: "blue",
                                marginRight: "20px",
                                marginTop: "-3px",
                                marginBottom: "-3px",
                            },
                        }}
                        onClick={() => editPattern([...pattern])}
                    />
                    <PublishedWithChanges
                        sx={{
                            marginRight: "24px",
                            "&:hover": {
                                fontSize: 30,
                                color: "blue",
                                marginRight: "20px",
                                marginLeft: "-2px",
                                marginTop: "-3px",
                                marginBottom: "-3px",
                            },
                        }}
                        onClick={() => {
                            postUpdatePattern(
                                pattern,
                                patternToRgbArray(currentPattern)
                            ).then(updateSavedPatterns);
                        }}
                    />
                    <HighlightOff
                        sx={{
                            marginRight: "15px",
                            "&:hover": {
                                fontSize: 30,
                                color: "blue",
                                marginLeft: "-3px",
                                marginRight: "12px",
                                marginTop: "-3px",
                                marginBottom: "-3px",
                            },
                        }}
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
    const { postDeletePattern, postUpdatePattern } = useServerCommunication();

    return (
        <TableContainer
            sx={{ height: "400px", width: "60%" }}
            component={Paper}
        >
            <Table aria-label="pattern table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pattern</TableCell>
                        <TableCell align="right">
                            Edit / Replace / Delete
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {createTableRows(
                        props.patterns,
                        props.editPattern,
                        postDeletePattern,
                        postUpdatePattern,
                        props.currentPattern,
                        props.updateSavedPatterns,
                        props.setCurrentDeviceToPattern
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
