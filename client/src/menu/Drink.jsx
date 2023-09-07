import React from 'react';
import './Drink.css';

function Drink ({ drink, setCart, cart }) {
    return (
        <div className='drink-container'>
			<img src={`${drink.image}`} alt={drink.name} />
            <div className='drink-info'>
                <h2>{drink.name}</h2>
                <p>{drink.description}</p>
                <div className='drink-info-bottom'>
                    <h2>${drink.price.toFixed(2)}</h2>
                    {/* Plus button commented out until shopping cart added! */}
                    {/* <div className='drink-info-bottom-right'>
                        {
                            cart[drink.id] 
                            ?
								<>
									<span className='material-symbols-outlined remove-from-cart-icon'>remove</span>
									<h3 className='drink-quantity'>{cart[drink.id]?.quantity}</h3>
								</>
                            : <></>
                        }
                        <span className='material-symbols-outlined add-to-cart-icon'>add</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Drink;