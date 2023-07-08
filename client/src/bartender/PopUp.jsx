import React, {useEffect, useState} from 'react';
import './PopUp.css';
import * as Realm from 'realm-web';

/**
  * The PopUp component is a modal that allows the bartender to add or remove money from a customer's tab.
  * The popUpType is either "add" or "remove", which determines the functionality of the pop-up.
 */
function PopUp({ showPopUp, customer, popUpType }) {

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    /**
     * Initializes the input value to the customer's tab depending on the popUpType
     * and whether the customer has a tab.
     */
    function initializeInputValue() {
      if (popUpType === "remove" && customer.tab > 0) {
        setInputValue("$" + customer.tab.toFixed(2));
      }
      else {
        setInputValue("");
      }
    }
    initializeInputValue();
  }, [popUpType, customer.tab]);

  /**
   * Handles changes to the input field value, ensuring that the input value is formatted correctly.
   * 
   * Specifically, this function does the following:
   * - Removes any dollar signs from the beginning of the input value
   * - Adds a dollar sign to the beginning of the input value if it does not already have one
   * - Adds a zero to the left of the decimal point if there isn't a number there already when the user presses the decimal point
   * - Removes all but the first decimal point if there are multiple decimal points in the input value
   * - Removes consecutive decimal points if there are any
   * - Limits the input to two decimal places
   * 
   * @param {Object} event - The input change event.
   */
  const handleInputChange = (event) => {
    let value = event.target.value.replace(/^\$/, "");
    if (value.indexOf(".") === -1) {
      event.target.value = "$" + value;
    } else {
      const parts = value.split(".");
      if (parts.length > 2 || parts[1].indexOf(".") !== -1) {
        // More than one dot or consecutive dots
        const newValue = parts[0] + "." + parts[1].replace(/\.{2,}/g, ".");
        event.target.value = "$" + newValue;
      } else {
        if (parts[0] === "") {
          parts[0] = "0";
        }
        const decimalPlaces = parts[1] ? parts[1].length : 0;
        if (decimalPlaces > 2) {
          parts[1] = parts[1].substring(0, 2);
        }
        event.target.value = "$" + parts[0] + "." + parts[1];
      }
    }
    setInputValue(event.target.value);
  };

  /**
   * Handles the click event for the OK button.
   * 
   * Triggers the incrementTabById or decrementTabById database function depending on the popUpType.
   */
  async function handleOKClick() {
    const REALM_APP_ID = "application-0-gydmq";
    const app = new Realm.App({ id: REALM_APP_ID });
    const updateTab = async () => {
      const amount = document.querySelector(".popupInput").value.substring(1);
      if (popUpType === "add") {
        app.currentUser.functions.incrementTabById({userId: customer.id, amount: parseFloat(amount)});
      } else if (popUpType === "remove") {
        app.currentUser.functions.decrementTabById({userId: customer.id, amount: parseFloat(amount)});
      }
      else {
        console.error("Invalid popUpType");
      }
    };
    try {
      updateTab();
    } catch (error) {
      console.error(error);
    }
    showPopUp(null);
  };

  /**
   * Removes the dollar sign from the input value:
   * - if input field loses focus
   * - and the user did not enter a number
   */
  function handleBlur(event) {
    if (event.target.value === "$") {
      event.target.value = "";
    }
    setInputValue(event.target.value);
  }


  const endsWithS = customer.firstName[customer.firstName.length - 1] === 's';


  return (
    <div className="overlay" onClick={() => showPopUp(null)}>
      <div 
        className="popupContainer"
        onClick={(event) => event.stopPropagation()} // Prevents clicks within the popup from closing the popup
      >
        <div className="popupUpperContainer">
          <h1>{popUpType === "remove" ? "Remove" : "Add"}</h1>
          {/* <h1>Add</h1> */}
          <input 
            className="popupInput"
            inputMode="decimal" 
            placeholder="$0.00"
            value={inputValue}
            type="text"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <h1> {popUpType === "remove" ? "From" : "To"} {customer.firstName}{endsWithS ? "'" : "'s"}</h1>
          {(popUpType === "remove" ? <div className="currentBalanceDiv">${customer.tab.toFixed(2)}</div> : null)}
          <h1>Tab</h1>
        </div>
        <div className="popupButtonsContainer">
          <h3 className="cancelButton" onClick={() => showPopUp(null)}>Cancel</h3>
          <h3 className="OKButton" onClick={() => handleOKClick()}>OK</h3>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
