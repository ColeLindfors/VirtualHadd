import React from 'react';
import AddRemovePopUp from './AddRemovePopUp';

/**
  * The PopUp component is a modal that allows the bartender to add or remove money from a customer's tab.
  * The popUpType is either "add" or "remove", which determines the functionality of the pop-up.
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
