import React, { useState, useContext, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import CustomerHeader from '../customer/CustomerHeader';
import BartenderHeader from '../bartender/BartenderHeader';
import BartenderShoppingHeader from '../menu/BartenderShoppingHeader';
import CartHeader from './CartHeader';
import Selectors from './Selectors';
import SearchBar from './SearchBar';
import Drinks from './Drinks';
import './Menu.css';
import { useAppState } from '../contexts/StateContext';
import { StateContext } from '../contexts/StateContext';
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
	const {state} = useAppState();
	const customer = state?.customer;
	const inCartView = state?.inCartView;
	const navigate = useNavigate();
	const location = useLocation();

	const { setDrinksDict } = useContext(StateContext);

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

				// hacky way to get the drinks into the state context, should use drinksDict ONLY instead
				setDrinksDict(newDrinks.reduce((acc, drink) => {
					acc[drink.id] = drink;
					return acc;
				}, {}));
			} catch (error) {
				console.error("Failed to fetch drinks: ", error);
			}
		}
		fetchDrinks();
	  }, [user, customer, navigate, location, setDrinksDict]);

	const handleVarietyChange = (event) => {
		setVariety(event.target.value);
	}

	const handleLiquorChange = (event) => {
		setLiquor(event.target.value);
	}

	function isEmpty(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	function getCartQuantity() {
		let quantity = 0;
		for (const drinkId in cart) {
			quantity += cart[drinkId].quantity;
		}
		return quantity;
	}

	function drinksInCart() {
		const drinksInCart = [];
		const drinksIdsInCart = new Set();
		for (const drinkId in cart) {
			drinksIdsInCart.add(drinkId);
		}
		for (const drink of drinks) {
			if (drinksIdsInCart.has(drink.id)) {
				drinksInCart.push(drink);
			}
		}
		return drinksInCart;
	}

	function clearSearchAndFilters() {
		setSearchTerm('');
		setVariety('all_varieties');
		setLiquor('all_liquors');
	}

	// make sure URL is correct when leaving the cart view
	useEffect(() => {
		if (user.customData.role === 'customer' && !inCartView) {
			navigate('/');
		}
	}, [user, inCartView, navigate]);

	return (
		<div className='menu-container'>
			<div className="gray-header-background">
				{user.customData.role === 'bartender'
					? inCartView ? // Bartender reviewing cart
						<CartHeader
							getCartQuantity={getCartQuantity}
							cart={cart}
							setCart={setCart}
						/>
					: customer ? // Bartender picking out drinks for a customers order
						<BartenderShoppingHeader
							clearSearchAndFilters={clearSearchAndFilters}
							isCartEmpty={isEmpty(cart)} 
							getCartQuantity={getCartQuantity}
						/>
					: <BartenderHeader activeTab='menu'/> // Bartender menu (for setting drink availability)
				: inCartView ? // Customer reviewing cart
					<CartHeader
						getCartQuantity={getCartQuantity}
						cart={cart}
						setCart={setCart}
					/>
				: <CustomerHeader // Customer or guest viewing menu
					isCartEmpty={isEmpty(cart)} 
					activeTab='menu'
					clearSearchAndFilters={clearSearchAndFilters}
				/> // Customer and Guest case
				}
				{!inCartView ? // Selector and Search Bar only show up when not in cart view
					<>
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
					</>
				: <></>
				}
			</div>
			<div className='drink-wrapper'>
				<Drinks
					drinks={inCartView ? drinksInCart() : drinks}
					setDrinks={setDrinks}
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