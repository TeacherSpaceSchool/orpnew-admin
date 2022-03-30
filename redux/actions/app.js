import { SHOW_APPBAR, SHOW_DRAWER, SET_SEARCH, SET_FILTER, SET_SORT, SET_IS_MOBILE_APP, SHOW_LOAD, SET_REGION, SET_DATE, SET_POINT } from '../constants/app'

export function setPoint(data) {
    return {
        type: SET_POINT,
        payload: data
    }
}

export function showAppBar(data) {
    return {
        type: SHOW_APPBAR,
        payload: data
    }
}

export function showDrawer(data) {
    return {
        type: SHOW_DRAWER,
        payload: data
    }
}

export function setRegion(data) {
    return {
        type: SET_REGION,
        payload: data
    }
}

export function setFilter(data) {
    return {
        type: SET_FILTER,
        payload: data
    }
}

export function setDate(data) {
    return {
        type: SET_DATE,
        payload: data
    }
}

export function setSort(data) {
    return {
        type: SET_SORT,
        payload: data
    }
}

export function setSearch(data) {
    return {
        type: SET_SEARCH,
        payload: data
    }
}

export function setIsMobileApp(data) {
    return {
        type: SET_IS_MOBILE_APP,
        payload: data
    }
}

export function showLoad(show) {
    return {
        type: SHOW_LOAD,
        payload: show
    }
}