import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContext } from './contexts/user.context'
import BartenderView from './bartender/BartenderView'
import Login from './login/Login'
import PrivateRoute from './PrivateRoute'
import './Home.css';

function Home() {

  const {user} = useContext(UserContext);
  

  return (
    <div className='body'>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          {/* We are protecting the rest of the application from unauthenticated */}
          {/* users by wrapping it with PrivateRoute here. */}
          <Route element={<PrivateRoute />}>
            <Route exact path="/" element={<BartenderView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Home;