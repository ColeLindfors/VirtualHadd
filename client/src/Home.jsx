import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from './contexts/user.context'
import TabsView from './bartender/TabsView'
import Menu from './menu/Menu'
import CustomerCart from './customer/CustomerCart'
import Login from './login/Login'
import PrivateRoute from './PrivateRoute'
import './Home.css';

function Home() {

  const {user} = useContext(UserContext);
  const [customers, setCustomers] = useState([]);

  useEffect( () => {
    async function fetchTabs() {
      try {
        const allCustomers = await user.functions.getAllTabs();
        // map the database results to a more friendly format
        setCustomers(allCustomers
          .filter((customer) => customer.first_name !== 'guestFirstName')
          .map((customer) => ({
            _id: customer._id.toString(),
            first_name: customer.first_name,
            last_name: customer.last_name,
            tab_balance: parseFloat(customer.tab_balance),
            venmo: customer.venmo,
        })));
      } catch (error) {
        console.error("Failed to fetch tabs: ", error);
      }
    }
    if (user?.customData?.role === 'bartender') { // only fetch tabs if the user is a bartender
      fetchTabs();
    }
  }, [user]);

  /**
   * Separates routes based on user role, so bartender and customer have different routes
   * @returns route paths based on user role
   */
  function splitRoutes () {
    if (user?.customData?.role === 'bartender') {
      return (
        <>
          <Route path="/" element={<TabsView customers={customers} setCustomers={setCustomers}/>} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/ordering/:customerUsername" element={<Menu/>} />
        </>
      )
    } else if (user?.customData?.role === 'customer'){
      return (
        <>
          <Route path="/" element={<Menu />} />
          <Route path ="/cart" element={<CustomerCart />} />
          <Route path="/menu" element={<Menu />} />

        </>
      )
    } else { // guest
      return (
        <>
          <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
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