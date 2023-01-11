import React, { useEffect, useState } from "react";
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
    Nightlife,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "reactjs-popup/dist/index.css";
import AddNewDevicePopup from "./pages/components/AddNewDevicePopup";
import SelectAnimation from "./pages/SelectAnimation";
import SetSolidPreset from "./pages/SetSolidPreset";
import LiveDeviceControl from "./pages/LiveDeviceControl";
import CustomPattern from "./pages/CustomPattern";
import DanceParty from "./pages/DanceParty";
import useApplicationData from "./hooks/useApplicationData";
import { getNameFromDropDownLabel } from "./helpers";
import { useCookies } from "react-cookie";
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
    const {
        currentDevice,
        setCurrentDevice,
        currentDeviceName,
        setCurrentDeviceName,
        devices,
        savedPatterns,
        updateSavedPatterns,
        updateDeviceList,
    } = useApplicationData();
    const classes = useStyles();
    const theme = useTheme();
    const [dropdownList, setDropdownList] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [page, setPage] = useState("animation");
    const [newDevicePopupOpen, setNewDevicePopupOpen] = useState(false);
    const [modifyExistingDevice, setModifyExistingDevice] = useState(false);
    const ADD_NEW_DEVICE_OPTION = "Add New Device..";
    const [spotifyAuthToken, setSpotifyAuthToken] = useState(null);
    const [cookies, setCookie] = useCookies(["spotifyAuthToken"]);

    const [pages, setPages] = React.useState({
        animation: <SelectAnimation currentDevice={currentDevice} />,
        SetSolidPreset: <SetSolidPreset currentDevice={currentDevice} />,
        LiveDeviceControl: <LiveDeviceControl currentDevice={currentDevice} />,
        CustomPattern: (
            <CustomPattern
                currentDevice={currentDevice}
                savedPatterns={savedPatterns}
                updateSavedPatterns={updateSavedPatterns}
            />
        ),
    });

    useEffect(() => {
        setPages({
            ...pages,
            DanceParty: (
                <DanceParty
                    currentDevice={currentDevice}
                    spotifyAuthToken={spotifyAuthToken}
                    devices={devices}
                />
            ),
            CustomPattern: (
                <CustomPattern
                    currentDevice={currentDevice}
                    savedPatterns={savedPatterns}
                    updateSavedPatterns={updateSavedPatterns}
                />
            ),
            animation: <SelectAnimation currentDevice={currentDevice} />,
            SetSolidPreset: <SetSolidPreset currentDevice={currentDevice} />,
            LiveDeviceControl: (
                <LiveDeviceControl
                    currentDevice={currentDevice}
                    currentDeviceName={currentDeviceName}
                />
            ),
        });
    }, [savedPatterns, currentDevice, spotifyAuthToken]);

    const url = window.location.href;
    let spotifyAccessToken = null;
    let expiresIn = null;

    if (url.includes("access_token=")) {
        spotifyAccessToken = url
            .split("access_token=")[1]
            .split("&token_type")[0];
        expiresIn = url.split("expires_in=")[1].split("&state")[0];
    }

    if (spotifyAccessToken && page != "DanceParty") {
        setCookie("spotifyAuthToken", spotifyAccessToken, { path: "/" });
        setSpotifyAuthToken(spotifyAccessToken);
        window.history.pushState(null, null, "/");
        setPage("DanceParty");
    }

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        if (!newDevicePopupOpen) {
            updateDeviceList();
        }
    }, [newDevicePopupOpen]);

    useEffect(() => {
        const deviceOptions = devices.map((d) => {
            return {
                value: d.ip_address,
                label: `${d.name} - ${d.ip_address}`,
            };
        });
        deviceOptions.push(ADD_NEW_DEVICE_OPTION);
        setDropdownList(deviceOptions);
        if (dropdownList.length) {
            setCurrentDevice(dropdownList[0].value);
            setCurrentDeviceName(
                getNameFromDropDownLabel(dropdownList[0].label)
            );
        }
    }, [devices]);

    let dropdown =
        devices.length > 0 ? (
            <Dropdown
                className={classes.dropDown}
                options={dropdownList}
                value={currentDevice}
                onChange={(dropValue) => {
                    if (dropValue.value == ADD_NEW_DEVICE_OPTION) {
                        setModifyExistingDevice(false);
                        setNewDevicePopupOpen(true);
                        dropValue.value = "";
                        return;
                    }
                    setCurrentDevice(dropValue.value);
                    setCurrentDeviceName(
                        getNameFromDropDownLabel(dropValue.label)
                    );
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
                    [classes.appBarShift]: drawerOpen,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: drawerOpen,
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
                        modifyExisting={modifyExistingDevice}
                        currentDevice={currentDevice}
                        devices={devices}
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
                            if (currentDevice) setModifyExistingDevice(true);
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
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen,
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
                        key={"LiveDeviceControl"}
                        onClick={() => {
                            setPage("LiveDeviceControl");
                        }}
                    >
                        <ListItemIcon>
                            <Tune />
                        </ListItemIcon>
                        <ListItemText primary={"Live Device Control"} />
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
                    <ListItem
                        button
                        key={"DanceParty"}
                        onClick={() => {
                            setPage("DanceParty");
                        }}
                    >
                        <ListItemIcon>
                            <Nightlife />
                        </ListItemIcon>
                        <ListItemText primary={"Dance Party"} />
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
