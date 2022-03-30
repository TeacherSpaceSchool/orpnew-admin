import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getNakladnayaSklad2, setNakladnayaSklad2, addNakladnayaSklad2} from '../../src/gql/nakladnayaSklad2'
import nakladnayaSklad2Style from '../../src/styleMUI/list'
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

const NakladnayaSklad2 = React.memo((props) => {
    const classes = nakladnayaSklad2Style();
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
            if(where==='vozvrat'&&type !== 's'){
                nakladnaya[where][type]['sh02'] = checkInt(nakladnaya[where][type]['s02']) * 50
                nakladnaya[where][type]['sh04'] = checkInt(nakladnaya[where][type]['s04']) * 25
            }
            nakladnaya[where]['i'][what] = checkInt(nakladnaya[where]['r'][what]) + checkInt(nakladnaya[where]['d1'][what]) + checkInt(nakladnaya[where]['d2'][what]) + checkInt(nakladnaya[where]['d3'][what])
            nakladnaya[where]['i']['sh02'] = checkInt(nakladnaya[where]['r']['sh02']) + checkInt(nakladnaya[where]['d1']['sh02']) + checkInt(nakladnaya[where]['d2']['sh02']) + checkInt(nakladnaya[where]['d3']['sh02'])
            nakladnaya[where]['i']['sh04'] = checkInt(nakladnaya[where]['r']['sh04']) + checkInt(nakladnaya[where]['d1']['sh04']) + checkInt(nakladnaya[where]['d2']['sh04']) + checkInt(nakladnaya[where]['d3']['sh04'])
            nakladnaya['vozvrat']['iv']['sh02'] = checkInt(nakladnaya['vozvrat']['i']['sh02']) + checkInt(nakladnaya['vozvrat']['v']['sh02']) + checkInt(nakladnaya['vozvrat']['s']['sh02'])
            nakladnaya['vozvrat']['iv']['sh04'] = checkInt(nakladnaya['vozvrat']['i']['sh04']) + checkInt(nakladnaya['vozvrat']['v']['sh04']) + checkInt(nakladnaya['vozvrat']['s']['sh04'])
            nakladnaya['vozvrat']['iv']['l'] = checkInt(nakladnaya['vozvrat']['i']['l']) + checkInt(nakladnaya['vozvrat']['v']['l']) + checkInt(nakladnaya['vozvrat']['s']['l'])
            nakladnaya['vozvrat']['iv']['b'] = checkInt(nakladnaya['vozvrat']['i']['b']) + checkInt(nakladnaya['vozvrat']['v']['b']) + checkInt(nakladnaya['vozvrat']['s']['b'])
            setNakladnaya(nakladnaya)
        }
    };
    return (
        <App pageName='Накладная склад №2'>
            <Head>
                <title>Накладная склад №2</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Накладная склад №2' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/nakladnayasklad2/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/nakladnayasklad2/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object.createdAt?
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Дата:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYYY(data.object.createdAt)}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.i.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Растановка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.r.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.r.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.r.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.r.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.s02}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.s04}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.l}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.r.b}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.pm}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.r.pv}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>1-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.s02}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.s04}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.l}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d1.b}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.pm}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d1.pv}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>2-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.s02}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.s04}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.l}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d2.b}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.pm}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d2.pv}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>3-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.s02}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.s04}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.l}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.d3.b}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.pm}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vydano.d3.pv}
                                        onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Итого</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.i.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.s02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.s04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.l}
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
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.pm}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    &nbsp;{nakladnaya.vydano.i.pv}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Растановка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.s02}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.r.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.s04}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.r.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.l}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'l')}}
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
                                        value={nakladnaya.vozvrat.r.b}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.pm}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.r.pv}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>1-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.s02}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d1.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.s04}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d1.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.l}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'l')}}
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
                                        value={nakladnaya.vozvrat.d1.b}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.pm}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d1.pv}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>2-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.s02}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d2.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.s04}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d2.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.l}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'l')}}
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
                                        value={nakladnaya.vozvrat.d2.b}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.pm}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d2.pv}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>3-й долив</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.s02}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d3.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.s04}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.d3.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.l}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'l')}}
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
                                        value={nakladnaya.vozvrat.d3.b}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.pm}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.d3.pv}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Итого</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.s02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.s04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.l}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.b}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.pm}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.i.pv}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Возврат вечером</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.s02}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.v.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.s04}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.v.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.l}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'l')}}
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
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'b')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.pm}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.v.pv}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Съем</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СНП02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s0502}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>СНП04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s0504}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.b}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.pm}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.pv}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.s02}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's02')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска неполная 0.2:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.s0502}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's0502')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.s04}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's04')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Сосиска неполная 0.4:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.s0504}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's0504')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.l}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.s.b}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для мусора:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.pm}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 'pm')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Пакеты для выноса:
                                    </div>
                                    <TextField
                                        disabled={data.expiredDate}
                                        style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                        type="number"
                                        margin='normal'
                                        value={nakladnaya.vozvrat.s.pv}
                                        onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 'pv')}}
                                    />
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Итого возврат</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh02}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh04}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.l}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.b}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.2:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.iv.sh02}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Стаканы 0.4:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.iv.sh04}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Легенда:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.iv.l}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                <center style={{width: '100%'}}>
                                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Бутылки:
                                    </div>
                                    &nbsp;{nakladnaya.vozvrat.iv.b}
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
                                            addNakladnayaSklad2({
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        else
                                            setNakladnayaSklad2({
                                                _id: data.object._id,
                                                ...profile.role==='admin'&&checkAdmin!==data.object.checkAdmin?{checkAdmin}:{},
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        Router.push('/nakladnayasklad2s')
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

NakladnayaSklad2.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role)||'admin'===ctx.store.getState().user.profile.role&&ctx.query.id==='new')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getNakladnayaSklad2(ctx.query.id!=='new'?{_id: ctx.query.id}:{}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let expiredDate = false
    if(object) {
        object.dataTable = JSON.parse(object.dataTable)
        expiredDate = /*((new Date()-new Date(object.createdAt))/1000/60/60)>36 || */(object.checkAdmin&&'организатор'===ctx.store.getState().user.profile.role)
    }
    else {
        object = {
            dataTable: {
                'vydano': {
                    'r':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'd1':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'd2':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'd3':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'i':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                },
                'vozvrat': {
                    'r':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'd1':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'd2':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'd3':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'i':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'v':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    's':
                        {'s02':'', 's0502':'', 'sh02':'', 's04':'', 's0504':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                    'iv':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':''},
                }
            }
        }
        object.dataTable['vydano']['r']['sh02'] = 0
        object.dataTable['vydano']['r']['sh04'] = 0
        object.dataTable['vydano']['r']['l'] = 0
        object.dataTable['vydano']['r']['b'] = 0
        object.dataTable['vydano']['d1']['sh02'] = 0
        object.dataTable['vydano']['d1']['sh04'] = 0
        object.dataTable['vydano']['d1']['l'] = 0
        object.dataTable['vydano']['d1']['b'] = 0
        object.dataTable['vydano']['d2']['sh02'] = 0
        object.dataTable['vydano']['d2']['sh04'] = 0
        object.dataTable['vydano']['d2']['l'] = 0
        object.dataTable['vydano']['d2']['b'] = 0
        object.dataTable['vydano']['d3']['sh02'] = 0
        object.dataTable['vydano']['d3']['sh04'] = 0
        object.dataTable['vydano']['d3']['l'] = 0
        object.dataTable['vydano']['d3']['b'] = 0
        object.dataTable['vozvrat']['s']['sh02'] = 0
        object.dataTable['vozvrat']['s']['sh04'] = 0
        object.dataTable['vozvrat']['s']['l'] = 0
        object.dataTable['vozvrat']['s']['b'] = 0
        let otchetRealizatoras = await getOtchetRealizatoras({date: new Date()}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        for (let i = 0; i < otchetRealizatoras.length; i++) {
            let dataTable = JSON.parse(otchetRealizatoras[i].dataTable)
            if(checkInt(dataTable.vozvrat.v.s02)>0) 
                object.dataTable['vozvrat']['s']['sh02'] += checkInt(dataTable.vozvrat.v.s02)
            if(checkInt(dataTable.vozvrat.v.s04)>0) 
                object.dataTable['vozvrat']['s']['sh04'] += checkInt(dataTable.vozvrat.v.s04)
            if(checkInt(dataTable.vozvrat.v.sl)>0) 
                object.dataTable['vozvrat']['s']['l'] += checkInt(dataTable.vozvrat.v.sl)
            if(checkInt(dataTable.vozvrat.v.b)>0) 
                object.dataTable['vozvrat']['s']['b'] += checkInt(dataTable.vozvrat.v.b)
            if(checkInt(dataTable.vydano.r.s02)>0) 
                object.dataTable['vydano']['r']['sh02'] += checkInt(dataTable.vydano.r.s02)
            if(checkInt(dataTable.vydano.r.s04)>0) 
                object.dataTable['vydano']['r']['sh04'] += checkInt(dataTable.vydano.r.s04)
            if(checkInt(dataTable.vydano.r.sl)>0) 
                object.dataTable['vydano']['r']['l'] += checkInt(dataTable.vydano.r.sl)
            if(checkInt(dataTable.vydano.r.b)>0) 
                object.dataTable['vydano']['r']['b'] += checkInt(dataTable.vydano.r.b)
            if(checkInt(dataTable.vydano.d1.s02)>0) 
                object.dataTable['vydano']['d1']['sh02'] += checkInt(dataTable.vydano.d1.s02)
            if(checkInt(dataTable.vydano.d1.s04)>0) 
                object.dataTable['vydano']['d1']['sh04'] += checkInt(dataTable.vydano.d1.s04)
            if(checkInt(dataTable.vydano.d1.sl)>0) 
                object.dataTable['vydano']['d1']['l'] += checkInt(dataTable.vydano.d1.sl)
            if(checkInt(dataTable.vydano.d1.b)>0) 
                object.dataTable['vydano']['d1']['b'] += checkInt(dataTable.vydano.d1.b)
            if(checkInt(dataTable.vydano.d2.s02)>0) 
                object.dataTable['vydano']['d2']['sh02'] += checkInt(dataTable.vydano.d2.s02)
            if(checkInt(dataTable.vydano.d2.s04)>0) 
                object.dataTable['vydano']['d2']['sh04'] += checkInt(dataTable.vydano.d2.s04)
            if(checkInt(dataTable.vydano.d2.sl)>0) 
                object.dataTable['vydano']['d2']['l'] += checkInt(dataTable.vydano.d2.sl)
            if(checkInt(dataTable.vydano.d2.b)>0) 
                object.dataTable['vydano']['d2']['b'] += checkInt(dataTable.vydano.d2.b)
            if(checkInt(dataTable.vydano.d3.s02)>0) 
                object.dataTable['vydano']['d3']['sh02'] += checkInt(dataTable.vydano.d3.s02)
            if(checkInt(dataTable.vydano.d3.s04)>0) 
                object.dataTable['vydano']['d3']['sh04'] += checkInt(dataTable.vydano.d3.s04)
            if(checkInt(dataTable.vydano.d3.sl)>0) 
                object.dataTable['vydano']['d3']['l'] += checkInt(dataTable.vydano.d3.sl)
            if(checkInt(dataTable.vydano.d3.b)>0) 
                object.dataTable['vydano']['d3']['b'] += checkInt(dataTable.vydano.d3.b)
        }
        object.dataTable['vydano']['i']['sh02'] = checkInt(object.dataTable['vydano']['r']['sh02']) + checkInt(object.dataTable['vydano']['d1']['sh02']) + checkInt(object.dataTable['vydano']['d2']['sh02']) + checkInt(object.dataTable['vydano']['d3']['sh02'])
        object.dataTable['vydano']['i']['sh04'] = checkInt(object.dataTable['vydano']['r']['sh04']) + checkInt(object.dataTable['vydano']['d1']['sh04']) + checkInt(object.dataTable['vydano']['d2']['sh04']) + checkInt(object.dataTable['vydano']['d3']['sh04'])
        object.dataTable['vydano']['i']['l'] = checkInt(object.dataTable['vydano']['r']['l']) + checkInt(object.dataTable['vydano']['d1']['l']) + checkInt(object.dataTable['vydano']['d2']['l']) + checkInt(object.dataTable['vydano']['d3']['l'])
        object.dataTable['vydano']['i']['b'] = checkInt(object.dataTable['vydano']['r']['b']) + checkInt(object.dataTable['vydano']['d1']['b']) + checkInt(object.dataTable['vydano']['d2']['b']) + checkInt(object.dataTable['vydano']['d3']['b'])
        object.dataTable['vozvrat']['iv']['sh02'] = checkInt(object.dataTable['vozvrat']['i']['sh02']) + checkInt(object.dataTable['vozvrat']['v']['sh02']) + checkInt(object.dataTable['vozvrat']['s']['sh02'])
        object.dataTable['vozvrat']['iv']['sh04'] = checkInt(object.dataTable['vozvrat']['i']['sh04']) + checkInt(object.dataTable['vozvrat']['v']['sh04']) + checkInt(object.dataTable['vozvrat']['s']['sh04'])
        object.dataTable['vozvrat']['iv']['l'] = checkInt(object.dataTable['vozvrat']['i']['l']) + checkInt(object.dataTable['vozvrat']['v']['l']) + checkInt(object.dataTable['vozvrat']['s']['l'])
        object.dataTable['vozvrat']['iv']['b'] = checkInt(object.dataTable['vozvrat']['i']['b']) + checkInt(object.dataTable['vozvrat']['v']['b']) + checkInt(object.dataTable['vozvrat']['s']['b'])
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

export default connect(mapStateToProps, mapDispatchToProps)(NakladnayaSklad2);