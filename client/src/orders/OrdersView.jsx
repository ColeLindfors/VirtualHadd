import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/user.context';
import { StateContext } from '../contexts/StateContext';
import BartenderHeader from '../bartender/BartenderHeader';
import SearchBar from '../menu/SearchBar';
import CustomerHeader from '../customer/CustomerHeader';
import Order from './Order';
import './OrdersView.css';


function OrdersView ({ orders }) {
    const { user } = useContext(UserContext);
    const { customers } = useContext(StateContext);
    const { isBarOpen } = useContext(StateContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedOrders, setSortedOrders] = useState([]);

    useEffect(() => {
        function sortOrders() {
            if (orders) {
                const claimedBySelf = [];
                const claimedByOthers = [];
                const unclaimed = [];
                for (const order of Object.values(orders)) {
                    if (order.claimed_by === user.customData._id) {
                        claimedBySelf.push(order);
                    } else if (order.claimed_by) {
                        claimedByOthers.push(order);
                    } else {
                        unclaimed.push(order);
                    }
                }
                claimedBySelf.sort((a, b) => new Date(a.date) - new Date(b.date));
                claimedByOthers.sort((a, b) => new Date(a.date) - new Date(b.date));
                unclaimed.sort((a, b) => new Date(a.date) - new Date(b.date));
                const unfilteredOrders = claimedBySelf.concat(unclaimed).concat(claimedByOthers);
                const customerNames = customers.reduce((acc, customer) => {
                    acc[customer._id] = `${customer.first_name} ${customer.last_name}`;
                    return acc;
                }, {});
                const filteredOrders = unfilteredOrders.filter((order) => {
                    return `${customerNames[order.customer_id]}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                });
                setSortedOrders(filteredOrders);
            }
        }
        sortOrders();
    }, [orders, user, searchTerm, customers]);

    async function handleToggleBarStatus(status) {
        try {
            await user.functions.setSetting("isBarOpen", status);
        } catch (error) {
            console.error("Failed to toggle bar status: ", error);
        }
    }

    function scrollToTop() {
        // scroll the scrollable-orders-list to the top
        const scrollableOrdersList = document.querySelector('.scrollable-orders-list');
        scrollableOrdersList.scrollTop = 0;
        
    }

    return (
        <div className="orders-view-container">
            <div className="gray-header-background">
                {user.customData.role === 'bartender'
                    ? <BartenderHeader activeTab='orders' />
                    : <CustomerHeader activeTab='orders' />
                }
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Search for a Lodger..."
                />
            </div>
            <div className="scrollable-orders-list">
                <div className="orders-header">
                    {user.customData.role === 'bartender' ? // only show buttons if user is a bartender
                        (isBarOpen ? // bar is open
                            <button className="close bar-status-button" onClick={() => handleToggleBarStatus(false)}>
                                Close Bar
                            </button>
                        : // bar is closed
                            <button className="open bar-status-button" onClick={() => handleToggleBarStatus(true)}>
                                Open Bar
                            </button>
                        )
                    : // show bar status if user is a customer
                        <h2 className="active-orders-header">
                            Bar is {isBarOpen ? 'Open' : 'Closed'}
                        </h2>
                    }
                    <h2 className="active-orders-header">
                        {sortedOrders.length} Active Order{sortedOrders.length !== 1 ? 's' : ''}
                    </h2>
                </div>
                <div className="orders-list">
                    {sortedOrders.map((order) => (
                        <li className="order-li" key={order._id}>
                            <Order order={order} scrollToTop={scrollToTop}/>
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrdersView;
