import React from 'react';
import AddRemovePopUp from './AddRemovePopUp';
import VenmoPopUp from './VenmoPopUp';
import SelectorPopUp from './SelectorPopUp';
import HistoryPopUp from './HistoryPopUp';

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
        : popUpType === "selector" ? (
        <SelectorPopUp
          showPopUp={showPopUp}
          customer={customer}/>)
        : popUpType === "history" ? (
        <HistoryPopUp
          showPopUp={showPopUp}
          customer={customer}/>)
        :
        <></>}
    </>
  )
}

export default PopUp;
