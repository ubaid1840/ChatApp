import { createContext, useReducer } from "react";
import { CLEAR_AUTH, SET_AUTH, START_LOADING, STOP_LOADING } from '../action/AuthAction'
import { myAuthReducer } from '../reducer/AuthReducer'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from '../../config/firebase'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {

    const [state, dispatch] = useReducer(myAuthReducer, { value: { email: null, token: null, loading: false } })

    const setAuth = (Email, Password) => {
        dispatch({ type: START_LOADING })
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, Email, Password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: SET_AUTH, payload: { email: Email, token: user.stsTokenManager.refreshToken } })
                dispatch({ type: STOP_LOADING })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                dispatch({ type: STOP_LOADING })
                dispatch({ type: CLEAR_AUTH })
                alert(errorMessage)
            });
    }

    const clearAuth = () => {

        dispatch({ type: START_LOADING })
        const auth = getAuth();
        signOut(auth).then(() => {
            dispatch({ type: CLEAR_AUTH })
            dispatch({ type: STOP_LOADING })
            //  console.log('user sign out')
        }).catch((error) => {
            dispatch({ type: STOP_LOADING })
            console.log(error)
        });

    }



    return (
        <AuthContext.Provider
            value={{ state, setAuth, clearAuth }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider