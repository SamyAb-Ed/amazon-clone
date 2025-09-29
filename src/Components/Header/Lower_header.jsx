import React from "react";
import { IoIosMenu } from "react-icons/io";
import classes from "./Header.module.css";

const Lower_header = () => {
  return (
    <div className={classes.Lower_container}>
      <ul>
        <li>
          <IoIosMenu />
          <p>All</p>
        </li>
        <li>Today's Deals</li>
        <li>Customer Service</li>
        <li>Registry</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  );
};

export default Lower_header;
