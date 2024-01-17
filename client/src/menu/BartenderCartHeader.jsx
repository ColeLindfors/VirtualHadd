import './Menu.css';
import { useAppState } from '../contexts/StateContext';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import * as Realm from 'realm-web';

function BartenderCartHeader({getCartQuantity, cart}) {
    const { state, setState } = useAppState();
    const customer = state?.customer;
	const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (Object.keys(cart).length === 0) {
            setState(prevState => ({...prevState, inCartView: false}));
        }
    }, [cart, setState]);


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

    async function handleAddToTab() {
        const REALM_APP_ID = "application-0-gydmq";
        const app = new Realm.App({ id: REALM_APP_ID });
        // increment the customer's tab balance
        const incrementTabPromise = app.currentUser.functions.incrementTabById({userId: customer._id, amount: parseFloat(getCartTotal())});
        incrementTabPromise.then(result => {
            const updatedTabBalance = result;
            if (updatedTabBalance !== null) {
                customer.tab_balance = parseFloat(updatedTabBalance);
                // TODO: Add a success message, hopefully with a nice animation
            }
        }).catch((error) => {
            console.error(error);
        });
        // send the order to the database
        const date = new Date();
        const dateISO = date.toISOString();
        const submitOrderPromise = user.functions.createOrder({cart: cart, customerId: customer._id, bartenderId: user.customData._id, dateISO: dateISO, status: 'completed'});
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
                <h1>{customer.first_name} {customer.last_name}</h1>
                <div style={{width:'45px'}}/>
            </div>
            <div className='purple-button' onClick={() => handleAddToTab()}>
                <div style={{width:'18px'}}/>
                <h3>Add to Tab</h3>
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

export default BartenderCartHeader;