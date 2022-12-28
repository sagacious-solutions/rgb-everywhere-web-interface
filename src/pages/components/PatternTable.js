import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(pattern, replace, remove) {
    return { pattern, replace, remove };
}

const rows = [
    createData(
        [
            [255, 0, 0],
            [0, 255, 0],
        ],
        null,
        null
    ),
];

export default function PatternTable(props) {
    return (
        <TableContainer sx={{ width: "60%" }} component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pattern</TableCell>
                        <TableCell align="right">Replace Current</TableCell>
                        <TableCell align="right">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {row.pattern}
                            </TableCell>
                            <TableCell align="right">{row.replace}</TableCell>
                            <TableCell align="right">{row.remove}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
