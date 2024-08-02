import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UserData {
    accessToken: string;
    email:string;
    fullName:string;
    avatar?:string;
}

interface AuthSlice {
    status:boolean;
    userData:UserData | null
}

const initialState: AuthSlice = {
    status:false,
    userData:null
}


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser : (state, action:PayloadAction<UserData>) =>{
            state.status = true;
            state.userData = action.payload
        },
        logout: (state) =>{
            state.status = false;
            state.userData = null;
        },
        setToken: (state, action:PayloadAction<string>) =>{
            let token  = action?.payload;
            if(state.userData)
            state.userData = {...state.userData, accessToken:token}
        }
    }
});


export const { setUser, logout, setToken } = authSlice.actions;

export const useUser = (state:RootState) => state.auth.userData;
export const isLoggedIn = (state:RootState) => state.auth.status;


export default authSlice.reducer

export type { AuthSlice, UserData }