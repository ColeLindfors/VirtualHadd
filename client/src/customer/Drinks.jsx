import Drink from './Drink';
import './Drinks.css';

function Drinks ({ drinks, searchTerm, variety, liquor, setCart, cart }) {

	function filterDrinks () {
		if (!drinks) {
			return [];
		}
		return drinks.filter((drink) => {
			return (
				drink.name.toLowerCase().includes(searchTerm.toLowerCase())
				&& (variety === 'all_varieties' || drink.variety === variety)
				&& (liquor === 'all_liquors' || drink.liquors.includes(liquor))
			);
		});
	}

	const filteredDrinks = filterDrinks();

	return (
		<ul className='drinks-container'>
			{filteredDrinks.map((drink) => (
				<li key={drink.id}>
					<Drink drink={drink} setCart={setCart} cart={cart}/>
				</li>
			))}
		</ul>
	)
};

export default Drinks;