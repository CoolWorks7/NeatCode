import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        isAuth: false,
        username: '',
        _id: '',
        name: ''
    }
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAuth: (state) => {
            // retrieve the user from the local storage
            let userData = localStorage.getItem('NeatCodeUser')
            if (userData) {
                userData = JSON.parse(userData)
                return {
                    ...state, 
                    user: {
                        ...userData,
                        isAuth: true
                    }
                }
            }
            else return state
        }, 
        logOut: () => {
            // delete user from local storage
            localStorage.removeItem('NeatCodeUser')
            return initialState
        },
        logIn: (state, action) => {  
            localStorage.setItem('NeatCodeUser', JSON.stringify(action.payload))
            return {
                ...state,
                user: {
                    ...action.payload,
                    isAuth: true
                }
            }
        }
    }
})

export const {logIn, logOut, getAuth} = auth.actions
export default auth.reducer