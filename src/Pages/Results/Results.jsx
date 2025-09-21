import React, {useEffect, useState} from 'react';
import classes from './Results.module.css';
import LayOut from '../../Components/LayOut/LayOut';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {productUrl} from '../../Api/EndPoints';
import productCard from '../../Components/Product/ProductCard';
import Loader from '../../Components/Loader/Loader';

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { categoryName } = useParams();

    useEffect(() => {
    setLoading(true);

    axios.get(`${productUrl}/category/${categoryName}`)
    .then((res) => {
        setResults(res.data)
    })
    .catch((err) => console.log(err))
    .finally (() => setLoading(false));
    }, [categoryName]);
  
    return (
    <LayOut>
        {loading? (<Loader />) :(
        <section>
            <h1 style={{padding:"30px"}}>Results </h1>
            <p style={{padding:"30px"}}>Category: {categoryName}</p>
            <hr />
            <div className={classes.products_container}>
                {results?.map((product) => (
                    <productCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )}
    </LayOut>
  );
}

export default Results