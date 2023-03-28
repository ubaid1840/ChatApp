import { createContext, useReducer } from "react";
import { DARK, LIGHT } from '../action/ThemeAction'
import { myThemeReducer } from '../reducer/ThemeReducer'

export const ThemeContext = createContext()

const ThemContextProvider = (props) => {

    const [state, dispatch] = useReducer(myThemeReducer, { value: {color:'#000000E3', status : true} })

    const darkValue = () => {
        dispatch({ type: DARK })
    }

    const lightValue = () => {
        dispatch({ type: LIGHT })
    }

    return ( 
        <ThemeContext.Provider
             value={{state, darkValue, lightValue}}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemContextProvider