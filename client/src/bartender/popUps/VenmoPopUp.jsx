import React, {useEffect, useState} from 'react';
import './VenmoPopUp.css';
import './PopUp.css';
import * as Realm from 'realm-web';

/**
 * The PopUp component is a modal that allows a customer to enter their venmo username under their profil
 */
function VenmoPopUp({ showPopUp, customer}) {

  const [inputValue, setInputValue] = useState("@");

  useEffect(() => {
    /**
     * Initializes the input value to the input value to the customer's venmo username.
     */
    function initializeInputValue() {
      if (customer.venmo !== "") {
        setInputValue("@" + customer.venmo);
      }
    }
    initializeInputValue();

    // Automatically focus on the input field if there is no venmo username
    if (customer.venmo === "") {
       document.querySelector(".venmoPopupInput").focus();
    }
    
  }, [customer]);

  /**
   * Handles changes to the input field value, ensuring that the input value is formatted correctly.
   * 
   * 
   * @param {Object} event - The input change event.
   */
  const handleInputChange = (event) => {
    let value = event.target.value;
    
    if (value.length < 1 || value[0] !== "@") {
      value = "@" + value;
    }
    // venmo usernames can only contain letters, numbers, underscores, and hyphens
    const regex = RegExp('/^@[a-zA-Z0-9_-]{0,29}$/');

    if (!regex.test(inputValue)) {
        // delete any characters that don't match the regex
        value = value.replace(/[^@a-zA-Z0-9_-]/g, "").replace(/(?!^)@/g, "");
    }

    let inputDiv = document.getElementById('venmoPopupInput');
    if (value.length < 5) {
        inputDiv.classList.add('invalid');
    }
    else {
        inputDiv.classList.remove('invalid');
    }  
    setInputValue(value);
  };

  /**
   * Handles the click event for the OK button.
   * 
   * Updates the venmo username in the database.
   */
  async function handleOKClick() {
    const REALM_APP_ID = "application-0-gydmq";
    const app = new Realm.App({ id: REALM_APP_ID });
    const venmo = inputValue.substring(1);
    const setVenmoPromise = app.currentUser.functions.setVenmo({userId: customer.id, venmoUsername: venmo}); // TODO: Backend Update Venmo Function not made yet
    setVenmoPromise.then(result => {
        const updatedVenmo = result;
        if (updatedVenmo !== null) {
            customer.venmo = updatedVenmo;
        }
        // TODO: Add a success message, hopefully with a nice animation
    }).catch((error) => {
      console.error(error);
    });
    showPopUp(null);
  };

  /**
   * Triggers the handleOKClick function when Enter is pressed
   */
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleOKClick();
    }
  }
  



  return (
    <div className="overlay" onClick={() => showPopUp(null)} >
        <div className="popupFrame">
            <div 
                className="popupContainer"
                onClick={(event) => event.stopPropagation()} // Prevents clicks within the popup from closing the popup
            >
                <h1>Enter Venmo</h1>
                <input 
                    id="venmoPopupInput"
                    className="venmoPopupInput"
                    value={inputValue}
                    type="text"
                    onChange={handleInputChange}
                    enterKeyHint="done"
                    onKeyDown={handleKeyDown} // (checking for enter key)
                />
                <div className="popupButtonsContainer">
                    <h3 className="cancelButton" onClick={() => showPopUp(null)}>Cancel</h3>
                    <h3 className="AcceptButton" onClick={() => handleOKClick()}>OK</h3>
                </div>
            </div>
        </div>
        
    </div>
  );
}

export default VenmoPopUp;