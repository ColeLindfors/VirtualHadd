import { Link } from 'react-router-dom';
import './CustomerHeader.css';

function CustomerHeader ({activeTab, isCartEmpty = true}) {
    return (
        <div className='menu-headers'>
            <Link to="/">
                <h1 id="menu" className={activeTab === 'menu' ? 'active-header' : ''}>
                    Menu
                </h1>
            </Link>
            <div className='menu-header-buttons'>
                <Link to="/payments">
                <span 
                    id='payments' 
                    className={`material-symbols-outlined ${activeTab === 'payments' ? 'active-header' : ''}`}
                >
                    payments
                </span>
                </Link>
                <Link to="/statistics">
                <span 
                    id='statistics' 
                    className={`material-symbols-outlined ${activeTab === 'statistics' ? 'active-header' : ''}`}
                >
                    query_stats
                </span>
                </Link>
                <Link to="/settings">
                <span 
                    id='settings' 
                    className={`material-symbols-outlined ${activeTab === 'settings' ? 'active-header' : ''}`}
                >
                    settings
                </span>
                </Link>
                <Link to="/cart">
                    <span id="shoppingCart" className={`material-symbols-outlined ${activeTab === 'shoppingCart' ? 'active-header' : ''}`}>
                        {!isCartEmpty && <div className="cartFilledIcon"></div>}
                        shopping_cart
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default CustomerHeader;