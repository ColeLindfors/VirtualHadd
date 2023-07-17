import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CustomerMenu () {
  return (
    <div>
      <Link to="/cart">Cart</Link>
      <h1>Customer Menu</h1>
    </div>
  )
}

export default CustomerMenu