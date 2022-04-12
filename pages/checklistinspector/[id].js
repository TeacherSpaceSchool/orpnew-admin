import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getChecklistInspector, setChecklistInspector, addChecklistInspector, deleteChecklistInspector} from '../../src/gql/checklistInspector'
import {getRealizator} from '../../src/gql/realizator'
import {getOrganizator} from '../../src/gql/organizator'
import checklistInspectorStyle from '../../src/styleMUI/list'
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
import * as snackbarActions from '../../redux/actions/snackbar'

const ChecklistInspector = React.memo((props) => {
    const classes = checklistInspectorStyle();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { setRegion, setPoint } = props.appActions;
    const { data } = props;
    const { isMobileApp, point, region } = props.app;
    const router = useRouter()
    const initialRender = useRef(true);
    const { profile } = props.user;
    let [checkAdmin, setCheckAdmin] = useState(data.object?data.object.checkAdmin:false);
    let [checkMainInspector, setCheckMainInspector] = useState(data.object?data.object.checkMainInspector:false);
    let [questions, setQuestions] = useState(data.object?JSON.parse(data.object.questions):[
        {
            name: 'Внешний вид',
            questions: [
                {
                    question: 'Униформа чистая и опрятная',
                    status: false,
                    score: 10
                },
                {
                    question: 'Униформа полностью укомплектована (фартук, косынка, бейджик)',
                    status: false,
                    score: 10
                },
                {
                    question: 'Руки чистые, маникюр аккуратный',
                    status: false,
                    score: 10
                }
            ]
        },
        {
            name: 'Рабочее место/стандарты рабочего места',
            questions: [
                {
                    question: 'Санитарное состояние кег в норме',
                    status: false,
                    score: 10
                },
                {
                    question: 'Вокруг рабочего места нет мусора, пустых стаканчиков от напитков',
                    status: false,
                    score: 10
                },
                {
                    question: 'Ценники на продукции вывешены на видном месте, по стандарту',
                    status: false,
                    score: 10
                }
            ]
        },
        {
            name: 'Рабочие стандарты реализатора',
            questions: [
                {
                    question: 'Реализатор вела себя вежливо и доброжелательно',
                    status: false,
                    score: 10
                },
                {
                    question: 'Реализатор использовала новый чистый стакан',
                    status: false,
                    score: 10
                },
                {
                    question: 'Продукция была налита в полном объеме',
                    status: false,
                    score: 10
                },
                {
                    question: 'Во время обслуживания реализатор все свое внимание обратила на клиента (не разговаривала по телефону, не занималась посторонней деятельностью)',
                    status: false,
                    score: 10
                }
            ]
        },
    ]);
    let [score, setScore] = useState(data.object?data.object.score:0);
    let [realizator, setRealizator] = useState(data.object?data.object.realizator:data.realizator?data.realizator:null);
    let [organizator, setOrganizator] = useState(data.object?data.object.organizator:data.organizator?data.organizator:null);
    useEffect(()=>{
        if(!initialRender.current&&router.query.id==='new') {
            score = 0
            for(let i = 0; i <questions.length; i++) {
                for(let i1 = 0; i1 <questions[i].questions.length; i1++) {
                    if(questions[i].questions[i1].status)
                        score += questions[i].questions[i1].score
                }
            }
            setScore(score)
        }
    },[questions])
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
        <App pageName='Чек-лист инспектора' pointShow={router.query.id==='new'} regionShow={router.query.id==='new'}>
            <Head>
                <title>Чек-лист инспектора</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Чек-лист инспектора' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/checklistinspector/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/checklistinspector/${router.query.id}`}/>
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
                    <center><h2>
                        {score}
                    </h2>
                    </center>
                    {
                        questions.map(
                            (element, idx)=><div>
                                <div className={classes.nameField} style={{color: 'black'}}>
                                    {element.name}
                                </div>
                                {
                                    element.questions.map(
                                        (element1, idx1)=>{
                                            return <><FormControlLabel
                                                style={{fontSize: '0.875rem'}}
                                                control={
                                                    <Checkbox
                                                        checked={element1.status}
                                                        onChange={()=>{
                                                            if(router.query.id==='new') {
                                                                questions[idx].questions[idx1].status = !questions[idx].questions[idx1].status
                                                                setQuestions([...questions])
                                                            }
                                                        }}
                                                        color='primary'
                                                    />
                                                }
                                                label={<div style={{fontSize: '0.875rem'}}>{element1.question}</div>}
                                            /><br/></>
                                        }
                                    )
                                }
                                <br/>
                            </div>
                        )
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
                                                    await addChecklistInspector({
                                                        questions: JSON.stringify(questions),
                                                        score,
                                                        region: region._id,
                                                        realizator: realizator._id,
                                                        organizator: organizator._id,
                                                        point: point._id
                                                    })
                                                    setRegion(undefined)
                                                    setPoint(undefined)
                                                    Router.push('/checklistinspectors')
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
                                                await setChecklistInspector({
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
                                                await deleteChecklistInspector(data.object._id)
                                                Router.push('/checklistinspectors')
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

ChecklistInspector.getInitialProps = async function(ctx) {
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
            object: ctx.query.id==='new'?null:await getChecklistInspector({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistInspector);