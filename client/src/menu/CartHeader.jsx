import './Menu.css';
import { useAppState } from '../contexts/StateContext';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

function CartHeader({getCartQuantity, cart, setCart}) {
    const { state, setState } = useAppState();
    const customer = state?.customer;
	const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (Object.keys(cart).length === 0) {
            setState(prevState => ({...prevState, inCartView: false}));
        }
    }, [cart, navigate, setState, user]);


	function handleBackClick() {
		setState(prevState => ({...prevState, inCartView: false}));
	}

    function getCartTotal() {
        var total = 0;
        for (const drinkId in cart) {
            total += cart[drinkId].quantity * cart[drinkId].price;
        }
        return total.toFixed(2);
    }

    async function handlePlaceOrder() {
        if (user.customData.role === 'bartender') {
            // increment the customer's tab balance
            const incrementTabPromise = user.functions.incrementTabById({userId: customer._id, amount: parseFloat(getCartTotal())});
            incrementTabPromise.then(result => {
                const updatedTabBalance = result;
                if (updatedTabBalance !== null) {
                    customer.tab_balance = parseFloat(updatedTabBalance);
                    // TODO: Add a success message, hopefully with a nice animation
                }
            }).catch((error) => {
                console.error(error);
            });
        }
        // send the order to the database
        const date = new Date();
        const dateISO = date.toISOString();
        let submitOrderPromise;
        if (user.customData.role === 'bartender') { // if bartender, submit completed order
            submitOrderPromise = user.functions.createOrder({cart: cart, customerId: customer._id, bartenderId: user.customData._id, dateISO: dateISO, status: 'completed'});
        } else { // if customer, submit pending order
            submitOrderPromise = user.functions.createOrder({cart: cart, customerId: user.customData._id, bartenderId: "", dateISO: dateISO, status: 'pending'});
            // clear the cart
            setCart({});
        }
        submitOrderPromise.then(result => {
            // TODO: Add a success message, hopefully with a nice animation
        }).catch((error) => {
            console.error(error);
        });
        // then navigate back to the tabs page
        setState(prevState => ({...prevState, inCartView: false, customer: null}));
        navigate('/');
      };

    return (
        <div className='column-flex'>
            <div className="back-name-shopping-header">
                <span className="material-symbols-outlined back-arrow" onClick={() => handleBackClick()}>
                    chevron_left
                </span>
                {user.customData.role === 'bartender'
                ? <h1>{customer?.first_name} {customer?.last_name}</h1> // show customer name if bartender
                : <h1>My Cart</h1> // show "My Cart" if customer
                }
                <div style={{width:'45px'}}/>
            </div>
            <div className='purple-button' onClick={() => handlePlaceOrder()}>
                <div style={{width:'18px'}}/>
                {user.customData.role === 'bartender'
                ? <h3>Charge to Tab</h3> // show "Charge to Tab" if bartender
                : <h3>Place Order</h3> // show "Place Order" if customer
                }
                <div style={{width:'18px', height: '18px'}}>
                    <div className="cartFilledIcon">
                        <div className="cartQuantity">{getCartQuantity()}</div>
                    </div>
                </div>
            </div>
            <div className="total-row">
                <h4 className="gray">Total</h4>
                <h4 className="purple">${getCartTotal()}</h4>
            </div>
        </div>
        
    );
}

export default CartHeader;