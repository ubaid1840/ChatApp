import { SET } from "../action/ThemeAction";

export const  myThemeReducer = (state, action) => {
    switch (action.type) {
      case SET:
          let newThemecolorstate = {...state}
          newThemecolorstate.value.color = action.payload.color
        return newThemecolorstate
      break
      default:
        return state
    }
  }

