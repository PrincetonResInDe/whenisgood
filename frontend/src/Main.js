import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'
import Respond from './Respond'

export default class Main extends React.Component {
    render() {
        return (
            <Routes> {/* The Routes decides which component to show based on the current URL.*/}
              <Route path='/' element={<Home/>}></Route>
              <Route path='/respond' element={<Respond/>}></Route>
            </Routes>
          );
    }
}