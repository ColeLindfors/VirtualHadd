import React, { useEffect, useContext, useState } from 'react';
import './HistoryPopUp.css';
import './PopUp.css';
import { UserContext } from '../contexts/user.context';

function HistoryPopUp({ showPopUp, customer }) {
    const { user } = useContext(UserContext);
    const [history, setHistory] = useState([]);
    const [names, setNames] = useState([]);
	const [drinks, setDrinks] = useState({});
	const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        async function fetchHistory() {
			const fetchedDrinks = await user.functions.getAllDrinks();
			// map the database results to a more friendly format
			var newDrinks = {};
			for (const drink of fetchedDrinks) {
				newDrinks[drink._id.toString()] = {
					id: drink._id.toString(),
					name: drink.name,
					description: drink.description,
					price: parseFloat(drink.price),
					image: drink.image,
					liquors: drink.liquors,
					variety: drink.variety,
					soldOut: drink.soldOut,
					isVisible: drink.isVisible,
				};
			}
			setDrinks(newDrinks);
            const result = await user.functions.getHistory({ customer_id: customer._id });
            const { newHistory, names } = result;
            setHistory(newHistory);
            setNames(names);
			setLoading(false); // Set loading to false when the data is fetched
			
        }
        fetchHistory();
    }, [customer, user, setHistory, setNames, setDrinks, setLoading]);

	function statusString(status, claimed_by) {
		// map the claimed_by id to a first name
		let claimedByFirstName = "Unknown";
	
		// check the names array for the claimed_by id
		for (const name of names) {
			if (String(name._id) === String(claimed_by)) {
				claimedByFirstName = name.first_name;
			}
		}
		// map the status to the corresponding string
		switch (status) {
			case "pending":
				return "Order Placed";
			case "declined":
				return "Declined";
			case "cancelled":
				return "Cancelled";
			case "completed":
				return "Completed By " + claimedByFirstName;
			case "claimed":
				return "Being Mixed By " + claimedByFirstName;
			default:
				return "Unknown Status";
		}
	}

	function mapDateISOString(dateISOString) {
		const date = new Date(dateISOString);
		const formattedDate = date.toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric',
		});
		const formattedTime = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		});
		const result = `${formattedDate} ${formattedTime}`;
		return result;
	}
		
	function getQuantity(drinkId, drinkOrderList) {
		let quantity = 0;
		for (const drinkOrderId of drinkOrderList) {
			if (drinkOrderId === drinkId) {
				quantity ++;
			}
		}
		return quantity;
	}

	function getTotalPrice(drinkOrderList) {

		let totalPrice = 0;
		for (const drinkId of drinkOrderList) {
			totalPrice += drinks[drinkId].price;
		}
		return totalPrice.toFixed(2);
	}

	function statusColor(status) {
		switch (status) {
			case "pending":
				return "#2881B4";
			case "declined":
				return "#E90000";
			case "cancelled":
				return "#E90000";
			case "completed":
				return "#008C40";
			case "claimed":
				return "#D19600";
			default:
				return "#FFFFFF";
		}
	}

    const endsWithS = customer.last_name[customer.last_name.length - 1] === 's';

	function renderHistoryContainer() {
		return (
			<div className="history-container">
				{history.map((order, index) => (
					<div className="history-item" key={index}>
						<div className="history-header">
							<div className="status-row">
								<h1 style={{color: statusColor(order.status)}}>
									{statusString(order.status, order.claimed_by)}
								</h1>
							</div>
							<div className="date-price-row">
								<h2>{mapDateISOString(order.date)}</h2>
								<h2>${getTotalPrice(order.drinks)}</h2> {/*TODO: FINISH THIS*/}
							</div>
						</div>
						{renderOrderContainer(order)}
					</div>
				))}
			</div>
		)
	}

	function renderOrderContainer(order) {
		const uniqueDrinkIds = new Set();
		return (
			<div className="history-drinks">
				{order.drinks.map((drinkId, index) => {
					if (!uniqueDrinkIds.has(drinkId)) {
						// If the drink ID is not in the set, add it and render the drink
						uniqueDrinkIds.add(drinkId);
						return (
							<div className="history-drink" key={index}>
								<img src={drinks[drinkId].image} alt={drinks[drinkId].name} />
								<h2>{getQuantity(drinkId, order.drinks)}</h2>
								<h3>{drinks[drinkId].name}</h3>
								<h3 className="gray">${(getQuantity(drinkId, order.drinks) * drinks[drinkId].price).toFixed(2)}</h3>
							</div>
						);
					} else {
						return null; // If the drink ID is already in the set, don't render the drink
					}
				})}
			</div>
		)
	}
	return (
		<div className="overlay" onClick={() => showPopUp(null)}>
			<div className="historyPopupFrame">
				<div
					className="popupContainer"
					onClick={(event) => event.stopPropagation()} // Prevents clicks within the popup from closing the popup
				>
					<h1>
						{customer._id !== user.customData._id ? (
							// only show name if the bartender is looking at someone else's history
							<>
								{customer.first_name} {customer.last_name}
								{endsWithS ? "'" : "'s"}
							</>
						) : (
							<>Your</>
						)}
						<br />History
					</h1>
					{loading ? (
						// Display a loading message or spinner while data is being fetched
						<h1>Loading...</h1>
					) : (
						history.length === 0 ? (
							<h1>No History</h1>
						) : (
							renderHistoryContainer()
						)
					)}
					<div className="popupButtonsContainer rightOnly">
						<h3 className="AcceptButton" onClick={() => showPopUp(null)}>Return</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HistoryPopUp;
