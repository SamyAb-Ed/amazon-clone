import React from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import { SlLocationPin } from "react-icons/sl";
import { BiCart } from "react-icons/bi";
import LowerHeader from "./LowerHeader";
import { useContext } from "react";
import { DataContext } from "../DataProvider/DataProvider";

const Header = () => {
  const [{basket}, dispatch] = useContext(DataContext);

  return (
    <section >
      <section className={classes.header_container}>
        {/* Logo and Delivery */}
        <div className={classes.logo_container}>
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="Amazon Logo"
            />
          </Link>
          <span>
            <SlLocationPin />
          </span>
          <div className={classes.deliver}>
            <p>Deliver to</p>
            <span>Ethiopia</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className={classes.search}>
          <select>
            <option value="">All</option>
          </select>
          <input type="text" />
          <FcSearch size={25} />
        </div>

        {/* Right side links */}
        <div className={classes.order_container}>
          {/* Language Selector */}
          <div>
            <Link to="" className={classes.language}>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1024px-Flag_of_the_United_States.svg.png"
                alt="US Flag"
              />
              <select>
                <option value="">EN</option>
              </select>
            </Link>
          </div>

          {/* Account Links */}
          <Link to="/login">
            <div>
              <p> Sign in</p>
              <span>Account & Lists</span>
            </div>
          </Link>

          <Link to="/orders">
            <p>Returns</p>
            <span>& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className={classes.cart}>
            <BiCart size={35} />
            <span>{basket.length}</span>
          </Link>
        </div>
        {/* Lower Header */}
      </section>
      <LowerHeader />
    </section>
  );
};

export default Header;
