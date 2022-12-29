import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core/";
import {
    Settings,
    Tune,
    Traffic,
    Palette,
    ChevronRight,
    ChevronLeft,
    Texture,
    Menu,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "reactjs-popup/dist/index.css";
import AddNewDevicePopup from "./pages/components/AddNewDevicePopup";
import SelectAnimation from "./pages/SelectAnimation";
import SetSolidPreset from "./pages/SetSolidPreset";
import CreateColorSliders from "./pages/CreateColorSliders";
import CustomPattern from "./pages/CustomPattern";

import { DictToDeviceList } from "./DisplayDevice";
import useServerCommunication from "./serverCommunication";
import useApplicationData from "./hooks/useApplicationData";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    dropDown: { width: "25%" },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Navigation() {
    const { appState, setCurrentDevice, setDevices, setSavedPatterns } =
        useApplicationData();
    const classes = useStyles();
    const theme = useTheme();
    const [dropdownList, setDropdownList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [page, setPage] = React.useState("animation");
    const [newDevicePopupOpen, setNewDevicePopupOpen] = React.useState(false);
    const { getDeviceList, getPatternsList } = useServerCommunication();
    const [modifyExisting, setModifyExisting] = React.useState(false);
    const ADD_NEW_DEVICE_OPTION = "Add New Device..";

    const [pages, setPages] = React.useState({
        animation: <SelectAnimation currentDevice={appState.currentDevice} />,
        SetSolidPreset: (
            <SetSolidPreset currentDevice={appState.currentDevice} />
        ),
        CreateColorSliders: (
            <CreateColorSliders currentDevice={appState.currentDevice} />
        ),
        CustomPattern: (
            <CustomPattern
                currentDevice={appState.currentDevice}
                savedPatterns={appState.savedPatterns}
            />
        ),
    });

    useEffect(() => {
        setPages({
            ...pages,
            CustomPattern: (
                <CustomPattern
                    currentDevice={appState.currentDevice}
                    savedPatterns={appState.savedPatterns}
                />
            ),
        });
    }, [appState.savedPatterns]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!newDevicePopupOpen) {
            getDeviceList().then((res) => {
                setDevices(DictToDeviceList(res.data));
            });
        }
    }, [newDevicePopupOpen]);

    useEffect(() => {
        getPatternsList().then((res) => {
            let patterns = [];
            for (const [_, value] of Object.entries(res.data)) {
                patterns.push(value);
            }
            setSavedPatterns(patterns);
        });
    }, []);

    useEffect(() => {
        const deviceOptions = appState.devices.map((d) => {
            return {
                value: d.ip_address,
                label: `${d.name} - ${d.ip_address}`,
            };
        });
        deviceOptions.push(ADD_NEW_DEVICE_OPTION);
        setDropdownList(deviceOptions);
        if (dropdownList.length) {
            setCurrentDevice(dropdownList[0].value);
        }
    }, [appState.devices]);

    let dropdown =
        appState.devices.length > 0 ? (
            <Dropdown
                className={classes.dropDown}
                options={dropdownList}
                value={appState.currentDevice}
                onChange={(dropValue) => {
                    if (dropValue.value == ADD_NEW_DEVICE_OPTION) {
                        setModifyExisting(false);
                        setNewDevicePopupOpen(true);
                        dropValue.value = "";
                        return;
                    }
                    setCurrentDevice(dropValue.value);
                }}
                placeholder="Select a Device"
            />
        ) : (
            <>No Devices Available</>
        );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        RGB Everywhere
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6" noWrap>
                        Current Device :
                    </Typography>
                    <Box sx={{ flexGrow: 0.025 }} />
                    {dropdown}
                    <AddNewDevicePopup
                        modifyExisting={modifyExisting}
                        currentDevice={appState.currentDevice}
                        devices={appState.devices}
                        open={newDevicePopupOpen}
                        closePopup={() => setNewDevicePopupOpen(false)}
                    />
                    <Button
                        sx={{
                            marginLeft: "1%",
                            background: "Green",
                            color: "white",
                        }}
                        onClick={() => {
                            if (appState.currentDevice) setModifyExisting(true);
                            setNewDevicePopupOpen(!newDevicePopupOpen);
                        }}
                    >
                        <Settings />
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRight />
                        ) : (
                            <ChevronLeft />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem
                        button
                        key={"choosePattern"}
                        onClick={() => {
                            setPage("animation");
                        }}
                    >
                        <ListItemIcon>
                            <Traffic />
                        </ListItemIcon>
                        <ListItemText primary={"Animated Patterns"} />
                    </ListItem>
                    <ListItem
                        button
                        key={"choosePresetColor"}
                        onClick={() => {
                            setPage("SetSolidPreset");
                        }}
                    >
                        <ListItemIcon>
                            <Palette />
                        </ListItemIcon>
                        <ListItemText primary={"Preset Colors"} />
                    </ListItem>
                    <ListItem
                        button
                        key={"CreateColorSliders"}
                        onClick={() => {
                            setPage("CreateColorSliders");
                        }}
                    >
                        <ListItemIcon>
                            <Tune />
                        </ListItemIcon>
                        <ListItemText primary={"Create Color"} />
                    </ListItem>
                    <ListItem
                        button
                        key={"CustomPattern"}
                        onClick={() => {
                            setPage("CustomPattern");
                        }}
                    >
                        <ListItemIcon>
                            <Texture />
                        </ListItemIcon>
                        <ListItemText primary={"DIY Patterns"} />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />

                {pages[page]}
            </main>
        </div>
    );
}
