import React, { useState, useContext, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import CustomerHeader from '../customer/CustomerHeader';
import BartenderHeader from '../bartender/BartenderHeader';
import Selectors from './Selectors';
import SearchBar from './SearchBar';
import Drinks from './Drinks';
import './Menu.css';
import PopUp from '../popUps/PopUp';
import { useAppState } from '../contexts/StateContext';

import { useNavigate } from 'react-router-dom';



function Menu () {
	const [variety, setVariety] = useState('all_varieties');
	const [liquor, setLiquor] = useState('all_liquors');
	const [searchTerm, setSearchTerm] = useState('');
	const [cart, setCart] = useState({});
	const [drinks, setDrinks] = useState([]);
	const [liquorOptions, setLiquorOptions] = useState([]);
	const [varietyOptions, setVarietyOptions] = useState([]);
	const { user } = useContext(UserContext);
	const {state, setState} = useAppState();
	const customer = state?.customer;
	const navigate = useNavigate();
	const location = useLocation();

	useEffect( () => {
		if (!customer && location.pathname.includes('/ordering')) {
			// navigate to the tabs page if the bartender is not ordering for a customer
			navigate('/');
		}
		async function fetchDrinks() {
			try {
				const fetchedDrinks = await user.functions.getAllDrinks();
				// map the database results to a more friendly format
				var newDrinks = [];
				var newLiquorOptions = [];
				var newVarietyOptions = [];
				for (const drink of fetchedDrinks) {
					if (!drink.isVisible && user.customData.role !== 'bartender') { // skip drinks that are not visible for customers and guests
						continue;
					}
					newDrinks.push({
						id: drink._id.toString(),
						name: drink.name,
						description: drink.description,
						price: parseFloat(drink.price),
						image: drink.image,
						liquors: drink.liquors,
						variety: drink.variety,
						soldOut: drink.soldOut,
						isVisible: drink.isVisible,
					});
					for (const liquor of drink.liquors) {
						if (!newLiquorOptions.includes(liquor)) {
							newLiquorOptions.push(liquor);
						}
					}
					if (!newVarietyOptions.includes(drink.variety)) {
						newVarietyOptions.push(drink.variety);
					}
				}
				setDrinks(newDrinks);
				setLiquorOptions(newLiquorOptions);
				setVarietyOptions(newVarietyOptions);
			} catch (error) {
				console.error("Failed to fetch drinks: ", error);
			}
		}
		fetchDrinks();
	  }, [user, customer, navigate, location]);

	const handleVarietyChange = (event) => {
		setVariety(event.target.value);
	}

	const handleLiquorChange = (event) => {
		setLiquor(event.target.value);
	}

	function isEmpty(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}


	function handleCartClick() {
		alert('Not implemented yet!');
	}

	function handleBackClick() {
		setState(prevState => ({...prevState, customer: null}));
		navigate('/');
	}

	function getCartQuantity() {
		let quantity = 0;
		for (const drinkId in cart) {
			quantity += cart[drinkId].quantity;
		}
		return quantity;
	
	}

	return (
		<div className='menu-container'>
			<div className="gray-header-background">
				{user.customData.role === 'bartender'
					? customer ? // Bartender ordering drinks for a customer
						<div className="back-name-cart-header">
							<span className="material-symbols-outlined back-arrow" onClick={() => handleBackClick()}>
								chevron_left
							</span>
							<h1>{customer.first_name} {customer.last_name}</h1>
							<span className="material-symbols-outlined cart" onClick={() => handleCartClick()}>
							{!isEmpty(cart) && 
								<div className="cartFilledIcon">
									<div className="cartQuantity">{getCartQuantity()}</div>
								</div>}
								shopping_cart
							</span>
						</div>
						: <BartenderHeader activeTab='menu'/> // Bartender menu (for setting drink availability)
					: <CustomerHeader isCartEmpty={isEmpty(cart)} activeTab='menu'/> // Customer and Guest case
				}
				<Selectors
					variety={variety}
					liquor={liquor}
					handleVarietyChange={handleVarietyChange}
					handleLiquorChange={handleLiquorChange}
					liquorOptions={liquorOptions}
					varietyOptions={varietyOptions}
				/>
				<SearchBar 
					setSearchTerm={setSearchTerm} 
					searchTerm={searchTerm} 
					placeholder="Search for a drink..."
				/>
			</div>
			<div className='drink-wrapper'>
				<Drinks
					drinks={drinks}
					searchTerm={searchTerm} 
					variety={variety} 
					liquor={liquor}
					cart={cart}
					setCart={setCart}
					userRole={user.customData.role}
				/>
			</div>
		</div>
	)
}

export default Menu;