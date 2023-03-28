import { LIGHT, DARK } from "../action/ThemeAction";

export const  myThemeReducer = (state, action) => {
    switch (action.type) {
      case DARK:
          let newDarkState = {...state}
          newDarkState.value = {color: '#000000E3', status : true}
        return newDarkState;
        break
      case LIGHT:
        let newLightState = {...state}
        newLightState.value = {color : '#006975', status : false}
      return newLightState;
      break
      default:
        return state
    }
  }

