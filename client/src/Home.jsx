import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from './contexts/user.context'
import { StateContext } from './contexts/StateContext'
import TabsView from './bartender/TabsView'
import OrdersView from './orders/OrdersView'
import Menu from './menu/Menu'
import Login from './login/Login'
import PrivateRoute from './PrivateRoute'
import './Home.css';

function Home() {

  const {user} = useContext(UserContext);
  const {customers, setCustomers} = useContext(StateContext);
  const {setDrinksDict} = useContext(StateContext);
  const {setIsBarOpen} = useContext(StateContext);
  const [orders, setOrders] = useState({});
  const [areTabsMaintained, setAreTabsMaintained] = useState(false);
  const [areOrdersMaintained, setAreOrdersMaintained] = useState(false);
  const [areSettingsMaintained, setAreSettingsMaintained] = useState(false);

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
    // fetch for bartender and customer
    if (user?.customData?.role === 'customer' || user?.customData?.role === 'bartender') {
    // if (user?.customData?.role === 'bartender') { // only fetch tabs if the user is a bartender
      fetchTabs();
    }
  }, [user, setCustomers]);

  useEffect(() => {
    async function maintainTabs() {
      try {
        const client = user.mongoClient("mongodb-atlas"); // Create client if needed
        const collection = client.db("VirtualHaddDB").collection("users");
        const changeStream = collection.watch(); // Start change stream
        for await (const change of changeStream) {
          if(change.operationType === 'update') {
            const changedCustomerId = change.fullDocument._id.toString();
            setCustomers(oldCustomers => {
              const newCustomers = oldCustomers.map((customer) => {
                if (customer._id === changedCustomerId) {
                  customer.tab_balance = parseFloat(change.fullDocument.tab_balance);
                  customer.venmo = change.fullDocument.venmo;
                }
                return customer;
              });
              return newCustomers;
            });
          }
        }
      } catch (error) {
        // Handle errors (including WebSocket errors)
        console.error('Error maintaining tabs:', error);
        setAreTabsMaintained(false);
      } finally {
        setAreTabsMaintained(false);
      }
    }
     // only maintain tabs if the user is a bartender and tabs are not already being maintained
    if (user?.customData?.role === 'bartender' && !areTabsMaintained) {
      maintainTabs();
      setAreTabsMaintained(true);
    }
  }, [user, setCustomers, areTabsMaintained, setAreTabsMaintained])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const activeOrders = await user.functions.getActiveOrders();
        // map the database results to a more friendly format
        setOrders(activeOrders.reduce((acc, order) => {
          const orderId = order._id.toString();
          acc[orderId] = {
            ...order,
            _id: orderId
          };
          return acc;
        }, {}));
      } catch (error) {
        console.error("Failed to fetch orders: ", error);
      }
    }
    // only fetch orders if user is a bartender or customer
    if (user?.customData?.role === 'bartender' || user?.customData?.role === 'customer') {
      fetchOrders();
    }
  } , [user]);

  useEffect(() => {
    async function maintainOrders() {
      try {
        const client = user.mongoClient("mongodb-atlas");
        const collection = client.db("VirtualHaddDB").collection("orders");
        const changeStream = collection.watch();
        for await (const change of changeStream) {
          const orderId = change.fullDocument._id.toString();
          if (change.fullDocument.status === "pending" || change.fullDocument.status === "claimed") {
            setOrders((oldOrders) => {
              return {
                ...oldOrders,
                [orderId]: {
                  ...change.fullDocument,
                  _id: orderId,
                },
              };
            });
          } else { // Remove order if status is updated to "completed" or "cancelled":
            setOrders((oldOrders) => {
              const newOrders = { ...oldOrders };
              delete newOrders[orderId];
              return newOrders;
            });
          }
        }
      } catch (error) {
        console.error('Error maintaining orders:', error);
        setAreOrdersMaintained(false);
      } finally {
        setAreOrdersMaintained(false);
      }
    }
  
    if (
      (user?.customData?.role === 'bartender' || user?.customData?.role === 'customer') &&
      !areOrdersMaintained
    ) {
      maintainOrders();
      setAreOrdersMaintained(true);
    }
  }, [user, areOrdersMaintained, setAreOrdersMaintained]);
  
  // fetches entire menu for reference in the ordering page
  useEffect( () => {
    async function fetchDrinks() {
      try {
        const fetchedDrinks = await user.functions.getAllDrinks();
        setDrinksDict(fetchedDrinks.reduce((acc, drink) => {
          const drinkId = drink._id.toString();
          acc[drinkId] = {
            id: drinkId,
            name: drink.name,
            description: drink.description,
            price: parseFloat(drink.price),
            image: drink.image,
            liquors: drink.liquors,
            variety: drink.variety,
            soldOut: drink.soldOut,
            isVisible: drink.isVisible,
          }; 
          return acc;
        }, {}));
      }
      catch (error) {
        console.error("Failed to fetch drinks: ", error);
      }
    }
    if (user) {
      fetchDrinks();
    }
  }, [user, setDrinksDict]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await user.functions.getSettings();
        setIsBarOpen(settings.isBarOpen);
      } catch (error) {
        console.error("Failed to fetch settings: ", error);
      }
    }
    if (user?.customData?.role === 'bartender' || user?.customData?.role === 'customer'){
      fetchSettings();
    }
  }, [user, setIsBarOpen]);

  useEffect(() => {
    async function maintainSettings() {
      try {
        const client = user.mongoClient("mongodb-atlas");
        const collection = client.db("VirtualHaddDB").collection("settings");
        const changeStream = collection.watch();
        for await (const change of changeStream) {
          setIsBarOpen(change.fullDocument.isBarOpen);
        }
      } catch (error) {
        console.error('Error maintaining settings:', error);
        setAreSettingsMaintained(false);
      } finally {
        setAreSettingsMaintained(false);
      }
    }
  
    if (
      (user?.customData?.role === 'bartender' || user?.customData?.role === 'customer') &&
      !areSettingsMaintained
    ) {
      maintainSettings();
      setAreSettingsMaintained(true);
    }
  }, [user, areSettingsMaintained, setIsBarOpen, setAreSettingsMaintained]);


  /**
   * Separates routes based on user role, so bartender and customer have different routes
   * @returns route paths based on user role
   */
  function splitRoutes () {
    if (user?.customData?.role === 'bartender') {
      return (
        <>
          <Route path="/" element={<TabsView customers={customers}/>} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<OrdersView orders={orders} setOrders={setOrders}/>} />
          <Route path="/ordering/:customerUsername" element={<Menu/>} />
        </>
      )
    } else if (user?.customData?.role === 'customer'){
      return (
        <>
          <Route path="/" element={<Menu />} />
          <Route path ="/cart" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<OrdersView orders={orders} setOrders={setOrders}/>} />

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