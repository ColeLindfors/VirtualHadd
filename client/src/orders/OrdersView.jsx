import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/user.context';
import { StateContext } from '../contexts/StateContext';
import BartenderHeader from '../bartender/BartenderHeader';
import SearchBar from '../menu/SearchBar';
import CustomerHeader from '../customer/CustomerHeader';
import Order from './Order';
import './OrdersView.css';


function OrdersView ({ orders, setOrders }) {
    const { user } = useContext(UserContext);
    const { customers } = useContext(StateContext);
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
                <h2 className="active-orders-header">
                    {sortedOrders.length} Active Order{sortedOrders.length !== 1 ? 's' : ''}
                </h2>
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
