import React from 'react';
import numeral from 'numeral';

const CurrencyFormat = ({amount}) =>{
    const formatAmount = numeral(amount).format('$0,0.00');
    return <span>{formatAmount}</span>
}
export default CurrencyFormat;