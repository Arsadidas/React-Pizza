import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzasStatus', async (params) => {
    const {
        sortByType,
        categoryType,
        sortWithoutMinus,
        search,
        currentPage
    } = params
    const {data} = await axios.get(`https://62ac3e809fa81d00a7ace0cf.mockapi.io/items?limit=4&page=${currentPage}&${categoryType}&sortBy=${sortWithoutMinus}&order=${sortByType}${search} `)
    return data
})


const initialState = {
    items: [],
    status: 'loading'
};

export const pizzaSlice = createSlice({
    name: "pizza",
    initialState,
    reducers: {
        setItems(state, action) {
            state.items = action.payload
        },
    },
    extraReducers: {
        [fetchPizzas.pending]: (state) => {
            state.status = 'loading'
            state.items = []
        },
        [fetchPizzas.fulfilled]: (state, action) => {
            state.items = action.payload
            state.status = 'success'
        },
        [fetchPizzas.rejected]: (state, action) => {
            state.status = 'error'
            state.items = []
        }
    }
});

export const selectPizzaData = (state) => state.pizza

export const {setItems} = pizzaSlice.actions;

export default pizzaSlice.reducer;
