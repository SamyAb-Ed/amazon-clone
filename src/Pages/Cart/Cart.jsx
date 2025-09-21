import React, {useContext} from 'react'
import classes from './Cart.module.css'
import LayOut from '../../Components/LayOut/LayOut'
// import {DataContext} from ""../../Components/DataProvider/DataProvider"
import CurrencyFormat from '../../Components/CurrencyFormat/CurrencyFormat'
import ProductCard from '../../Components/Product/ProductCard'
import {Link} from 'react-router-dom'
import { ActionType } from "../../Components/Utility/ActionType";
import { IoIosArrowUp } from 'react-icons/io'
const Cart =() =>{
  const [{bascket, user}, dispatch] = useContext(DataContext);
  const totalPrice = bascket?.reduce((amount, item) => item.price + amount, 0);
  const increment = (item) => {
    dispatch({type: ActionType.AddToBascket, item,
    });
    }
    const decrement = (item) => {
      dispatch({type: ActionType.RemoveOneFromBascket, item,
      });
      }

  return (
    <div>Cart</div>
  )
}

export default Cart