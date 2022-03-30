import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import {getGeoPoints, getGeoPointsCount, saveGeoPoint} from '../src/gql/geoPoint'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import geoStyle from '../src/styleMUI/list'
import { Map, YMaps, Placemark } from 'react-yandex-maps';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as appActions from '../redux/actions/app'
import Confirmation from '../components/dialog/Confirmation'
import * as snackbarActions from '../redux/actions/snackbar'

const Geos = React.memo((props) => {
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const { region, point, isMobileApp, load } = props.app;
    const { showSnackBar } = props.snackbarActions;
    let [newGeo, setNewGeo] = useState(point&&list.length?list[0].geo:[42.8700000, 74.5900000]);
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { showLoad } = props.appActions;
    const { profile } = props.user;
    const initialRender = useRef(true);
    const classes = geoStyle();
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                setCount(await getGeoPointsCount({...point?{point: point._id}:{}, ...region?{region: region._id}:{}}))
                setList(await getGeoPoints({...point?{point: point._id}:{}, ...region?{region: region._id}:{}}))
                if(point)
                    setNewGeo(list.length?list[0].geo:[42.8700000, 74.5900000])
            }
        })()
    },[region, point])
    let dragend = (e) => {
        let geo = e.get('target').geometry.getCoordinates()
        setNewGeo(geo)
    }
    let [anchorEl, setAnchorEl] = useState(null);
    let open = event => {
        setAnchorEl(event.currentTarget);
    };
    let close = () => {
        setAnchorEl(null);
    };
    return (
        <YMaps>
            <App pointShow={profile.role!=='реализатор'} regionShow={profile.role!=='реализатор'} pageName='Геолокация'>
                <Head>
                    <title>Геолокация</title>
                    <meta name='description' content='ORP-SHORO' />
                    <meta property='og:title' content='Геолокация' />
                    <meta property='og:description' content='ORP-SHORO' />
                    <meta property='og:type' content='website' />
                    <meta property='og:image' content={`${urlMain}/512x512.png`} />
                    <meta property='og:url' content={`${urlMain}/geo`} />
                    <link rel='canonical' href={`${urlMain}/geo`}/>
                </Head>
                {
                    process.browser?
                        <div style={{position: 'fixed', top: 64, left: isMobileApp?0:300}}>
                            <Map onLoad={()=>{showLoad(false)}} height={window.innerHeight-64} width={isMobileApp?window.innerWidth:window.innerWidth-300}
                                 state={{ center: newGeo, zoom: 12 }}
                            >
                                {
                                    point?
                                        <Placemark
                                            onDragEnd={dragend}
                                            options={{draggable: true, iconColor: '#252850'}}
                                            properties={{iconCaption: point.name}}
                                            geometry={newGeo} />
                                        :
                                        list&&list.length?
                                            list.map((element, idx)=> {
                                                return <Placemark
                                                    key={idx}
                                                    options={{iconColor: '#252850'}}
                                                    properties={{iconCaption: element.point.name}}
                                                    geometry={element.geo} />
                                            })
                                            :
                                            null
                                }

                            </Map>
                            {
                                !load?
                                    !point?
                                        <div className='count'>
                                            {`Всего: ${count}`}
                                        </div>
                                        :
                                        <>
                                        <Fab onClick={open} color='primary' aria-label='add' className={classes.fab}>
                                            <SettingsIcon />
                                        </Fab>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={anchorEl}
                                            onClose={close}
                                            className={classes.menu}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <MenuItem onClick={async()=>{
                                                if (navigator.geolocation)
                                                    navigator.geolocation.getCurrentPosition(position=>setNewGeo([position.coords.latitude, position.coords.longitude]))
                                                else
                                                    showSnackBar('Геолокация не поддерживается')
                                                close()
                                            }}>Найти</MenuItem>
                                            <MenuItem onClick={async()=>{
                                                const action = async() => await saveGeoPoint({point: point._id, region: region._id, geo: newGeo})
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true);
                                                close()
                                            }}>Сохранить</MenuItem>
                                            <MenuItem onClick={async()=>close()}>Закрыть</MenuItem>
                                        </Menu>
                                        </>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
            </App>
        </YMaps>
    )
})

Geos.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin', 'реализатор'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    ctx.store.getState().app.load = true
    return {
        data: {
            list: await getGeoPoints({...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}, ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getGeoPointsCount({...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}, ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Geos);