import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/CustomAppBarStyle.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const CustomAppBar = () => {
    return (
        /*<ThemeProvider theme={darkTheme}>
            <CssBaseline />*/
        <AppBar position="static">
            <Toolbar>
                {/*<Typography variant="h6"></Typography>*/}
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/tablereport">Report</Link>
                        </li>
                        <li>
                            <Link to="/tableinput">Input</Link>
                        </li>
                        <li>
                            <Link to="/tablesandi">Sandi</Link>
                        </li>
                        
                    </ul>
                </nav>
            </Toolbar>
            </AppBar>
        /*</ThemeProvider>*/
    );
};

export default CustomAppBar;
