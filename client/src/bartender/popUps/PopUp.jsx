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

  //   <div className="overlay" onClick={() => showPopUp(null)} >
  //     <div 
  //       className="popupContainer"
  //       onClick={(event) => event.stopPropagation()} // Prevents clicks within the popup from closing the popup
  //     >
  //       <div className="popupUpperContainer">
  //         <h1>{popUpType === "remove" ? "Remove" : "Add"}</h1>
  //         <input 
  //           className="largePopupInput"
  //           inputMode="decimal" 
  //           placeholder="$0.00"
  //           value={inputValue}
  //           type="text"
  //           onChange={handleInputChange}
  //           onBlur={handleBlur}
  //         />
  //         <h1> {popUpType === "remove" ? "From" : "To"} {customer.firstName}{endsWithS ? "'" : "'s"}</h1>
  //         {(popUpType === "remove" ? <div className="currentBalanceDiv">${customer.tab.toFixed(2)}</div> : null)}
  //         <h1>Tab</h1>
  //       </div>
  //       <div className="popupButtonsContainer">
  //         <h3 className="cancelButton" onClick={() => showPopUp(null)}>Cancel</h3>
  //         <h3 className="AcceptButton" onClick={() => handleOKClick()}>OK</h3>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default PopUp;
