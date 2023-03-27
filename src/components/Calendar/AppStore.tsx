import React, { createContext, useReducer } from 'react'
import { DefaultValues, Label, Storage } from './CalendarHelper'

export enum Types {
    MAIN_STORE = 'MainStore',
    TASK_MODAL = 'TaskModal',
    LABEL_MODAL = 'LabelModal',
    SEARCH_MODAL = 'SearchModal',
    DATE = 'Date',
    HOLIDAYS = 'Holidays'
}

type AppState = {
    mainStore: Storage,
    taskModal: boolean,
    labelModal: boolean,
    searchModal: boolean,
    day: Date,
    holidays: any[]
}

type Action =
    | { type: Types.MAIN_STORE, payload: Storage}
    | { type: Types.TASK_MODAL
        | Types.LABEL_MODAL
        | Types.SEARCH_MODAL,
    payload: boolean}
    | {type: Types.DATE, payload: Date}
    | {type: Types.HOLIDAYS, payload: any[]}

const reducer = (state: AppState, actions: Action): AppState => {
    const {type, payload} = actions
    switch (type) {
        case Types.MAIN_STORE:
            return {...state, mainStore: payload}
        case Types.TASK_MODAL:
            return {...state, taskModal: payload}
        case Types.LABEL_MODAL:
            return {...state, labelModal: payload}
        case Types.SEARCH_MODAL:
            return {...state, searchModal: payload}
        case Types.DATE:
            return {...state, day: payload}
        case Types.HOLIDAYS:
            return {...state, holidays: payload}
        default:
            return state
    }
}

const newStorage = new Storage()
    .addItem(new Label('High Priority', '#ff0000'), DefaultValues.LABEL_STORAGE_NAME)
    .addItem(new Label('Middle Priority', '#009000'), DefaultValues.LABEL_STORAGE_NAME)
    .addItem(new Label('Low Priority', '#0000ff'), DefaultValues.LABEL_STORAGE_NAME)

const defaultState: AppState  = {
    mainStore: newStorage,
    taskModal: false, labelModal: false, searchModal: false,
    day: new Date(Date.now()),
    holidays: []
}

export const AppContext = createContext<{
    state: AppState
    dispatch: React.Dispatch<Action>
}>({
    state: defaultState,
    dispatch: () => null
})

type AppContextProviderProps = {
    children: JSX.Element
};

export function AppContextProvider ({ children }: AppContextProviderProps): JSX.Element {
    const [state, dispatch] = useReducer(reducer, defaultState)
    return (
        <AppContext.Provider value={{state, dispatch}}>
            { children }
        </AppContext.Provider>
    )
}
