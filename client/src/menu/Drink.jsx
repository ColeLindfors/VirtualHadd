import  React, { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import './Drink.css';
import { useAppState } from '../contexts/StateContext';
import * as Realm from 'realm-web';

function Drink ({ drink, setCart, cart, setDrinks}) {
    const { state } = useAppState();
    const { user } = useContext(UserContext);
    const inCartView = state?.inCartView;

    const handleAddDrink = () => {
        if (!cart[drink.id]) {
            setCart({...cart, [drink.id]: {quantity: 1, price: drink.price}});
            return;
        }
        else {
            setCart({...cart, [drink.id]: {...cart[drink.id], quantity: cart[drink.id].quantity + 1}});
        }
    }

    const handleRemoveDrink = () => {
        if (cart[drink.id].quantity === 1) { // remove drink from cart (quantity = 0)
            setCart(prevCart => {
                const newCart = { ...prevCart };
                delete newCart[drink.id];
                return newCart;
            });
        } else { // decrement quantity of drink in cart (quantity > 0)
            setCart({...cart, [drink.id]: {...cart[drink.id], quantity: cart[drink.id].quantity - 1}});
        }
    }

    // apply grayed out styling to drinks that are sold out
    function grayIfSoldOut() {
        if (drink.soldOut && ((user.customData.role === 'bartender' && state?.customer) || (user.customData.role === 'customer') || (user.customData.role === 'guest'))) {
            return 'grayed-out';
        }
        else {return ''}
    }
    
    // used for swapping the soldOut and isVisible fields
    function handleSwapField(fieldName, newFieldValue) {
        const REALM_APP_ID = "application-0-gydmq";
        const app = new Realm.App({ id: REALM_APP_ID });
        const swapDrinkVisibilityPromise = app.currentUser.functions.setDrinkField({drinkId: drink.id, fieldName: fieldName, fieldValue: newFieldValue});
        swapDrinkVisibilityPromise.then(result => {
            console.log('result:', result);
            setDrinks(prevDrinks => {
                const newDrinks = prevDrinks.map((oldDrink) => {
                    if (oldDrink.id === drink.id) {
                        oldDrink[fieldName] = newFieldValue;
                    }
                    return oldDrink;
                });
                return newDrinks;
            });
            
            // TODO: Add a success message, hopefully with a nice animation
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className={`drink-container ${grayIfSoldOut()}`}>
			<img src={`${drink.image}`} alt={drink.name} />
            <div className='drink-info'>
                <h2>{drink.name}</h2>
                <p>{drink.description}</p>
                <div className='drink-info-bottom'>
                    <h2>${drink.price.toFixed(2)}</h2>
                    { user.customData.role === 'customer' || state?.customer ? // customer case and bartender ordering case (cart functionality)
                        <div className='drink-info-bottom-right customer'>
                            {
                                drink.soldOut ? // sold out case
                                    <div className='sold-out'>SOLD OUT</div>
                                : <>
                                    {inCartView ? (
                                        <h3 className='drink-quantity'>x{cart[drink.id]?.quantity || 0}</h3>
                                    ) : (
                                        // editable quantity case
                                        cart[drink.id] ?
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
                                    )}
                                    {!inCartView && ( // add to cart button (not in cart view)
                                        <span
                                            className='material-symbols-outlined'
                                            onClick={handleAddDrink}
                                        >
                                            add
                                        </span>
                                    )}
                                </>
                            }
                        </div>
                    : user.customData.role === 'bartender' ? // bartender case (sold out and hide functionality)
                        <div className='drink-info-bottom-right bartender'>
                            <span // sold out button
                                onClick={() => handleSwapField('soldOut', !drink.soldOut)}
                                className='material-symbols-outlined'>
                                {drink.soldOut
                                    ? 'shopping_cart_off'
                                    : 'shopping_cart'
                                }
                            </span>
                            <span // isVisible button
                                onClick={() => handleSwapField('isVisible', !drink.isVisible)}
                                className='material-symbols-outlined'>
                                {drink.isVisible
                                    ? 'visibility'
                                    : 'visibility_off'
                                }
                            </span>
                        </div>
                    :  // guest case (can only show sold out)
                        drink.soldOut ? // sold out case
                            <div className='sold-out'>SOLD OUT</div>
                        : <></> // not sold out (no buttons for guest)
                    }
                </div>
            </div>
        </div>
    );
}

export default Drink;