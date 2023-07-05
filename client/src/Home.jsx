import React, { useContext, useEffect } from 'react';
import BartenderView from './bartender/BartenderView'
import { UserContext } from './contexts/user.context'

function Home() {

  // const {user, login} = useContext(UserContext);

  return (
    <div>
      <BartenderView />
    </div>
  );
}

export default Home;