import React from 'react';
import classes from './Results.module.css';
import LayOut from '../../Components/LayOut/LayOut';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {productUrl} from '../../Api/EndPoints';

function Results() {
    const [results, setResults] = useState([]);
    const { categoryName } = useParams();
    axios.get(`${productUrl}/products/category/${categoryName}`)
    .then((res) => {
        setResults(res.data)
    })
    .catch((err) => console.log(err));  
  
    return (
    <LayOut>
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
    </LayOut>
  );
}

export default Results