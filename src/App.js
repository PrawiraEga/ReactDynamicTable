import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomAppBar from './components/CustomAppBar';
import Home from './pages/Home';
import About from './pages/About';
import DevTable from './pages/DevTable';
import DevTableSandi from './pages/DevTableSandi';
import DevTableInput from './pages/DevTableInput';
import GenerateReport from './pages/GenerateReport';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        /*<ThemeProvider theme={darkTheme}>*/
        <Router>
            <div className="App">
                <CustomAppBar />
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/about" exact element={<About />} />
                    <Route path="/tablereport" exact element={<GenerateReport />} />
                    <Route path="/tableinput" exact element={<DevTableInput />} />
                    <Route path="/tablesandi" exact element={<DevTableSandi />} />
                    
                </Routes>
            </div>
      {/*<div className="App">
                
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      </div>*/}
        </Router>
        /*</ThemeProvider>*/
  );
}

export default App;
