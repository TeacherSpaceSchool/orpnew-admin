import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getOtchetRealizatora, setOtchetRealizatora, addOtchetRealizatora, deleteOtchetRealizatora} from '../../src/gql/otchetRealizatora'
import {getPrices} from '../../src/gql/price'
import {getRealizator} from '../../src/gql/realizator'
import {getSpecialPrice} from '../../src/gql/specialPrice'
import {getOrganizator} from '../../src/gql/organizator'
import otchetRealizatoraStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as appActions from '../../redux/actions/app'
import { useRouter } from 'next/router'
import Router from 'next/router'
import TextField from '@material-ui/core/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import SetTime from '../../components/dialog/SetTime'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import {checkInt, pdDDMMYYYY} from '../../src/lib';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { pdHHMM } from '../../src/lib'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const OtchetRealizatora = React.memo((props) => {
    const classes = otchetRealizatoraStyle();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp, point, region } = props.app;
    const { setPoint } = props.appActions;
    const router = useRouter()
    const initialRender = useRef(true);
    const { profile } = props.user;
    const dataTableSimple = {
        'vydano': {
            'r':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            'd1':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            'd2':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            'd3':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            'i':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
        },
        'vozvrat': {
            'v':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            's':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            'p':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
            'virychka':
                {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
        },
        'i': {
            'iv':'',
            'm':'',
            'o': 100,
            'n':'',
            'inc':'',
            'fv': -100,
        },
        'r':'',
    }
    let [checkAdmin, setCheckAdmin] = useState(data.object.checkAdmin);
    let [checkOrganizator, setCheckOrganizator] = useState(data.object.checkOrganizator);
    let [prices, setPrices] = useState(data.prices);
    let [object, setObject] = useState(data.object);
    let [nakladnaya, setNakladnaya] = useState(data.object.dataTable);
    let [realizator, setRealizator] = useState(data.realizator);
    let timeType = useRef([]);
    useEffect(()=>{
            (async ()=>{
                if(initialRender.current) {
                    initialRender.current = false;
                }
                else {
                    if (point&& point.guid !== 'lol') {
                        setRealizator(await getRealizator({_id: point._id}))
                        let object = await getOtchetRealizatora({point: point._id})
                        if (object) {
                            setObject({...object})
                            setNakladnaya({...JSON.parse(object.dataTable)})
                        }
                        else {
                            setObject({})
                            setNakladnaya({...dataTableSimple})
                        }
                        let _prices;
                        prices = {};
                        _prices = await getSpecialPrice({_id: point._id})
                        if(!_prices) {
                            _prices = await getPrices({})
                            for (let i = 0; i < _prices.length; i++) {
                                prices[_prices[i].name] = _prices[i].price
                            }
                        }
                        else
                            prices = JSON.parse(_prices.prices)
                        setPrices({...prices})
                    }
                    else {
                        setRealizator(undefined)
                        setObject({})
                        setNakladnaya({...dataTableSimple})
                    }
                }
            })()
    },[point])
    let handleVozvrat =  (event, type, what) => {
        if(!data.expiredDate) {
            nakladnaya= {...nakladnaya}
            if(what!=='time'){
                if(!nakladnaya['vozvrat'][type]['time']){
                    nakladnaya['vozvrat'][type]['time'] = pdHHMM(new Date())
                }
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya['vozvrat'][type][what] = ''
                } else {
                    if(litr<0)
                        litr *= -1
                    nakladnaya['vozvrat'][type][what] = litr
                }
                nakladnaya['vozvrat']['p'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)] = checkInt(nakladnaya['vydano']['i'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)]) - (checkInt(nakladnaya['vozvrat']['v'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)]) + checkInt(nakladnaya['vozvrat']['v'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)+'1']) + checkInt(nakladnaya['vozvrat']['s'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)]))
                let prodanolitrov =  checkInt(nakladnaya['vozvrat']['p']['ml']) + checkInt(nakladnaya['vozvrat']['p']['chl']) + checkInt(nakladnaya['vozvrat']['p']['kl'])
                prodanolitrov =  prodanolitrov * 1.1
                let prodanolitrovemk =  checkInt(nakladnaya['vozvrat']['p']['s02']*0.2) + checkInt(nakladnaya['vozvrat']['p']['s04']*0.4) + checkInt(nakladnaya['vozvrat']['p']['b'])
                if (prodanolitrovemk > prodanolitrov){
                    let rastrata  = prodanolitrovemk -  prodanolitrov
                    nakladnaya['r'] = rastrata.toFixed(1)
                } else
                    nakladnaya['r'] = 0
                nakladnaya['vozvrat']['virychka']['ml'] = checkInt(nakladnaya['vozvrat']['p']['ml']) * (prices['Максым']!==undefined?parseInt(prices['Максым']):0)
                nakladnaya['vozvrat']['virychka']['chl'] = checkInt(nakladnaya['vozvrat']['p']['chl']) * (prices['Чалап']!==undefined?parseInt(prices['Чалап']):0)
                nakladnaya['vozvrat']['virychka']['kl'] = checkInt(nakladnaya['vozvrat']['p']['kl']) * (prices['Квас']!==undefined?parseInt(prices['Квас']):0)
                nakladnaya['vozvrat']['virychka']['sl'] = checkInt(nakladnaya['vozvrat']['p']['sl']) * (prices['Стакан Легенда']!==undefined?parseInt(prices['Стакан Легенда']):0)
                nakladnaya['i']['iv'] = checkInt(nakladnaya['vozvrat']['virychka']['ml']) + checkInt(nakladnaya['vozvrat']['virychka']['chl']) + checkInt(nakladnaya['vozvrat']['virychka']['kl']) + checkInt(nakladnaya['vozvrat']['virychka']['sl'])
           }
            else {
                nakladnaya['vozvrat'][type][what] = event.target.value
            }
            nakladnaya['i']['fv'] = checkInt(nakladnaya['i']['iv']) - checkInt(nakladnaya['i']['m']) - checkInt(nakladnaya['i']['o']) - checkInt(nakladnaya['i']['n']) - checkInt(nakladnaya['i']['inc'])
            setNakladnaya(nakladnaya)
        }
    };
    let handleVydano =  (event, type, what) => {
        if(!data.expiredDate) {
            nakladnaya = {...nakladnaya}
            if(what!=='time'){
                if(!nakladnaya['vydano'][type]['time']){
                    nakladnaya['vydano'][type]['time'] = pdHHMM(new Date())
                }
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya['vydano'][type][what] = ''
                }
                else {
                    if(litr<0)
                        litr *= -1
                    nakladnaya['vydano'][type][what] = litr
                }
                nakladnaya['vydano']['i'][what] = checkInt(nakladnaya['vydano']['r'][what]) + checkInt(nakladnaya['vydano']['d1'][what]) + checkInt(nakladnaya['vydano']['d2'][what]) + checkInt(nakladnaya['vydano']['d3'][what])
                nakladnaya['vozvrat']['p'][what] = checkInt(nakladnaya['vydano']['i'][what]) - (checkInt(nakladnaya['vozvrat']['v'][what]) + checkInt(nakladnaya['vozvrat']['v'][what+'1']) + checkInt(nakladnaya['vozvrat']['s'][what]))
                nakladnaya['vozvrat']['virychka']['ml'] = checkInt(nakladnaya['vozvrat']['p']['ml']) * (prices['Максым']!==undefined?parseInt(prices['Максым']):0)
                nakladnaya['vozvrat']['virychka']['chl'] = checkInt(nakladnaya['vozvrat']['p']['chl']) * (prices['Чалап']!==undefined?parseInt(prices['Чалап']):0)
                nakladnaya['vozvrat']['virychka']['kl'] = checkInt(nakladnaya['vozvrat']['p']['kl']) * (prices['Квас']!==undefined?parseInt(prices['Квас']):0)
                nakladnaya['vozvrat']['virychka']['sl'] = checkInt(nakladnaya['vozvrat']['p']['sl']) * (prices['Стакан Легенда']!==undefined?parseInt(prices['Стакан Легенда']):0)
                nakladnaya['i']['iv'] = checkInt(nakladnaya['vozvrat']['virychka']['ml']) + checkInt(nakladnaya['vozvrat']['virychka']['chl']) + checkInt(nakladnaya['vozvrat']['virychka']['kl']) + checkInt(nakladnaya['vozvrat']['virychka']['sl'])
                let prodanolitrov =  checkInt(nakladnaya['vozvrat']['p']['ml']) + checkInt(nakladnaya['vozvrat']['p']['chl']) + checkInt(nakladnaya['vozvrat']['p']['kl'])
                prodanolitrov =  prodanolitrov * 1.1
                let prodanolitrovemk =  checkInt(nakladnaya['vozvrat']['p']['s02'])*0.2 + checkInt(nakladnaya['vozvrat']['p']['s04'])*0.4 + checkInt(nakladnaya['vozvrat']['p']['b'])
                if (prodanolitrovemk > prodanolitrov){
                    let rastrata  = prodanolitrovemk -  prodanolitrov
                    nakladnaya['r'] = rastrata.toFixed(1)
                }
                else
                    nakladnaya['r'] = 0
            }
            else {
                nakladnaya['vydano'][type][what] = event.target.value
            }
            nakladnaya['i']['fv'] = checkInt(nakladnaya['i']['iv']) - checkInt(nakladnaya['i']['m']) - checkInt(nakladnaya['i']['o']) - checkInt(nakladnaya['i']['n']) - checkInt(nakladnaya['i']['inc'])
            setNakladnaya(nakladnaya)
        }
    };
    let handleItogo =  (event, type) => {
        if(!data.expiredDate) {
            nakladnaya= {...nakladnaya}
            let litr = parseInt(event.target.value)
            if (isNaN(litr)) {
                nakladnaya['i'][type] = ''
            } else {
                if(litr<0)
                    litr *= -1
                nakladnaya['i'][type] = litr
            }
            nakladnaya['i']['fv'] = checkInt(nakladnaya['i']['iv']) - checkInt(nakladnaya['i']['m']) - checkInt(nakladnaya['i']['o']) - checkInt(nakladnaya['i']['n']) - checkInt(nakladnaya['i']['inc'])
            setNakladnaya(nakladnaya)
        }
    };
    let handleTime =  (time) => {
        if(!data.expiredDate) {
            if(timeType.current[0]==='vydano')
                handleVydano({target: {value: time}}, timeType.current[1], 'time')
            else
                handleVozvrat({target: {value: time}}, timeType.current[1], 'time')
        }
    };
    return (
        <App pageName='Отчет реализатора' pointShow={router.query.id==='new'}>
            <Head>
                <title>Отчет реализатора</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Отчет реализатора' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/otchetrealizatora/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/otchetrealizatora/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        object.createdAt?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Дата:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYYY(object.createdAt)}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        object.region||region?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Регион:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {object.region?object.region.name:region.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        data.organizator?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Организатор:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.organizator.name}
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        object.point||point?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Точка:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {object.point?object.point.name:point.name}
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
                    <div className={classes.row}>
                        <div className={classes.nameField}>
                            Выручка:&nbsp;
                        </div>
                        <div className={classes.value}>
                            {nakladnaya.i.fv}
                        </div>
                    </div>
                    {
                        nakladnaya.r?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Перерасход:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {nakladnaya.r}
                                </div>
                            </div>
                            :
                            null
                    }
                    <br/>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Выдано</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Растановка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.r.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.r.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.r.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', cursor: 'pointer', marginBottom: 10}} onClick={()=>{
                                if(!data.expiredDate) {
                                    timeType.current = (['vydano', 'r'])
                                    setMiniDialog('Вы уверены?', <SetTime setTimeString={handleTime}/>)
                                    showMiniDialog(true);
                                }
                            }}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Время:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.time}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.ml}
                                        onChange={(event)=>{handleVydano(event, 'r', 'ml')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.chl}
                                        onChange={(event)=>{handleVydano(event, 'r', 'chl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.kl}
                                        onChange={(event)=>{handleVydano(event, 'r', 'kl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.sl}
                                        onChange={(event)=>{handleVydano(event, 'r', 'sl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.s02}
                                        onChange={(event)=>{handleVydano(event, 'r', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.s04}
                                        onChange={(event)=>{handleVydano(event, 'r', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.b}
                                        onChange={(event)=>{handleVydano(event, 'r', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>1-й долив</Typography>

                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', cursor: 'pointer', marginBottom: 10}}>
                                <center style={{width: '100%'}} onClick={()=>{
                                    if(!data.expiredDate) {
                                        timeType.current = (['vydano', 'd1'])
                                        setMiniDialog('Вы уверены?', <SetTime setTimeString={handleTime}/>)
                                        showMiniDialog(true);
                                    }
                                }}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Время:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.time}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.ml}
                                        onChange={(event)=>{handleVydano(event, 'd1', 'ml')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.chl}
                                        onChange={(event)=>{handleVydano(event, 'd1', 'chl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.kl}
                                        onChange={(event)=>{handleVydano(event, 'd1', 'kl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.sl}
                                        onChange={(event)=>{handleVydano(event, 'd1', 'sl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.s02}
                                        onChange={(event)=>{handleVydano(event, 'd1', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.s04}
                                        onChange={(event)=>{handleVydano(event, 'd1', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.b}
                                        onChange={(event)=>{handleVydano(event, 'd1', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>2-й долив</Typography>

                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', cursor: 'pointer', marginBottom: 10}} onClick={()=>{
                                if(!data.expiredDate) {
                                    timeType.current = (['vydano', 'd2'])
                                    setMiniDialog('Вы уверены?', <SetTime setTimeString={handleTime}/>)
                                    showMiniDialog(true);
                                }
                            }}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Время:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.time}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.ml}
                                        onChange={(event)=>{handleVydano(event, 'd2', 'ml')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.chl}
                                        onChange={(event)=>{handleVydano(event, 'd2', 'chl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.kl}
                                        onChange={(event)=>{handleVydano(event, 'd2', 'kl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.sl}
                                        onChange={(event)=>{handleVydano(event, 'd2', 'sl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.s02}
                                        onChange={(event)=>{handleVydano(event, 'd2', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.s04}
                                        onChange={(event)=>{handleVydano(event, 'd2', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.b}
                                        onChange={(event)=>{handleVydano(event, 'd2', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>3-й долив</Typography>

                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', cursor: 'pointer', marginBottom: 10}} onClick={()=>{
                                if(!data.expiredDate) {
                                    timeType.current = (['vydano', 'd3'])
                                    setMiniDialog('Вы уверены?', <SetTime setTimeString={handleTime}/>)
                                    showMiniDialog(true);
                                }
                            }}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Время:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.time}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.ml}
                                        onChange={(event)=>{handleVydano(event, 'd3', 'ml')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.chl}
                                        onChange={(event)=>{handleVydano(event, 'd3', 'chl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.kl}
                                        onChange={(event)=>{handleVydano(event, 'd3', 'kl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.sl}
                                        onChange={(event)=>{handleVydano(event, 'd3', 'sl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.s02}
                                        onChange={(event)=>{handleVydano(event, 'd3', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.s04}
                                        onChange={(event)=>{handleVydano(event, 'd3', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.b}
                                        onChange={(event)=>{handleVydano(event, 'd3', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Итого</Typography>

                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.sl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.s02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.s04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.b}
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>
                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Выручка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.sl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Съем</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', cursor: 'pointer', marginBottom: 10}} onClick={()=>{
                                if(!data.expiredDate) {
                                    timeType.current = (['vozvrat', 'v'])
                                    setMiniDialog('Вы уверены?', <SetTime setTimeString={handleTime}/>)
                                    showMiniDialog(true);
                                }
                            }}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Время:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.v.time}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', color: '#980019', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.ml}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 'ml')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', color: '#014C85', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.chl}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 'chl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', color: '#4A1915', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.kl}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 'kl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.sl}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 'sl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.s02}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.s04}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.b}
                                        onChange={(event)=>{handleVozvrat(event, 'v', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Списание по акту</Typography>

                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.ml}
                                        onChange={(event)=>{handleVozvrat(event, 's', 'ml')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.chl}
                                        onChange={(event)=>{handleVozvrat(event, 's', 'chl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.kl}
                                        onChange={(event)=>{handleVozvrat(event, 's', 'kl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.sl}
                                        onChange={(event)=>{handleVozvrat(event, 's', 'sl')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.s02}
                                        onChange={(event)=>{handleVozvrat(event, 's', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.s04}
                                        onChange={(event)=>{handleVozvrat(event, 's', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.b}
                                        onChange={(event)=>{handleVozvrat(event, 's', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>

                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Продано</Typography>

                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.sl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.sl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.s02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.s04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.p.b}
                                </center>
                            </ExpansionPanelDetails>

                            <br/>
                        </ExpansionPanel>

                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Выручка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.kl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.sl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.virychka.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.virychka.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.virychka.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стакан Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.virychka.sl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Итого</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>ИВ: <b style={{color: 'black'}}>{nakladnaya.i.iv}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.i.m}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.i.o}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Н: <b style={{color: 'black'}}>{nakladnaya.i.n}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>И: <b style={{color: 'black'}}>{nakladnaya.i.inc}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ФВ: <b style={{color: 'black'}}>{nakladnaya.i.fv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Итого выручка:
                                </div>
                                &nbsp;{nakladnaya.i.iv}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Место:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.i.m}
                                    onChange={(event)=>{handleItogo(event, 'm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Обед:
                                </div>
                                &nbsp;{nakladnaya.i.o}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Недосдача:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.i.n}
                                    onChange={(event)=>{handleItogo(event, 'n')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Инкасс (тачка, въезд):
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.i.inc}
                                    onChange={(event)=>{handleItogo(event, 'inc')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Фактическая выручка:
                                </div>
                                &nbsp;{nakladnaya.i.fv}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <br/>
                    <div className={classes.row}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkOrganizator}
                                    onChange={()=>{if(profile.role==='организатор'&&!checkAdmin)setCheckOrganizator(!checkOrganizator)}}
                                    color='primary'
                                />
                            }
                            label='Организатор принял'
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
                        !data.expiredDate&&(realizator&&point&&point.guid!=='lol'||object._id)?
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                <Button size='small' color='primary' onClick={()=>{
                                    const action = async() => {
                                        if(!object._id)
                                            await addOtchetRealizatora({
                                                dataTable: JSON.stringify(nakladnaya),
                                                region: region._id,
                                                point: point._id,
                                                organizator: data.organizator._id,
                                                realizator: realizator._id,
                                                guidRegion: region.guid,
                                                guidPoint: point.guid,
                                                guidOrganizator: data.organizator.guid,
                                                guidRealizator: realizator.guid
                                            })
                                        else
                                            await setOtchetRealizatora({
                                                _id: object._id,
                                                dataTable: JSON.stringify(nakladnaya),
                                                ...profile.role==='admin'&&checkAdmin!==data.object.checkAdmin?{checkAdmin}:{},
                                                ...profile.role==='организатор'&&checkOrganizator!==data.object.checkOrganizator?{checkOrganizator}:{},
                                                organizator: data.organizator._id,
                                                guidOrganizator: data.organizator.guid
                                            })
                                        if(profile.role!=='реализатор') {
                                            if(router.query.id==='new')
                                                await setPoint(undefined)
                                            Router.push('/otchetrealizatoras')
                                        }
                                        else
                                            window.location.reload()
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true);
                                }} className={classes.button}>
                                    Сохранить
                                </Button>
                                {
                                    object._id?
                                        <Button size='small' color='secondary' onClick={()=>{
                                            const action = async() => {
                                                await deleteOtchetRealizatora(object._id)
                                                if(profile.role!=='реализатор')
                                                    Router.push('/otchetrealizatoras')
                                                else
                                                    window.location.reload()
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

OtchetRealizatora.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin', 'реализатор'].includes(ctx.store.getState().user.profile.role)||'admin'===ctx.store.getState().user.profile.role&&ctx.query.id==='new')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else
            Router.push('/')
    let expiredDate = false, object, organizator, realizator
    if(ctx.query.id!=='new') {
        object = await getOtchetRealizatora({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        object.dataTable = JSON.parse(object.dataTable)
        organizator = object.organizator
        realizator = object.realizator
        expiredDate = ((new Date()-new Date(object.createdAt))/1000/60/60)>36&&'реализатор'===ctx.store.getState().user.profile.role || (object.checkAdmin&&['реализатор', 'организатор'].includes(ctx.store.getState().user.profile.role)) || (object.checkOrganizator&&'реализатор'===ctx.store.getState().user.profile.role)
    }
    else {
        if(ctx.store.getState().user.profile.role==='реализатор'||ctx.store.getState().app.point) {
            object = await getOtchetRealizatora(ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
            if(object)
                object.dataTable = JSON.parse(object.dataTable)
        }
        if(!object)
            object = {
                dataTable: {
                    'vydano': {
                        'r':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        'd1':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        'd2':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        'd3':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        'i':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                    },
                    'vozvrat': {
                        'v':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        's':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        'p':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                        'virychka':
                            {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':''},
                    },
                    'i': {
                        'iv':'',
                        'm':'',
                        'o': 100,
                        'n':'',
                        'inc':'',
                        'fv': -100,
                    },
                    'r':'',
                }
            }
        ctx.store.getState().app.region = {
            _id: ctx.store.getState().user.profile.region,
            guid: ctx.store.getState().user.profile.guidRegion,
            name: ctx.store.getState().user.profile.nameRegion
        }
        if(ctx.store.getState().user.profile.point)
            ctx.store.getState().app.point = {
                _id: ctx.store.getState().user.profile.point,
                guid: ctx.store.getState().user.profile.guidPoint,
                name: ctx.store.getState().user.profile.namePoint
            }
        organizator = await getOrganizator({_id: ctx.store.getState().app.region._id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        if (ctx.store.getState().app.point)
            realizator = await getRealizator({_id: ctx.store.getState().app.point._id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    }

    let _prices, prices = {}
    if (ctx.store.getState().app.point)
        _prices = await getSpecialPrice({_id: ctx.store.getState().app.point._id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    if(!_prices) {
        _prices = await getPrices({}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
        for (let i = 0; i < _prices.length; i++) {
            prices[_prices[i].name] = _prices[i].price
        }
    }
    else
        prices = JSON.parse(_prices.prices)


    return {
        data: {
            object,
            expiredDate,
            prices,
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtchetRealizatora);