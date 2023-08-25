import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomAppBar from './components/CustomAppBar';
import Home from './pages/Home';
import About from './pages/About';
import DevTable from './pages/DevTable';
import DevTableSandi from './pages/DevTableSandi';
import DevTableInput from './pages/DevTableInput';

function App() {
    return (
        <Router>
            <div className="App">
                <CustomAppBar />
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/about" exact element={<About />} />
                    <Route path="/tablereport" exact element={<DevTable/>} />
                    <Route path="/tablesandi" exact element={<DevTableSandi />} />
                    <Route path="/tableinput" exact element={<DevTableInput />} />
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
  );
}

export default App;
