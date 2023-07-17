import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContext } from './contexts/user.context'
import BartenderView from './bartender/BartenderView'
import CustomerMenu from './customer/CustomerMenu'
import CustomerCart from './customer/CustomerCart'
import Login from './login/Login'
import PrivateRoute from './PrivateRoute'
import './Home.css';

function Home() {

  const {user} = useContext(UserContext);

  /**
   * Separates routes based on user role, so bartender and customer have different routes
   * @returns route paths based on user role
   */
  function splitRoutes () {
    if (user?.customData?.role === 'bartender') {
      return (
        <>
          <Route path="/" element={<BartenderView />} />
        </>
      )
    } else {
      return (
        <>
          <Route path="/" element={<CustomerMenu />} />
          <Route path ="/cart" element={<CustomerCart />} />
        </>
      )
    }
  }

  return (
    <div className='body'>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            {splitRoutes()}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Home;