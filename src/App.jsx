import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import PomodoroTimer from './PomodoroTimer';
import Layout from './Header/Layout';
import Login from './Login';
import Heatmap from './Heatmap';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PomodoroTimer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/heatmap" element={<Heatmap/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />)

