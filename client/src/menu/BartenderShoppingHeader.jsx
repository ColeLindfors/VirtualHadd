import './Menu.css';
import { useAppState } from '../contexts/StateContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BartenderShoppingHeader({ isCartEmpty, getCartQuantity, clearSearchAndFilters }) {
    const { state, setState } = useAppState();
    const customer = state?.customer;
    const navigate = useNavigate();


    function handleCartClick() {
        if (!isCartEmpty) {
            clearSearchAndFilters();
            setState(prevState => ({ ...prevState, inCartView: true }));
        }
        else { // animate the name shaking if the cart is empty

            const nameHeader = document.querySelector('.back-name-shopping-header h1');
            nameHeader.classList.add('shake');
            setTimeout(() => {
                nameHeader.classList.remove('shake');
            }, 1000);
        }
    }

	function handleBackClick() {
		setState(prevState => ({...prevState, customer: null}));
		navigate('/');
	}
    return (
        <div className="back-name-shopping-header">
            <span className="material-symbols-outlined back-arrow" onClick={() => handleBackClick()}>
                chevron_left
            </span>
            <h1>{customer.first_name} {customer.last_name}</h1>
            <span className="material-symbols-outlined cart" onClick={() => handleCartClick()}>
            {!isCartEmpty && 
                <div className="cartFilledIcon">
                    <div className="cartQuantity">{getCartQuantity()}</div>
                </div>}
                shopping_cart
            </span>
        </div>
    );
}

export default BartenderShoppingHeader;