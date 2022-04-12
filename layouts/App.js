import React, { useEffect, useState } from 'react';
import AppBar from '../components/app/AppBar'
import Dialog from '../components/app/Dialog'
import FullDialog from '../components/app/FullDialog'
import SnackBar from '../components/app/SnackBar'
import Drawer from '../components/app/Drawer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux/actions/user'
import * as appActions from '../redux/actions/app'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../scss/app.scss'
import 'react-awesome-lightbox/build/style.css';
import Router from 'next/router'
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import * as snackbarActions from '../redux/actions/snackbar'
export const mainWindow = React.createRef();
export const alert = React.createRef();
export let containerRef;

const App = React.memo(props => {
    const { setProfile, logout } = props.userActions;
    const { setIsMobileApp } = props.appActions;
    const { profile, authenticated } = props.user;
    const { load, showAppBar } = props.app;
    let { checkPagination, sorts, filters, pageName, dateShow, searchShow, regionShow, pointShow, realizatorShow, inspectorShow } = props;
    const [reloadPage, setReloadPage] = useState(false);
    const { showSnackBar } = props.snackbarActions;
    useEffect( ()=>{
        if(authenticated&&!profile.role)
            setProfile()
        else if(!authenticated&&profile.role)
            logout(false)
    },[authenticated])
    useEffect( ()=>{
        if(mainWindow.current&&mainWindow.current.offsetWidth<900) {
            setIsMobileApp(true)
        }
    },[mainWindow])

    useEffect( ()=>{
        if(process.browser) {
            window.addEventListener('offline', ()=>{showSnackBar('Нет подключения к Интернету')})
        }
    },[process.browser])

    useEffect(()=>{
        const routeChangeStart = ()=>{
            setReloadPage(true)
        }

        const routeChangeComplete = (url) => {
            if(sessionStorage.scrollPostionName) {
                if (sessionStorage.scrollPostionName === url) {
                    let appBody = (document.getElementsByClassName('App-body'))[0]
                    appBody.scroll({
                        top: parseInt(sessionStorage.scrollPostionStore),
                        left: 0,
                        behavior: 'instant'
                    });
                    sessionStorage.scrollPostionStore = undefined
                    sessionStorage.scrollPostionName = undefined
                    sessionStorage.scrollPostionLimit = undefined
                }
                else if (!(
                        url.includes('nakladnayanapustuytaru')&&sessionStorage.scrollPostionName.includes('nakladnayanapustuytaru')
                        ||
                        url.includes('nakladnayanavecherniyvozvrat')&&sessionStorage.scrollPostionName.includes('nakladnayanavecherniyvozvrat')
                        ||
                        url.includes('nakladnayasklad1')&&sessionStorage.scrollPostionName.includes('nakladnayasklad1')
                        ||
                        url.includes('nakladnayasklad2')&&sessionStorage.scrollPostionName.includes('nakladnayasklad2')
                        ||
                        url.includes('otchetorganizatora')&&sessionStorage.scrollPostionName.includes('otchetorganizatora')
                        ||
                        url.includes('otchetrealizatora')&&sessionStorage.scrollPostionName.includes('otchetrealizatora')
                        ||
                        url.includes('actinspector')&&sessionStorage.scrollPostionName.includes('actinspector')
                        ||
                        url.includes('checklistinspector')&&sessionStorage.scrollPostionName.includes('checklistinspector')
                        ||
                        url.includes('plan')&&sessionStorage.scrollPostionName.includes('plan')
                        ||
                        url.includes('realizator')&&sessionStorage.scrollPostionName.includes('realizator')
                        ||
                        url.includes('inspector')&&sessionStorage.scrollPostionName.includes('inspector')
                        ||
                        url.includes('organizator')&&sessionStorage.scrollPostionName.includes('organizator')
                    )) {
                    sessionStorage.scrollPostionStore = undefined
                    sessionStorage.scrollPostionName = undefined
                    sessionStorage.scrollPostionLimit = undefined
                }
            }
            setReloadPage(false)
        }
        Router.events.on('routeChangeStart', routeChangeStart)
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', routeChangeStart)
            Router.events.off('routeChangeComplete', routeChangeComplete)
        }
    },[])

    containerRef = useBottomScrollListener(async()=>{
        if(checkPagination) {
            await setReloadPage(true)
            await checkPagination()
            await setReloadPage(false)
        }
    });

    return(
        <div ref={mainWindow} className='App'>
            {
                showAppBar?
                    <>
                    <Drawer/>
                    <AppBar
                        regionShow={regionShow}
                        pointShow={pointShow}
                        realizatorShow={realizatorShow}
                        inspectorShow={inspectorShow}
                        searchShow={searchShow}
                        dateShow={dateShow}
                        pageName={pageName}
                        sorts={sorts}
                        filters={filters}
                    />
                    </>
                    :
                    null
            }
            <div ref={containerRef} className='App-body'>
                {props.children}
            </div>
            <FullDialog/>
            <Dialog />
            <SnackBar/>
            {load||reloadPage?
                <div className='load'>
                    <CircularProgress/>
                </div>
                :
                null
            }
            <audio src='/alert.mp3' ref={alert}/>
        </div>
    )
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);