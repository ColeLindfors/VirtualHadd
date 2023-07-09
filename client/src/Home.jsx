import React, { useContext, useEffect } from 'react';
import BartenderView from './bartender/BartenderView'
import { UserContext } from './contexts/user.context'
import './Home.css';

function Home() {

  // const {user, login} = useContext(UserContext);

  return (
    <div className='body'>
      <BartenderView />
    </div>
  );
}

export default Home;