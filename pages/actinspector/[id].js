import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getActInspector, setActInspector, addActInspector, deleteActInspector} from '../../src/gql/actInspector'
import {getPrices} from '../../src/gql/price'
import {getRealizator} from '../../src/gql/realizator'
import {getSpecialPrice} from '../../src/gql/specialPrice'
import {getOrganizator} from '../../src/gql/organizator'
import actInspectorStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as appActions from '../../redux/actions/app'
import { useRouter } from 'next/router'
import Router from 'next/router'
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import {pdDDMMYYYY} from '../../src/lib';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as snackbarActions from '../../redux/actions/snackbar'
const types = ['Конфликт с клиентом', 'Работа в нетрезвом состоянии', 'Отсутствие на рабочем месте более 20 минут', 'Вместо реализатора работает посторонний человек']

const ActInspector = React.memo((props) => {
    const classes = actInspectorStyle();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { setRegion, setPoint } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    const { data } = props;
    const { isMobileApp, point, region } = props.app;
    const router = useRouter()
    const initialRender = useRef(true);
    const { profile } = props.user;
    let [checkAdmin, setCheckAdmin] = useState(data.object?data.object.checkAdmin:false);
    let [checkMainInspector, setCheckMainInspector] = useState(data.object?data.object.checkMainInspector:false);
    let [type, setType] = useState(data.object?data.object.type:'Конфликт с клиентом');
    let [realizator, setRealizator] = useState(data.object?data.object.realizator:data.realizator?data.realizator:null);
    let [organizator, setOrganizator] = useState(data.object?data.object.organizator:data.organizator?data.organizator:null);
    useEffect(()=>{
        (async ()=>{
            if(!initialRender.current) {
                if(region)
                    setOrganizator(await getOrganizator({_id: region._id}))
                else 
                    setOrganizator(null)
            }
        })()
    },[region])
    useEffect(()=>{
        (async ()=>{
            if(initialRender.current) {
                initialRender.current = false;
            }
            else {
                if(point)
                    setRealizator(await getRealizator({_id: point._id}))
                else
                    setRealizator(null)
            }
        })()
    },[point])
    return (
        <App pageName='АКТ инспектора' pointShow={router.query.id==='new'} regionShow={router.query.id==='new'}>
            <Head>
                <title>АКТ инспектора</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='АКТ инспектора' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/actinspector/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/actinspector/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Дата:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYYY(data.object.createdAt)}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        data.object&&data.object.region||region?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Регион:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object?data.object.region.name:region.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        organizator?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Организатор:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {organizator.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        data.object&&data.object.point||point?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Точка:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object?data.object.point.name:point.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        realizator?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Реализатор:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {realizator.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        data.object?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Инспектор:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object.inspector.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        data.object?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Тип:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object.type}
                                </div>
                            </div>
                            :
                            <FormControl className={classes.input}>
                                <InputLabel>Тип</InputLabel>
                                <Select value={type} onChange={event=>setType(event.target.value)}>
                                    {types.map((element)=>
                                        <MenuItem key={element} value={element}>{element}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                    }
                    <br/>
                    <div className={classes.row}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkMainInspector}
                                    onChange={()=>{if(profile.role==='главинспектор'&&!checkAdmin)setCheckMainInspector(!checkMainInspector)}}
                                    color='primary'
                                />
                            }
                            label='Главинспектор принял'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkAdmin}
                                    onChange={()=>{if(profile.role==='admin')setCheckAdmin(!checkAdmin)}}
                                    color='primary'
                                />
                            }
                            label='Admin принял'
                        />
                    </div>
                    {
                        (router.query.id==='new'||!checkMainInspector)&&profile.role==='инспектор'||!checkAdmin&&profile.role==='главинспектор'||profile.role==='admin'?
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    router.query.id==='new'&&profile.role==='инспектор'?
                                        <Button size='small' color='primary' onClick={()=>{
                                            if(realizator) {
                                                const action = async () => {
                                                    await addActInspector({
                                                        type,
                                                        region: region._id,
                                                        realizator: realizator._id,
                                                        organizator: organizator._id,
                                                        point: point._id
                                                    })
                                                    setRegion(undefined)
                                                    setPoint(undefined)
                                                    Router.push('/actinspectors')
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true);
                                            }
                                            else
                                                showSnackBar('Заполните все поля')
                                        }} className={classes.button}>
                                            Добавить
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    !checkAdmin&&profile.role==='главинспектор'||profile.role==='admin'?
                                        <Button size='small' color='primary' onClick={()=>{
                                            const action = async() => {
                                                await setActInspector({
                                                    _id: data.object._id,
                                                    ...profile.role==='admin'&&checkAdmin!==data.object.checkAdmin?{checkAdmin}:{},
                                                    ...profile.role==='главинспектор'&&checkMainInspector!==data.object.checkMainInspector?{checkMainInspector}:{},
                                                })
                                                window.location.reload()
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true);
                                        }} className={classes.button}>
                                            Сохранить
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    data.object&&!data.object.checkMainInspector&&!data.object.checkAdmin?
                                        <Button size='small' color='secondary' onClick={()=>{
                                            const action = async() => {
                                                await deleteActInspector(data.object._id)
                                                Router.push('/actinspectors')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true);
                                        }} className={classes.button}>
                                            Удалить
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                            :
                            null
                    }
                </CardContent>
            </Card>
        </App>
    )
})

ActInspector.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'главинспектор', 'инспектор'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else
            Router.push('/')
    let realizator, organizator
    if(ctx.store.getState().app.region&&ctx.query.id==='new')
        organizator = await getOrganizator({_id: ctx.store.getState().app.region._id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    if(ctx.store.getState().app.point&&ctx.query.id==='new')
        realizator = await getRealizator({_id: ctx.store.getState().app.point._id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
            object: ctx.query.id==='new'?null:await getActInspector({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            organizator,
            realizator
        }
    };
};

function mapStateToProps (state) {
    return {
        organizator: state.organizator,
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

export default connect(mapStateToProps, mapDispatchToProps)(ActInspector);