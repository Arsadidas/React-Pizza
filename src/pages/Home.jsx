import React, {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom';
import {selectFilter, setCategoryId, setCurrentPage, setFilters} from '../redux/slices/filterSlice';
import {Skeleton} from '../components/PizzaBlock/Skeleton';
import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Sort from '../components/Sort';
import {list} from '../components/Sort';
import qs from 'qs'
import {fetchPizzas, selectPizzaData} from "../redux/slices/pizzaSlice";

const Home = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isSearch = useRef(false)
    const isMounted = useRef(false)

    const {categoryId, sort, currentPage, searchValue} = useSelector(selectFilter)
    const {items, status} = useSelector(selectPizzaData)

    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const getPizzas = async () => {

        const sortByType = sort.sortProperty.includes('-') ? "asc" : "desc"
        const categoryType = categoryId > 0 ? `category=${categoryId}` : ""
        const sortWithoutMinus = sort.sortProperty.replace('-', '')
        const search = searchValue ? `&search=${searchValue}` : ""

        dispatch(fetchPizzas({
            sortByType,
            categoryType,
            sortWithoutMinus,
            search,
            currentPage
        }))
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
            getPizzas()
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

    const pizzas = items.map((pizza) => <Link key={pizza.id} to={`/pizza/${pizza.id}`}>
        <PizzaBlock pizza={pizza}/>
    </Link>)

    const skeletons = [...new Array(6)].map((item, index) => <Skeleton key={index}/>)

    return (
        <div className='container'>
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
                <Sort/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                <div className='content__error-info'>
                    <h2>Произошла ошибка 😢</h2>
                    <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
                </div>
            ) : (
                <div className="content__items">
                    {
                        status === 'loading' ? skeletons : pizzas
                    }
                </div>
            )}
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>

    );
};

export default Home;