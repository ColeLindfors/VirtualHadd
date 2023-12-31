import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import './BartenderHeader.css';

function BartenderHeader ({activeTab}) {

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
        <div className='headers'>
            <div className='text-headers'>
                <Link to="/menu">
                    <h1 className={activeTab === 'menu' ? 'active' : ''}>
                        Menu
                    </h1>
                </Link>
                {/* <Link to="/orders"> */}
                    <h1 
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={handleNotImplementedRedirect} // ! Remove this line when orders are implemented
                    >
                        Orders
                    </h1>
                {/* </Link> */}
                <Link to="/">
                    <h1 className={activeTab === 'tabs' ? 'active' : ''}>
                        Tabs
                    </h1>
                </Link>
                <span 
                    id='logout' 
                    onClick={handleLogout}
                    className={`material-symbols-outlined logout`}
                >
                    logout
                </span>     
            </div>
            {/* <div className='header-buttons'> */}
                           
            {/* </div> */}
        </div>
    )
}

export default BartenderHeader;
