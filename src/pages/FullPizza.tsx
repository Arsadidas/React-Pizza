import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

const FullPizza: React.FC = () => {

    const [pizza, setPizza] = useState<{
        imageUrl: string
        title: string
        price: string
    }>()

    const {id} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchPizzas() {
            try {
                const {data} = await axios.get('https://62ac3e809fa81d00a7ace0cf.mockapi.io/items/' + id)
                setPizza(data)
            } catch (e) {
                alert('К сожалению, такой пиццы нету')
                navigate('/')
            }
        }

        fetchPizzas()
    }, [])

    if (!pizza) {
        return <>loading</>
    }
    return (
        <div className='container'>
            <img src={pizza.imageUrl} alt=""/>
            <h2>{pizza.title}</h2>
            <h4>{pizza.price}</h4>
        </div>
    );
};

export default FullPizza;