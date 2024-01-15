import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import './CustomerHeader.css';
import PopUp from '../popUps/PopUp';

function CustomerHeader ({activeTab, isCartEmpty = true}) {


    const [popUpType, setPopUpType] = useState(null);
    const {logoutUser, user} = useContext(UserContext);

    const handleLogout = () => {
        if (window.confirm('Logout?')) {
            logoutUser();
        }
    }

    const handleNotImplementedRedirect = () => {
        alert('Not implemented yet!');
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
                        onClick={handleNotImplementedRedirect} // ! Remove this line when statistics are implemented
                        className={`material-symbols-outlined ${activeTab === 'statistics' ? 'active-header' : ''}`}
                    >
                        book_2
                    </span>
                }
                {!isGuest &&
                    <span 
                        onClick={handleNotImplementedRedirect} // ! Remove this line when shopping cart is implemented
                        className={`material-symbols-outlined ${activeTab === 'shoppingCart' ? 'active-header' : ''}`}>
                        {!isCartEmpty && <div className="cartFilledIcon"></div>}
                        shopping_cart
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