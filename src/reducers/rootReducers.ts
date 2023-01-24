import { combineReducers } from 'redux'
import { ModelReducer } from './modelReducer'
import { WarningModalReducer } from './warningModalReducer'

export const rootReducer = combineReducers({
  model: ModelReducer,
  warningModal: WarningModalReducer
})

export type RootState = ReturnType<typeof rootReducer>