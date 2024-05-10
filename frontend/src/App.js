
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoviePage from './pages/MoviePage'; 
import SeriesPage from './pages/SeriesPage'; 
import ReviewPage from './pages/ReviewPage';
import EpisodesPage from './pages/EpisodesPage';
import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Home/>}></Route>
          <Route path = "/login" element = {<Login/>}></Route>
          <Route path = "/register" element = {<Register/>}></Route>
          <Route path = "/movie/:titleId" element = {<MoviePage/>}></Route> 
          <Route path = "/series/:titleId" element = {<SeriesPage/>}></Route>
          <Route path = "/review" element = {<ReviewPage/>}></Route>
          <Route path = "/episode" element = {<EpisodesPage/>}></Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
