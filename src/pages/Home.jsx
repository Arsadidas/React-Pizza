import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../App';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Sort from '../components/Sort';
import { list } from '../components/Sort';
import axios from "axios";
import qs from 'qs'

const Home = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isSearch = useRef(false)
    const isMounted = useRef(false)

    const { categoryId, sort, currentPage } = useSelector(state => state.filter)
    const { searchValue } = useContext(SearchContext)

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const fetchPizzas = () => {
        setLoading(true)

        const sortByType = sort.sortProperty.includes('-') ? "asc" : "desc"
        const categoryType = categoryId > 0 ? `category=${categoryId}` : ""
        const sortWithoutMinus = sort.sortProperty.replace('-', '')
        const search = searchValue ? `&search=${searchValue}` : ""

        axios.get(`https://62ac3e809fa81d00a7ace0cf.mockapi.io/items?limit=4&page=${currentPage}&${categoryType}&sortBy=${sortWithoutMinus}&order=${sortByType}${search} `)
            .then(res => {
                setItems(res.data)
                setLoading(false)
            })
    }

    useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1))

            const sort = list.find((obj) => obj.sortProperty === params.sortProperty)

            dispatch(setFilters({
                ...params,
                sort
            }))
            isSearch.current = true
        }
    }, [])



    useEffect(() => {
        window.scrollTo(0, 0)

        if (!isSearch.current) {
            fetchPizzas()
        }

        isSearch.current = false
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage
            })
            navigate(`?${queryString}`)
        }
        isMounted.current = true
    }, [categoryId, sort.sortProperty, currentPage])

    const pizzas = items.map((pizza) => <PizzaBlock key={pizza.id} pizza={pizza} />)

    const skeletons = [...new Array(6)].map((item, index) => <Skeleton key={index} />)

    return (
        <div className='container'>
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory} />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {
                    loading ? skeletons : pizzas
                }
            </div>
            <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>

    );
};

export default Home;