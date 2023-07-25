import CustomerHeader from './CustomerHeader';
import './CustomerCart.css';

function CustomerCart () {
	return (
		<div className='cart-container'>
			<CustomerHeader activeTab={'shoppingCart'}></CustomerHeader>
		</div>
	)
};

export default CustomerCart;