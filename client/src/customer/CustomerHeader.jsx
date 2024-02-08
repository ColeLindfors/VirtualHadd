import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/user.context';
import { StateContext } from '../contexts/StateContext';
import './CustomerHeader.css';
import PopUp from '../popUps/PopUp';

function CustomerHeader ({activeTab, clearSearchAndFilters, isCartEmpty = true}) {

    const { setState } = useContext(StateContext);
    const { isBarOpen } = useContext(StateContext);
    const [popUpType, setPopUpType] = useState(null);
    const {logoutUser, user} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Logout?')) {
            logoutUser();
        }
    }

    function handleCartClick() {
        if (isBarOpen && !isCartEmpty) {
            clearSearchAndFilters();
            setState(prevState => ({ ...prevState, inCartView: true }));
            navigate('/cart');
        } else if (!isBarOpen){
            alert('Hadd Bar is not accepting orders at this moment');
        } else {
            alert('Your cart is empty');
        }
        
    }

      /**
     * @param {Object} customer - The customer object (including their tab) to show in the popup
     * @param {String} popUpType - The type of popup to show, (default is null for no popup)
     */
    function showPopUp(customer, popUpType = null) {
        setPopUpType(popUpType);
    }

    const isGuest = user?.customData?.role === 'guest';

    return (
        <div className='customer-headers'>
            <Link to="/">
                <h1 className={activeTab === 'menu' ? 'active-header' : ''}>
                    Menu
                </h1>
            </Link>
            <div className='customer-header-buttons'>
                {!isGuest &&
                    <span
                        onClick={() => showPopUp(user.customData, 'venmo')}
                        className={`material-symbols-outlined ${activeTab === 'payments' ? 'active-header' : ''}`}
                    >
                        payments
                    </span>
                }
                {!isGuest &&
                    <span 
                        onClick={() => showPopUp(user.customData, 'history')}
                        className={`material-symbols-outlined ${activeTab === 'statistics' ? 'active-header' : ''}`}
                    >
                        book_2
                    </span>
                }
                {!isGuest &&
                    <Link to="/orders">
                        <span 
                            className={`material-symbols-outlined ${activeTab === 'orders' ? 'active-header' : ''}`}>
                            pending
                        </span>
                    </Link>
                }
                {!isGuest &&
                    <span 
                        onClick={handleCartClick}
                        className={`material-symbols-outlined ${activeTab === 'shoppingCart' ? 'active-header' : ''}`}>
                        {!isCartEmpty && <div className="cartFilledIcon"></div>}
                        {isBarOpen ? 'shopping_cart' : 'shopping_cart_off'}
                    </span>
                }
                <span 
                    id='logout' 
                    onClick={handleLogout}
                    className={`material-symbols-outlined logout`}
                >
                    logout
                </span>       
            </div>
            {popUpType &&
                <PopUp
                    showPopUp={showPopUp}
                    customer={user.customData}
                    popUpType = {popUpType}
                />
            }
        </div>
    )
}

export default CustomerHeader;