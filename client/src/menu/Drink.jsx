import  React, { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import './Drink.css';
import { useAppState } from '../contexts/StateContext';

function Drink ({ drink, setCart, cart }) {
    const { state } = useAppState();
    const { user } = useContext(UserContext);

    const handleAddDrink = () => {
        if (!cart[drink.id]) {
            setCart({...cart, [drink.id]: {quantity: 1}});
            return;
        }
        else {
            setCart({...cart, [drink.id]: {quantity: cart[drink.id].quantity + 1}});
        }
    }

    const handleRemoveDrink = () => {
        if (cart[drink.id].quantity === 1) {
            const newCart = {...cart};
            delete newCart[drink.id];
            setCart(newCart);
        } else {
            setCart({...cart, [drink.id]: {quantity: cart[drink.id].quantity - 1}});
        }
    }

    // const handleSoldOut = () => {
    //     drink.soldOut = !drink.soldOut;
    //     user.functions.updateDrink(drink);
    // }


    const handleNotImplemented = () => {
        alert('Not implemented yet!');
    }

    return (
        <div className='drink-container'>
			<img src={`${drink.image}`} alt={drink.name} />
            <div className='drink-info'>
                <h2>{drink.name}</h2>
                <p>{drink.description}</p>
                <div className='drink-info-bottom'>
                    <h2>${drink.price.toFixed(2)}</h2>
                    { user.customData.role === 'customer' || state?.customer ? // customer case and bartender ordering case (cart functionality)
                        <div className='drink-info-bottom-right customer'>
                            {
                                cart[drink.id]
                                ?
                                    <>
                                        <span // remove one drink from cart button
                                            className='material-symbols-outlined'
                                            onClick={handleRemoveDrink}
                                        >
                                            remove
                                        </span>
                                        <h3 className='drink-quantity'>{cart[drink.id].quantity}</h3>
                                    </>
                                : <></>
                            }
                            <span // add to cart button
                                className='material-symbols-outlined'
                                onClick={handleAddDrink}
                            >
                                add
                            </span>
                        </div>
                    : user.customData.role === 'bartender' ? // bartender case (sold out and hide functionality)
                        <div className='drink-info-bottom-right bartender'>
                            <span // sold out button
                                // onClick={handleSoldOut} // ! Not implemented yet
                                onClick={handleNotImplemented}
                                className='material-symbols-outlined'>
                                {drink.soldOut
                                    ? 'remove_shopping_cart'
                                    : 'shopping_cart'
                                }
                            </span>
                            <span // isVisible button
                                // onClick={handleIsVisible} // ! Not implemented yet
                                onClick={handleNotImplemented}
                                className='material-symbols-outlined'>
                                {drink.isVisible
                                    ? 'visibility'
                                    : 'visibility_off'
                                }
                            </span>
                        </div>
                    : <></> // guest case (no functionality)
                    }
                </div>
            </div>
        </div>
    )
}

export default Drink;