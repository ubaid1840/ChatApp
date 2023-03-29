import { createContext, useReducer } from "react";
import { SET } from '../action/ThemeAction'
import { myThemeReducer } from '../reducer/ThemeReducer'

export const ThemeContext = createContext()

const ThemContextProvider = (props) => {

    const [state, dispatch] = useReducer(myThemeReducer, { value: {color:'#000000E3'} })

    const toggleTheme = (color) => {
        dispatch({ type: SET, payload: {color : color} })
    }


    return ( 
        <ThemeContext.Provider
             value={{state, toggleTheme}}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemContextProvider