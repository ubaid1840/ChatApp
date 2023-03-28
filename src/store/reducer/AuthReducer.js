import { getAuth } from 'firebase/auth'
import { CLEAR_AUTH, SET_AUTH, START_LOADING, STOP_LOADING } from '../action/AuthAction'

export const myAuthReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTH:
      let newAuthState = { ...state }
      newAuthState.value.email = action.payload.email
      newAuthState.value.token = action.payload.token 
      return newAuthState
      break
    case CLEAR_AUTH:
      let newClearState = { ...state }
      newClearState.value.email = null
      newClearState.value.token = null
      return newClearState
      break
    case START_LOADING:
      let newStartLoading = { ...state }
      newStartLoading.value.loading = true
      return newStartLoading
      break
    case STOP_LOADING:
      let newStopLoading = { ...state }
      newStopLoading.value.loading = false
      return newStopLoading
      break
    default:
      return state
  }
}

