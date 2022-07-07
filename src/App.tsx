import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import NotFoundBlock from './components/NotFoundBlock';
import Cart from './pages/Cart';
import Home from './pages/Home';
import './scss/app.scss'
import FullPizza from "./pages/FullPizza";
import Mainlayout from "./layouts/Mainlayout";

const App: React.FC = () => {

    return (
        <Routes>
            <Route path='/' element={<Mainlayout/>}>
                <Route path='' element={<Home/>}/>
                <Route path='cart' element={<Cart/>}/>
                <Route path='pizza/:id' element={<FullPizza/>}/>
                <Route path='*' element={<NotFoundBlock/>}/>
            </Route>
        </Routes>
    );
};

export default App;