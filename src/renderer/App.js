import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { grey, yellow, black } from "@material-ui/core/colors";
import Routes from "./Routes";
import StatusBar from './components/StatusBar';
import Snackbar from '@material-ui/core/Snackbar';
import CustomSnackbarContent from "./components/CustomSnackbarContent";

const yellow_theme = createMuiTheme({
    palette: {
        secondary: {
            main: grey[900]
        },
        primary: {
            main: yellow[500]
        }
    },
    typography: {
        useNextVariants: true,
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "Lato",
            "sans-serif"
        ].join(",")
    },
    overrides: {
        MuiDialog: {
            paper: {
                backgroundColor: '#DDDDDD',
                border: '#FFEB3B 2px solid'
            }
        }
    }
});

const dark_theme = createMuiTheme({
    type: 'dark',
    palette: {
        secondary: {
            main: '#ffffff'
        },
        primary: {
            main: '#000000'
        }
    },
    typography: {
        useNextVariants: true,
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "Lato",
            "sans-serif"
        ].join(",")
    }
});


export default class App extends Component {
    constructor(props) {
        super(props);

        ipcRenderer.on('Grinbox::Status', (event, status, message) => {
            if (status == "SUCCESS") {
                this.setState({
                    snackbarStatus: "success",
                    snackbarMessage: message
                });
            } else if (status == "ERROR") {
                this.setState({
                    snackbarStatus: "error",
                    snackbarMessage: message
                });
            }
        });

        this.state = {
            isDarkMode: false,
            snackbarMessage: "",
            snackbarStatus: "success",
        };

        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    getBackgroundColor() {
        if (this.state.isDarkMode) {
            return '#333333';
        } else {
            return '#DDDDDD';
        }
    }

    getTheme() {
        if (this.state.isDarkMode) {
            return (dark_theme);
        } else {
            return (yellow_theme);
        }
    }

    handleSnackbarClose(event) {
        this.setState({
            snackbarStatus: "success",
            snackbarMessage: "",
        });
    }

    render() {
        return (
            <React.Fragment>
                <style>{'body { background-color: ' + this.getBackgroundColor() + '; }'}</style>
                <MuiThemeProvider theme={this.getTheme()}>
                    <Routes {...this.state} />
                    <Snackbar
                        autoHideDuration={4000}
                        open={this.state.snackbarMessage.length > 0}
                        onClose={this.handleSnackbarClose}
                    >
                        <CustomSnackbarContent
                            onClose={this.handleSnackbarClose}
                            variant={this.state.snackbarStatus}
                            message={this.state.snackbarMessage}
                        />
                    </Snackbar>
                    <StatusBar {...this.state} />
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}