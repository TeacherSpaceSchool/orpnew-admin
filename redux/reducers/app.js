import { SET_POINT, SET_REGION, SHOW_APPBAR, SHOW_DRAWER, SET_FILTER, SET_SORT, SET_SEARCH, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE} from '../constants/app'

const initialState = {
    showAppBar: true,
    drawer: false,
    search: '',
    filter: '',
    sort: '-createdAt',
    isMobileApp: undefined,
    load: false,
    date: '',
    region: undefined,
    point: undefined,
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
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