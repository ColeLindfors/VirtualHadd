import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/user.context';
import CustomerHeader from './CustomerHeader';
import SearchBar from './SearchBar';
import Drinks from './Drinks';
import './CustomerMenu.css';


function CustomerMenu () {
	const [variety, setVariety] = useState('all_varieties');
	const [liquor, setLiquor] = useState('all_liquors');
	const [searchTerm, setSearchTerm] = useState('');
	const [cart, setCart] = useState({});
	const [drinks, setDrinks] = useState([]);
	const [liquorOptions, setLiquorOptions] = useState([]);
	const [varietyOptions, setVarietyOptions] = useState([]);
	const { user } = useContext(UserContext);

	useEffect( () => {
		async function fetchDrinks() {
			try {
				const fetchedDrinks = await user.functions.getAllDrinks();
				// map the database results to a more friendly format
				var newDrinks = [];
				var newLiquorOptions = [];
				var newVarietyOptions = [];
				for (const drink of fetchedDrinks) {
					if (!drink.isVisible) { // skip drinks that are not visible
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
	  }, [user, drinks]);

	const handleVarietyChange = (event) => {
		setVariety(event.target.value);
	}

	const handleLiquorChange = (event) => {
		setLiquor(event.target.value);
	}

	function isEmpty(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	return (
		<div className='menu-container'>
			<CustomerHeader isCartEmpty={isEmpty(cart)} activeTab='menu'/>
			<div className='menu-selectors'>
				<div className={`selector-wrapper ${variety !== 'all_varieties' ? 'selected' : ''}`} >
					<select 
						className='dynamic-selector'
						onChange={handleVarietyChange}
					>
						<option key="all_varieties" value="all_varieties" >All Varieties</option>
						{varietyOptions.map((varietyOption) => 
							<option key={varietyOption} value={varietyOption}>
								{varietyOption.charAt(0).toUpperCase() + varietyOption.slice(1)}
							</option>
						)}
					</select>
				</div>
				<div className={`selector-wrapper ${liquor !== 'all_liquors' ? 'selected' : ''}`}>
					<select 
						className='dynamic-selector'
						onChange={handleLiquorChange}
					>
						<option key="all_liquors" value="all_liquors">All Liquors</option>
						{liquorOptions.map((liquorOption) => 
							<option key={liquorOption} value={liquorOption}>
								{liquorOption.charAt(0).toUpperCase() + liquorOption.slice(1)}
							</option>
						)}
					</select>
				</div>
			</div>
			<SearchBar 
				setSearchTerm={setSearchTerm} 
				searchTerm={searchTerm} 
				placeholder="Search for a drink..."
			/>
			<Drinks
			drinks={drinks}
			searchTerm={searchTerm} 
			variety={variety} 
			liquor={liquor}
			cart={cart}
			setCart={setCart}
			/>
		</div>
	)
}

export default CustomerMenu;