import { SET_POINT, SET_INSPECTOR, SET_REGION, SET_REALIZATOR, SHOW_APPBAR, SHOW_DRAWER, SET_FILTER, SET_SORT, SET_SEARCH, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE} from '../constants/app'

const initialState = {
    showAppBar: true,
    drawer: false,
    search: '',
    filter: '',
    sort: '-createdAt',
    isMobileApp: undefined,
    load: false,
    date: '',
    realizator: undefined,
    region: undefined,
    point: undefined,
    inspector: undefined,
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case SET_INSPECTOR:
            return {...state, inspector: action.payload}
        case SET_REALIZATOR:
            return {...state, realizator: action.payload}
        case SHOW_APPBAR:
            return {...state, showAppBar: action.payload}
        case SHOW_DRAWER:
            return {...state, drawer: action.payload}
        case SET_SORT:
            return {...state, sort: action.payload}
        case SET_FILTER:
            return {...state, filter: action.payload}
        case SET_SEARCH:
            return {...state, search: action.payload}
        case SET_IS_MOBILE_APP:
            return {...state, isMobileApp: action.payload}
        case SHOW_LOAD:
            return {...state, load: action.payload}
        case SET_REGION:
            return {...state, region: action.payload}
        case SET_DATE:
            return {...state, date: action.payload}
        case SET_POINT:
            return {...state, point: action.payload}
        default:
            return state
    }
}