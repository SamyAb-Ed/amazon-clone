import React, { useContext } from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import { FcSearch } from "react-icons/fc";
import { SlLocationPin } from "react-icons/sl";
import { BiCart } from "react-icons/bi";
import LowerHeader from "./LowerHeader";
import { DataContext } from "../DataProvider/DataProvider";
import { ActionType } from "../Utility/ActionType";
import { auth } from "../Utility/MockAuth";

const Header = () => {
  const [state, dispatch] = useContext(DataContext);
  const { basket, user } = state;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch({ type: ActionType.SignOut });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  console.log("Header - Current basket:", basket);
  console.log("Header - Basket length:", basket?.length);

  return (
    <section>
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
          {user ? (
            <div className={classes.userMenu}>
              <div>
                <p>Hello, {user.name}</p>
                <span>Account & Lists</span>
              </div>
              <button onClick={handleSignOut} className={classes.signOutBtn}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <div>
                <p>Hello, Sign in</p>
                <span>Account & Lists</span>
              </div>
            </Link>
          )}

          <Link to="/orders">
            <p>Returns</p>
            <span>& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className={classes.cart}>
            <BiCart size={35} />
            <span>
              {basket.reduce((total, item) => total + (item.quantity || 1), 0)}
            </span>
          </Link>
        </div>
        {/* Lower Header */}
      </section>
      <LowerHeader />
    </section>
  );
};

export default Header;
