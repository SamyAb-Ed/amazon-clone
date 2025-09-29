import React, { useContext } from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { BiCart } from "react-icons/bi";
import Lower_header from "./Lower_header";
import { DataContext } from "../DataProvider/DataProvider";
import { useAuth } from "../AuthProvider/AuthProvider";

const Header = () => {
  const [{ basket }, dispatch] = useContext(DataContext);
  const { user, logout } = useAuth();
  return (
    <section className={classes.fixed}>
      <section className={classes.header_container}>
        <div className={classes.logo_container}>
          {/* logo */}
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="Amazon logo"
            />
          </Link>
          <div className={classes.delivery}>
            {/* delivery */}
            <span>
              <IoLocationOutline />
            </span>
            <div>
              <p>Delivered to</p>
              <span>Ethiopia</span>
            </div>
          </div>
        </div>
        <div className={classes.search}>
          {/* search */}
          <select name="" id="">
            <option value="">All</option>
          </select>
          <input type="text" placeholder="Search Amazon" />
          {/* search button */}
          <button className={classes.searchBtn}>
            <FaSearch size={20} />
          </button>
        </div>
        {/* right side link */}
        <div className={classes.order_container}>
          <Link to="" className={classes.language}>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1024px-Flag_of_the_United_States.svg.png"
              alt="USA Flag"
            />
            <select name="" id="">
              <option value="">EN</option>
            </select>
          </Link>
          {/* three components */}
          {user ? (
            <div className={classes.userMenu}>
              <p>Hello, {user.displayName || user.email}</p>
              <span>Account & Lists</span>
              <div className={classes.dropdown}>
                <Link to="/profile">Your Profile</Link>
                <Link to="/orders">Your Orders</Link>
                <button onClick={logout}>Sign Out</button>
              </div>
            </div>
          ) : (
            <Link to="/auth/signin">
              <p>Sign In</p>
              <span>Account & Lists</span>
            </Link>
          )}
          {/* orders */}

          <Link to="/orders">
            <p>returns</p>
            <span>& Orders</span>
          </Link>
          {/* cart */}
          <Link to="/cart" className={classes.cart}>
            <BiCart size={24} />
            <span>
              {basket.reduce((total, item) => total + (item.quantity || 1), 0)}
            </span>
          </Link>
        </div>
      </section>
      <Lower_header />
    </section>
  );
};

export default Header;
