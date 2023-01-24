export interface IWarningModalReducerState {
  modalIsOpen: boolean
  content: string
}

const initialState: IWarningModalReducerState = {
  modalIsOpen: false,
  content: ""
}

export const WarningModalReducer = (state = initialState, action: ActionsTypes): IWarningModalReducerState => {
  switch (action.type) {
    case "[Warning Modal] show warning modal":
      return { ...state, modalIsOpen: true, content: action.payload }

    case "[Warning Modal] hide warning modal":
      return { ...state, modalIsOpen: false, content: "" }

    default:
      return state
  }
}

interface IShowWarningModalAction {
  type: "[Warning Modal] show warning modal"
  payload: string
}

export const showWarningModal = (content: string): IShowWarningModalAction => ({
  type: "[Warning Modal] show warning modal",
  payload: content
})

interface IHideWarningModalAction {
  type: "[Warning Modal] hide warning modal"
}

export const hideWarningModal = (): IHideWarningModalAction => ({
  type: "[Warning Modal] hide warning modal"
})

type ActionsTypes =
  ReturnType<typeof showWarningModal> |
  ReturnType<typeof hideWarningModal>