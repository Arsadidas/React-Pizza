import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {RootState} from "../store";
import {FilterSortType} from "./filterSlice";

type FetchPizzas = Record<string, string>

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzasStatus', async (params: FetchPizzas) => {
    const {
        sortByType,
        categoryType,
        sortWithoutMinus,
        search,
        currentPage
    } = params
    const {data} = await axios.get<PizzaItems[]>(`https://62ac3e809fa81d00a7ace0cf.mockapi.io/items?limit=4&page=${currentPage}&${categoryType}&sortBy=${sortWithoutMinus}&order=${sortByType}${search} `)
    return data
})

export type SearchPizzaParams = {
    sortByType:string,
    categoryType:string,
    sortWithoutMinus:string,
    search:string,
    currentPage:string
}

enum StatusTypes {
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error'
}

type PizzaItems = {
    id: number
    title: string
    price: number
    imageUrl: string
    sizes: number[]
    types: number[]
    rating: number
}

interface PizzaSliceState {
    items: PizzaItems[]
    status: StatusTypes
}

const initialState: PizzaSliceState = {
    items: [],
    status: StatusTypes.LOADING
};

export const pizzaSlice = createSlice({
    name: "pizza",
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<PizzaItems[]>) {
            state.items = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPizzas.pending, (state, action) => {
            state.status = StatusTypes.LOADING
            state.items = []
        })

        builder.addCase(fetchPizzas.fulfilled, (state, action) => {
            state.items = action.payload
            state.status = StatusTypes.SUCCESS
        })

        builder.addCase(fetchPizzas.rejected, (state, action) => {
            state.status = StatusTypes.ERROR
            state.items = []
        })
    }
});

export const selectPizzaData = (state: RootState) => state.pizza

export const {setItems} = pizzaSlice.actions;

export default pizzaSlice.reducer;
