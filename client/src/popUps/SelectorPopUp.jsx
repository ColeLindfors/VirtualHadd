import React, { useEffect } from 'react';
import './SelectorPopUp.css';
import './PopUp.css';
import { Link } from 'react-router-dom';
import { useAppState } from '../contexts/StateContext';


/**
 * The SelectorPopUp component is a modal that allows a bartender to pick what to do for a customer
 */
function SelectorPopUp({ showPopUp, customer}) {
    const {setState} = useAppState();
    useEffect(() => {
        setState(prevState => ({ ...prevState, customer: customer }));
    }, [customer, setState]);

    const venmoURL = "https://venmo.com/u/" + customer.venmo;

    function handleNotImplemented() {
        alert('Not implemented yet!');
    }

    return (
        <div className="overlay" onClick={() => showPopUp(null)} >
            <div className="selectorPopupFrame">
                <div 
                    className="popupContainer"
                    onClick={(event) => event.stopPropagation()} // Prevents clicks within the popup from closing the popup
                >
                    <h1>{customer.first_name} {customer.last_name}</h1>
                    <h3 className="venmoLink" onClick={() => window.open(venmoURL, "_blank")}>{customer.venmo?"@":""}{customer.venmo}</h3>
                    <div className="purpleButton" onClick={() => showPopUp(customer, 'add')}>
                        <h3>Add to Tab</h3>
                        <span className='material-symbols-outlined'>
                            add
                        </span>
                    </div>
                    <div className="purpleButton" onClick={() => showPopUp(customer, 'remove')}>
                        <h3>Remove from Tab</h3>
                        <span className='material-symbols-outlined'>
                            remove
                        </span>
                    </div>
                    <Link
                        to={{
                            pathname: `/ordering/${customer.first_name}${customer.last_name}`,
                            state: customer,
                        }}
                    >
                        <div className="purpleButton">
                            <h3>Place Order</h3>
                            <span className='material-symbols-outlined'>
                                shopping_cart
                            </span>
                        </div>
                    </Link>
                    
                    <div className="purpleButton" onClick={() => handleNotImplemented()}>
                        <h3>Order History</h3>
                        <span className='material-symbols-outlined'>
                            book_2
                        </span>
                    </div>
                    <div className="purpleButton" onClick={() => handleNotImplemented()}>
                        <h3>Cut Off</h3>
                        <span className='material-symbols-outlined'>
                            accessible
                        </span>
                    </div>
                    <div className="popupButtonsContainer rightOnly">
                        <h3 className="AcceptButton" onClick={() => showPopUp(null)}>Return</h3>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default SelectorPopUp;