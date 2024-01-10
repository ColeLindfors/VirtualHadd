import React from 'react';
import AddRemovePopUp from './AddRemovePopUp';
import VenmoPopUp from './VenmoPopUp';

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
        : popUpType === "venmo" ? (
        <VenmoPopUp
          showPopUp={showPopUp}
          customer={customer}
        />)
        :
        <></>}
    </>
  )
}

export default PopUp;
