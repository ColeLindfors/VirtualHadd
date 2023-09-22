import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import './CustomerHeader.css';

function CustomerHeader ({activeTab, isCartEmpty = true}) {

    const {logoutUser} = useContext(UserContext);

    const handleLogout = () => {
        if (window.confirm('Logout?')) {
            logoutUser();
        }
    }

    const handleNotImplementedRedirect = () => {
        alert('Not implemented yet!');
    }


    return (
        <div className='customer-headers'>
            <Link to="/">
                <h1 className={activeTab === 'menu' ? 'active-header' : ''}>
                    Menu
                </h1>
            </Link>
            <div className='customer-header-buttons'>
                {/* <Link to="/payments"> */}
                <span 
                    onClick={handleNotImplementedRedirect} // ! Remove this line when payments is implemented
                    className={`material-symbols-outlined ${activeTab === 'payments' ? 'active-header' : ''}`}
                >
                    payments
                </span>
                {/* </Link> */}
                {/* <Link to="/statistics"> */}
                <span 
                    onClick={handleNotImplementedRedirect} // ! Remove this line when statistics are implemented
                    className={`material-symbols-outlined ${activeTab === 'statistics' ? 'active-header' : ''}`}
                >
                    query_stats
                </span>
                {/* </Link> */}
                {/* <Link to="/cart"> */}
                    <span 
                        onClick={handleNotImplementedRedirect} // ! Remove this line when shopping cart is implemented
                        className={`material-symbols-outlined ${activeTab === 'shoppingCart' ? 'active-header' : ''}`}>
                        {!isCartEmpty && <div className="cartFilledIcon"></div>}
                        shopping_cart
                    </span>
                {/* </Link> */}
                <span 
                    id='logout' 
                    onClick={handleLogout}
                    className={`material-symbols-outlined logout`}
                >
                    logout
                </span>                
            </div>
        </div>
    )
}

export default CustomerHeader;