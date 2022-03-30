import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getNakladnayaSklad1, setNakladnayaSklad1, addNakladnayaSklad1} from '../../src/gql/nakladnayaSklad1'
import nakladnayaSklad1Style from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import TextField from '@material-ui/core/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import {checkInt, pdDDMMYYYY} from '../../src/lib';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getOtchetRealizatoras} from '../../src/gql/otchetRealizatora'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const NakladnayaSklad1 = React.memo((props) => {
    const classes = nakladnayaSklad1Style();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const router = useRouter()
    let [nakladnaya, setNakladnaya] = useState(data.object.dataTable);
    let [checkAdmin, setCheckAdmin] = useState(data.object.checkAdmin);
    let handleLitr =  (event, where, type, what) => {
        if(!data.expiredDate) {
            nakladnaya= {...nakladnaya}
            let litr = parseInt(event.target.value)
            if (isNaN(litr)) {
                nakladnaya[where][type][what] = ''
            } else {
                if(litr<0)
                    litr *= -1
                nakladnaya[where][type][what] = litr
            }
            if(type !== 's'&&where==='vozvrat'){
                nakladnaya[where][type]['ml'] = checkInt(nakladnaya[where][type]['m25']) * 24
                nakladnaya[where][type]['chl'] = checkInt(nakladnaya[where][type]['ch25']) * 24 + checkInt(nakladnaya[where][type]['ch10']) * 10
                nakladnaya[where][type]['kl'] = checkInt(nakladnaya[where][type]['k25']) * 24 + checkInt(nakladnaya[where][type]['k10']) * 10
            }

            let s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s'][what]):0
            nakladnaya[where]['i'][what] = checkInt(where==='vozvrat'?0:nakladnaya[where]['n'][what]) + checkInt(nakladnaya[where]['r'][what]) + checkInt(nakladnaya[where]['d1'][what]) + checkInt(nakladnaya[where]['d2'][what]) + checkInt(nakladnaya[where]['d3'][what]) + s

            s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s']['ml']):0
            nakladnaya[where]['i']['ml'] = checkInt(where==='vozvrat'?0:nakladnaya[where]['n']['ml']) + checkInt(nakladnaya[where]['r']['ml']) + checkInt(nakladnaya[where]['d1']['ml']) + checkInt(nakladnaya[where]['d2']['ml']) + checkInt(nakladnaya[where]['d3']['ml']) + s

            s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s']['chl']):0
            nakladnaya[where]['i']['chl'] = checkInt(where==='vozvrat'?0:nakladnaya[where]['n']['chl']) + checkInt(nakladnaya[where]['r']['chl']) + checkInt(nakladnaya[where]['d1']['chl']) + checkInt(nakladnaya[where]['d2']['chl']) + checkInt(nakladnaya[where]['d3']['chl']) + s

            s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s']['kl']):0
            nakladnaya[where]['i']['kl'] = checkInt(where==='vozvrat'?0:nakladnaya[where]['n']['kl']) + checkInt(nakladnaya[where]['r']['kl']) + checkInt(nakladnaya[where]['d1']['kl']) + checkInt(nakladnaya[where]['d2']['kl']) + checkInt(nakladnaya[where]['d3']['kl']) + s

            setNakladnaya(nakladnaya)
        }
    };
    return (
        <App pageName='Накладная склад №1'>
            <Head>
                <title>Накладная склад №1</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Накладная склад №1' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/nakladnayasklad1/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/nakladnayasklad1/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object.date?
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Дата:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYYY(data.object.date)}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Регион:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object.region.name}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Организатор:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object.organizator.name}
                                </div>
                            </div>
                            </>
                            :
                            null
                    }
                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Выдано</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Неполный</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.n.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.n.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.n.chl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.n.ch25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.n.ch10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.n.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Растановка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.r.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.r.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.m25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.k10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>1-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.m25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.k10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>2-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.m25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.k10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>3-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.m25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.k10}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Итого</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.m25}
                                </center>
                            </ExpansionPanelDetails>
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
                                        Чалап 25:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.ch25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.ch10}
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
                                        Квас 10:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.k10}
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
                            <br/>
                        </ExpansionPanel>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Возврат</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Неполный на следующий день</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.n.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.n.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.n.chl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.n.ch25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.n.ch10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.n.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Растановка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.m25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.r.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.r.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.k10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.r.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>1-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.m25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d1.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d1.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.k10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d1.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>2-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.m25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d2.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d2.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.k10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d2.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>3-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.m25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'm25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d3.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.ch25}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'ch25')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.ch10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'ch10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d3.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.k10}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'k10')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d3.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Съем</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.m25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.ch25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.ch10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.k10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Итого</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ml}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.chl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.k10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.kl}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.m25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.ml}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.ch25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.ch10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.chl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.k10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас литр:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.kl}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <br/>
                    </ExpansionPanel>

                    <br/>
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
                    {
                        !data.expiredDate?
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                <Button size='small' color='primary' onClick={()=>{
                                    const action = async() => {
                                        if(!data.object._id)
                                            addNakladnayaSklad1({
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        else
                                            setNakladnayaSklad1({
                                                _id: data.object._id,
                                                ...profile.role==='admin'&&checkAdmin!==data.object.checkAdmin?{checkAdmin}:{},
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        Router.push('/nakladnayasklad1s')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true);
                                }} className={classes.button}>
                                    Сохранить
                                </Button>
                            </div>
                            :
                            null
                    }
                </CardContent>
            </Card>
        </App>
    )
})

NakladnayaSklad1.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role)||'admin'===ctx.store.getState().user.profile.role&&ctx.query.id==='new')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getNakladnayaSklad1(ctx.query.id!=='new'?{_id: ctx.query.id}:{}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let expiredDate = false
    if(object) {
        object.dataTable = JSON.parse(object.dataTable)
        expiredDate = /*((new Date()-new Date(object.createdAt))/1000/60/60)>36 || */(object.checkAdmin&&'организатор'===ctx.store.getState().user.profile.role)
    }
    else {
        object = {
            dataTable: {
                'vydano': {
                    'n':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'r':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'd1':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'd2':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'd3':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'i':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                },
                'vozvrat': {
                    'n':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'r':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'd1':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'd2':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'd3':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    's':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                    'i':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':''},
                },
            }
        }


        let date = new Date()
        object.dataTable['vydano']['r']['ml'] = 0
        object.dataTable['vydano']['r']['chl'] = 0
        object.dataTable['vydano']['r']['kl'] = 0
        object.dataTable['vydano']['d1']['ml'] = 0
        object.dataTable['vydano']['d1']['chl'] = 0
        object.dataTable['vydano']['d1']['kl'] = 0
        object.dataTable['vydano']['d2']['ml'] = 0
        object.dataTable['vydano']['d2']['chl'] = 0
        object.dataTable['vydano']['d2']['kl'] = 0
        object.dataTable['vydano']['d3']['ml'] = 0
        object.dataTable['vydano']['d3']['chl'] = 0
        object.dataTable['vydano']['d3']['kl'] = 0
        object.dataTable['vozvrat']['n']['ch25'] = 0
        object.dataTable['vozvrat']['n']['ch10'] = 0
        object.dataTable['vozvrat']['n']['chl'] = 0
        object.dataTable['vozvrat']['s']['ml'] = 0
        object.dataTable['vozvrat']['s']['chl'] = 0
        object.dataTable['vozvrat']['s']['kl'] = 0
        object.dataTable['vozvrat']['s']['m25'] = 0
        object.dataTable['vozvrat']['s']['ch25'] = 0
        object.dataTable['vozvrat']['s']['ch10'] = 0
        object.dataTable['vozvrat']['s']['k10'] = 0
        let otchetRealizatoras = await getOtchetRealizatoras({date}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        for (let i = 0; i < otchetRealizatoras.length; i++) {
            let dataTable = JSON.parse(otchetRealizatoras[i].dataTable)
            if(checkInt(dataTable.vozvrat.v.chl)>0){
                object.dataTable['vozvrat']['s']['chl'] += checkInt(dataTable.vozvrat.v.chl)
                object.dataTable['vozvrat']['n']['chl'] += checkInt(dataTable.vozvrat.v.chl)
                object.dataTable['vozvrat']['n']['ch25'] += 1
                object.dataTable['vozvrat']['s']['ch25'] += 1
            }
            if(checkInt(dataTable.vozvrat.v.ml)>0) {
                object.dataTable['vozvrat']['s']['ml'] += checkInt(dataTable.vozvrat.v.ml)
                object.dataTable['vozvrat']['s']['m25'] += 1
            }
            if(checkInt(dataTable.vozvrat.v.kl)>0) {
                object.dataTable['vozvrat']['s']['kl'] += checkInt(dataTable.vozvrat.v.kl)
                object.dataTable['vozvrat']['s']['k10'] += 1
            }

            if(checkInt(dataTable.vydano.r.ml)>0) {
                object.dataTable['vydano']['r']['ml'] += checkInt(dataTable.vydano.r.ml)
            }
            if(checkInt(dataTable.vydano.r.chl)>0) {
                object.dataTable['vydano']['r']['chl'] += checkInt(dataTable.vydano.r.chl)
            }
            if(checkInt(dataTable.vydano.r.kl)>0) {
                object.dataTable['vydano']['r']['kl'] += checkInt(dataTable.vydano.r.kl)
            }

            if(checkInt(dataTable.vydano.d1.ml)>0) {
                object.dataTable['vydano']['d1']['ml'] += checkInt(dataTable.vydano.d1.ml)
            }
            if(checkInt(dataTable.vydano.d1.chl)>0) {
                object.dataTable['vydano']['d1']['chl'] += checkInt(dataTable.vydano.d1.chl)
            }
            if(checkInt(dataTable.vydano.d1.kl)>0) {
                object.dataTable['vydano']['d1']['kl'] += checkInt(dataTable.vydano.d1.kl)
            }

            if(checkInt(dataTable.vydano.d2.ml)>0) {
                object.dataTable['vydano']['d2']['ml'] += checkInt(dataTable.vydano.d2.ml)
            }
            if(checkInt(dataTable.vydano.d2.chl)>0) {
                object.dataTable['vydano']['d2']['chl'] += checkInt(dataTable.vydano.d2.chl)
            }
            if(checkInt(dataTable.vydano.d2.kl)>0) {
                object.dataTable['vydano']['d2']['kl'] += checkInt(dataTable.vydano.d2.kl)
            }

            if(checkInt(dataTable.vydano.d3.ml)>0) {
                object.dataTable['vydano']['d3']['ml'] += checkInt(dataTable.vydano.d3.ml)
            }
            if(checkInt(dataTable.vydano.d3.chl)>0) {
                object.dataTable['vydano']['d3']['chl'] += checkInt(dataTable.vydano.d3.chl)
            }
            if(checkInt(dataTable.vydano.d3.kl)>0) {
                object.dataTable['vydano']['d3']['kl'] += checkInt(dataTable.vydano.d3.kl)
            }
        }

        object.dataTable['vydano']['i']['ml'] = checkInt(object.dataTable['vydano']['n']['ml']) + checkInt(object.dataTable['vydano']['r']['ml']) + checkInt(object.dataTable['vydano']['d1']['ml']) + checkInt(object.dataTable['vydano']['d2']['ml']) + checkInt(object.dataTable['vydano']['d3']['ml'])
        object.dataTable['vydano']['i']['kl'] = checkInt(object.dataTable['vydano']['n']['kl']) + checkInt(object.dataTable['vydano']['r']['kl']) + checkInt(object.dataTable['vydano']['d1']['kl']) + checkInt(object.dataTable['vydano']['d2']['kl']) + checkInt(object.dataTable['vydano']['d3']['kl'])
        object.dataTable['vydano']['i']['chl'] = checkInt(object.dataTable['vydano']['n']['chl']) + checkInt(object.dataTable['vydano']['r']['chl']) + checkInt(object.dataTable['vydano']['d1']['chl']) + checkInt(object.dataTable['vydano']['d2']['chl']) + checkInt(object.dataTable['vydano']['d3']['chl'])

        object.dataTable['vozvrat']['i']['ml'] = checkInt(object.dataTable['vozvrat']['s']['ml']) + checkInt(object.dataTable['vozvrat']['r']['ml']) + checkInt(object.dataTable['vozvrat']['d1']['ml']) + checkInt(object.dataTable['vozvrat']['d2']['ml']) + checkInt(object.dataTable['vozvrat']['d3']['ml'])
        object.dataTable['vozvrat']['i']['m25'] = checkInt(object.dataTable['vozvrat']['s']['m25']) + checkInt(object.dataTable['vozvrat']['r']['m25']) + checkInt(object.dataTable['vozvrat']['d1']['m25']) + checkInt(object.dataTable['vozvrat']['d2']['m25']) + checkInt(object.dataTable['vozvrat']['d3']['m25'])
        object.dataTable['vozvrat']['i']['m25'] = checkInt(object.dataTable['vozvrat']['r']['m25']) + checkInt(object.dataTable['vozvrat']['d1']['m25']) + checkInt(object.dataTable['vozvrat']['d2']['m25']) + checkInt(object.dataTable['vozvrat']['d3']['m25']) + checkInt(object.dataTable['vozvrat']['s']['m25'])

        object.dataTable['vozvrat']['i']['kl'] = checkInt(object.dataTable['vozvrat']['s']['kl']) + checkInt(object.dataTable['vozvrat']['r']['kl']) + checkInt(object.dataTable['vozvrat']['d1']['kl']) + checkInt(object.dataTable['vozvrat']['d2']['kl']) + checkInt(object.dataTable['vozvrat']['d3']['kl'])
        object.dataTable['vozvrat']['i']['k10'] = checkInt(object.dataTable['vozvrat']['s']['k10']) + checkInt(object.dataTable['vozvrat']['r']['k10']) + checkInt(object.dataTable['vozvrat']['d1']['k10']) + checkInt(object.dataTable['vozvrat']['d2']['k10']) + checkInt(object.dataTable['vozvrat']['d3']['k10'])
        object.dataTable['vozvrat']['i']['k10'] = checkInt(object.dataTable['vozvrat']['r']['k10']) + checkInt(object.dataTable['vozvrat']['d1']['k10']) + checkInt(object.dataTable['vozvrat']['d2']['k10']) + checkInt(object.dataTable['vozvrat']['d3']['k10']) + checkInt(object.dataTable['vozvrat']['s']['k10'])

        object.dataTable['vozvrat']['i']['chl'] = checkInt(object.dataTable['vozvrat']['s']['chl']) + checkInt(object.dataTable['vozvrat']['r']['chl']) + checkInt(object.dataTable['vozvrat']['d1']['chl']) + checkInt(object.dataTable['vozvrat']['d2']['chl']) + checkInt(object.dataTable['vozvrat']['d3']['chl'])
        object.dataTable['vozvrat']['i']['ch10'] = checkInt(object.dataTable['vozvrat']['s']['ch10']) + checkInt(object.dataTable['vozvrat']['r']['ch10']) + checkInt(object.dataTable['vozvrat']['d1']['ch10']) + checkInt(object.dataTable['vozvrat']['d2']['ch10']) + checkInt(object.dataTable['vozvrat']['d3']['ch10'])
        object.dataTable['vozvrat']['i']['ch25'] = checkInt(object.dataTable['vozvrat']['s']['ch25']) + checkInt(object.dataTable['vozvrat']['r']['ch25']) + checkInt(object.dataTable['vozvrat']['d1']['ch25']) + checkInt(object.dataTable['vozvrat']['d2']['ch25']) + checkInt(object.dataTable['vozvrat']['d3']['ch25'])

        date.setDate(date.getDate()-1)
        object.dataTable['vydano']['n']['ch25'] = 0
        object.dataTable['vydano']['n']['ch10'] = 0
        object.dataTable['vydano']['n']['chl'] = 0
        otchetRealizatoras = await getOtchetRealizatoras({date}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        for (let i = 0; i < otchetRealizatoras.length; i++) {
            let dataTable = JSON.parse(otchetRealizatoras[i].dataTable)
            if(checkInt(dataTable.vozvrat.v.chl)>0){
                object.dataTable['vydano']['n']['chl'] += checkInt(dataTable.vozvrat.v.chl)
                object.dataTable['vydano']['n']['ch25'] += 1
                    
            }
        }
        object.dataTable['vydano']['i']['chl'] = checkInt(object.dataTable['vydano']['n']['chl']) + checkInt(object.dataTable['vydano']['r']['chl']) + checkInt(object.dataTable['vydano']['d1']['chl']) + checkInt(object.dataTable['vydano']['d2']['chl']) + checkInt(object.dataTable['vydano']['d3']['chl'])
        object.dataTable['vydano']['i']['ch10'] = checkInt(object.dataTable['vydano']['n']['ch10']) + checkInt(object.dataTable['vydano']['r']['ch10']) + checkInt(object.dataTable['vydano']['d1']['ch10']) + checkInt(object.dataTable['vydano']['d2']['ch10']) + checkInt(object.dataTable['vydano']['d3']['ch10'])
        object.dataTable['vydano']['i']['ch25'] = checkInt(object.dataTable['vydano']['n']['ch25']) + checkInt(object.dataTable['vydano']['r']['ch25']) + checkInt(object.dataTable['vydano']['d1']['ch25']) + checkInt(object.dataTable['vydano']['d2']['ch25']) + checkInt(object.dataTable['vydano']['d3']['ch25'])
    }
    
    
    return {
        data: {
            object,
            expiredDate
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NakladnayaSklad1);