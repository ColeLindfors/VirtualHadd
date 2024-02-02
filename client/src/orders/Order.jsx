import React, {useContext} from 'react';
import { StateContext } from '../contexts/StateContext';
import { UserContext } from '../contexts/user.context';
import './Order.css';

function Order({ order, scrollToTop }) {
    const { customers } = useContext(StateContext);
    const { drinksDict } = useContext(StateContext);
    const { user } = useContext(UserContext);
    const customer = customers.find((customer) => customer._id === order.customer_id);

    const displayDrinks = order.drinks.reduce((acc, drinkId) => {
        if (acc[drinkId]) {
            acc[drinkId]++;
        } else {
            acc[drinkId] = 1;
        }
        return acc;
    }, {});

    function statusString() {
		// check the names array for the claimed_by id
        let claimedByFirstName = customers.find((customer) => customer._id === order.claimed_by)?.first_name;
        claimedByFirstName = claimedByFirstName ? claimedByFirstName : "Unknown"; // default to "Unknown" if the bartender is not found
        const dateObj = new Date(order.date);
        // map date to local time string (e.g. 12:30 PM)
        const formattedTime = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
		// map the status to the corresponding string
		switch (order.status) {
			case "pending":
				return "Pending at " + formattedTime;
            case "claimed":
                return "Claimed by " + claimedByFirstName + " at " + formattedTime;
			default:
				return "Unknown Status";
		}
	}

    function renderButtons() {
        if (user.customData.role === "bartender") {
            if (order.status === "pending") {
                return (
                    <div className="button-container">
                        <button className="button decline-button" onClick={() => handleOrderStatusChange("declined")}>
                            Decline
                        </button>
                        <button className="button claim-button" onClick={() => handleOrderStatusChange("claimed")}>
                            Claim
                        </button>
                    </div>
                );
            } else if (order.status === "claimed" && order.claimed_by === user.customData._id) {
                return (
                    <div className="button-container">
                        <button className="button unclaim-button" onClick={() => handleOrderStatusChange("pending")}>
                            Unclaim
                        </button>
                        <button className="button complete-button" onClick={() => handleOrderStatusChange("completed")}>
                            Complete
                        </button>
                    </div>
                );
            }
        } else if (user.customData.role === "customer" && order.status === "pending" && order.customer_id === user.customData._id) {
            return (
                <div className="button-container">
                    <button className="button cancel-button" onClick={() => handleOrderStatusChange("cancelled")}>
                        Cancel
                    </button>
                </div>
            );
        }
    }

    async function handleOrderStatusChange(newStatus) {
        try {
            // update the order status in the database
            const timeISO = new Date().toISOString();
            await user.functions.updateOrderStatus({orderId: order._id, newStatus: newStatus, timeString: timeISO, bartenderId: user.customData._id});
        } catch (error) {
            console.error("Failed to update order status: ", error);
        }
        if (newStatus === "completed") {
            // increment the customer's tab balance
            let orderTotal = 0;
            for (const drinkId in displayDrinks) {
                const drink = drinksDict[drinkId];
                orderTotal += drink.price * displayDrinks[drinkId];
            }
            orderTotal = orderTotal.toFixed(2);
            const incrementTabPromise = user.functions.incrementTabById({userId: order.customer_id, amount: parseFloat(orderTotal)});
            incrementTabPromise.then(result => {
                // ? Unused right now, but could be used later
            }).catch((error) => {
                console.error(error);
            });
        }
        if (newStatus === "claimed") {
            scrollToTop();
        }
    }

    // highlight the border of order if it is claimed by you
    const borderHighlight = order.claimed_by === user.customData._id ? "highlight" : "";

    return (
        <div className={`order-container ${borderHighlight}`}>
            <h3 className="order-header">{customer?.first_name} {customer?.last_name}</h3>
            <h3 className={order.status === "pending" ? "order-header pending" : "order-header claimed"}>
                {statusString()}
            </h3>
            <ul className="drinks-list">
                {Object.entries(displayDrinks).map(([drinkId, quantity]) => {
                    const drink = drinksDict[drinkId];
                    return (
                        <li className="drink-row" key={drinkId}>
                            <img className="drink-icon" src={drink?.image} alt={drink?.name} />
                            <p className="p x-divider">x</p>
                            <p className="p">{quantity}</p>
                            <p className="p drink-name">{drink?.name}</p>
                        </li>
                    );
                })}
            </ul>
            {renderButtons()}
        </div>
    );
}

export default Order;