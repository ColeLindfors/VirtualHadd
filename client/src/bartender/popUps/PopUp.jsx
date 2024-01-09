import React from 'react';
import AddRemovePopUp from './AddRemovePopUp';

/**
  * PopUp is a wrapper component that determines which pop-up to show.
 */
function PopUp({ showPopUp, customer, popUpType }) {

  return (
    <>{popUpType === "add" || popUpType === "remove" ? (
        <AddRemovePopUp
          showPopUp={showPopUp}
          customer={customer}
          popUpType = {popUpType}
        />)
        :
        <></>}
    </>
  )
}

export default PopUp;
