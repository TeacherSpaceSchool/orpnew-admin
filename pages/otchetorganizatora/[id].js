import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getOtchetOrganizatora, setOtchetOrganizatora, addOtchetOrganizatora} from '../../src/gql/otchetOrganizatora'
import otchetOrganizatoraStyle from '../../src/styleMUI/list'
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

const OtchetOrganizatora = React.memo((props) => {
    const classes = otchetOrganizatoraStyle();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const router = useRouter()
    let [checkAdmin, setCheckAdmin] = useState(data.object.checkAdmin);
    let [nakladnaya, setNakladnaya] = useState(data.object.dataTable);
    let handleRashod =  (event, what) => {
        if(!data.expiredDate) {
            nakladnaya= {...nakladnaya}
            let litr = parseInt(event.target.value)
            if (isNaN(litr)) {
                nakladnaya['r'][what] = ''
            } else {
                if(litr<0)
                    litr *= -1
                nakladnaya['r'][what] = litr
            }
            nakladnaya['i'] = nakladnaya['p']['i'] - nakladnaya['r']['otr'] - nakladnaya['r']['oo'] - nakladnaya['r']['ntp'] - nakladnaya['r']['att'] - checkInt(nakladnaya['r']['at']) - checkInt(nakladnaya['r']['vs'])
            setNakladnaya(nakladnaya)
        }
    };
    let handleAuto =  (event, what) => {
        if(!data.expiredDate) {
            nakladnaya= {...nakladnaya}
            nakladnaya['a'][what] = event.target.value
            setNakladnaya(nakladnaya)
        }
    };
    return (
        <App pageName='Отчет организатора'>
            <Head>
                <title>Отчет организатора</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Отчет организатора' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/otchetorganizatora/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/otchetorganizatora/${router.query.id}`}/>
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
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Выручка:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {nakladnaya.i}
                                </div>
                            </div>
                            </>
                            :
                            null
                    }

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Продано</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.p.m.ps}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.p.ch.ps}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.p.k.ps}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.p.sl.ps}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>И: <b style={{color: 'black'}}>{nakladnaya.p.i}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Максым</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.m.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.m.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.m.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.m.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.m.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.m.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.m.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано литров:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.m.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Чалап</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.ch.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.ch.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.ch.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.ch.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.ch.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.ch.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.ch.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано литров:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.ch.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Квас</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.k.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.k.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.k.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.k.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.k.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.k.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.k.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано литров:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.k.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Стакан Легенда</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.sl.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.sl.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.sl.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.sl.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.sl.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.sl.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.sl.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано штук:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.sl.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Стакан 0,2</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.s02.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.s02.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.s02.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s02.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.s02.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.s02.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s02.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано штук:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.s02.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Стакан 0.4</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.s04.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.s04.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.s04.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s04.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.s04.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.s04.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s04.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано штук:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.s04.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <ExpansionPanel style={{width: '100%'}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>Бутылка</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.b.v}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.b.o}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.b.s}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.b.pl}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.b.ktt}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.b.kd}</b>&nbsp;&nbsp;</div>
                                        <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.b.ps}</b>&nbsp;&nbsp;</div>
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Выдано:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.v}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Остаток съем:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.o}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Списание по акту:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.s}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано штук:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.pl}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество Т.Т.:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.ktt}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Количество доливов:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.kd}
                                    </center>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Продано сом:
                                        </div>
                                        &nbsp;{nakladnaya.p.b.ps}
                                    </center>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Расходы</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>Отп: <b style={{color: 'black'}}>{nakladnaya.r.otr}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Оо: <b style={{color: 'black'}}>{nakladnaya.r.oo}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Нтп: <b style={{color: 'black'}}>{nakladnaya.r.ntp}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Атт: <b style={{color: 'black'}}>{nakladnaya.r.att}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ат: <b style={{color: 'black'}}>{nakladnaya.r.at}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.r.vs}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Обед торгового представителя:
                                </div>
                                &nbsp;{nakladnaya.r.otr}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Обед организатора:
                                </div>
                                &nbsp;{nakladnaya.r.oo}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Недосдача торгового представителя:
                                </div>
                                &nbsp;{nakladnaya.r.ntp}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Инкассация:
                                </div>
                                &nbsp;{nakladnaya.r.inc}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Аренда торговой точки:
                                </div>
                                &nbsp;{nakladnaya.r.att}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Аренда тачки:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.r.at}
                                    onChange={(event)=>{handleRashod(event, 'at')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Въезд на рынок, стоянка:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.r.vs}
                                    onChange={(event)=>{handleRashod(event, 'vs')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Авто</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>№: <b style={{color: 'black'}}>{nakladnaya.a.n}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Р: <b style={{color: 'black'}}>{nakladnaya.a.r}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Д1: <b style={{color: 'black'}}>{nakladnaya.a.d1}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Д2: <b style={{color: 'black'}}>{nakladnaya.a.d2}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Д3: <b style={{color: 'black'}}>{nakladnaya.a.d3}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.a.s}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Лкм: <b style={{color: 'black'}}>{nakladnaya.a.lkm}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Авто:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="login"
                                    margin='normal'
                                    value={nakladnaya.a.n}
                                    onChange={(event)=>{handleAuto(event, 'n')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Растановка:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="login"
                                    margin='normal'
                                    value={nakladnaya.a.r}
                                    onChange={(event)=>{handleAuto(event, 'r')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    1-й долив:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="login"
                                    margin='normal'
                                    value={nakladnaya.a.d1}
                                    onChange={(event)=>{handleAuto(event, 'd1')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    2-й долив:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="login"
                                    margin='normal'
                                    value={nakladnaya.a.d2}
                                    onChange={(event)=>{handleAuto(event, 'd2')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    3-й долив:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="login"
                                    margin='normal'
                                    value={nakladnaya.a.d3}
                                    onChange={(event)=>{handleAuto(event, 'd3')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Съем:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="login"
                                    margin='normal'
                                    value={nakladnaya.a.s}
                                    onChange={(event)=>{handleAuto(event, 's')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Лишние км:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.a.lkm}
                                    onChange={(event)=>{handleAuto(event, 'lkm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Время</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>Р: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.r:''}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Д1: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.d1:''}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Д2: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.d2:''}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Д3: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.d3:''}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.s:''}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Растановка:
                                </div>
                                &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.r:''}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    1-й долив:
                                </div>
                                &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.d1:''}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    2-й долив:
                                </div>
                                &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.d2:''}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    3-й долив:
                                </div>
                                &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.d3:''}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px', marginBottom: 10}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Съем:
                                </div>
                                &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.s:''}
                            </center>
                        </ExpansionPanelDetails>
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
                                            addOtchetOrganizatora({
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        else
                                            setOtchetOrganizatora({
                                                _id: data.object._id,
                                                ...profile.role==='admin'&&checkAdmin!==data.object.checkAdmin?{checkAdmin}:{},
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        Router.push('/otchetorganizatoras')
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

OtchetOrganizatora.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role)||'admin'===ctx.store.getState().user.profile.role&&ctx.query.id==='new')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getOtchetOrganizatora(ctx.query.id!=='new'?{_id: ctx.query.id}:{}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let expiredDate = false
    if(object) {
        object.dataTable = JSON.parse(object.dataTable)
        expiredDate = /*((new Date()-new Date(object.createdAt))/1000/60/60)>36 || */(object.checkAdmin&&'организатор'===ctx.store.getState().user.profile.role)
    }
    else {
        object = {
            dataTable: {
                'p': {
                    'i': 0,
                    'm': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'ch': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'k': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'sl': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    's02': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    's04': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'b': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                },
                'r': {
                    'otr': 0,
                    'oo': 200,
                    'ntp': 0,
                    'att': 0,
                    'at': '',
                    'vs': '',
                    'inc': 0
                },
                'a': {
                    'n': '',
                    'r': '',
                    'd1': '',
                    'd2': '',
                    'd3': '',
                    's': '',
                    'lkm': '',
                },
                'i': -200
            }
        }
        let otchetRealizatoras = await getOtchetRealizatoras({date: new Date()}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        let dolivkiM = [], dolivkiCh = [], dolivkiK = [], dolivkiSl = [], dolivkiS02 = [], dolivkiS04 = [], dolivkiB = []
        object.dataTable['time'] = {
            'r': '',
            'd1': '',
            'd2': '',
            'd3': '',
            's': '',
        }
        for (let i = 0; i < otchetRealizatoras.length; i++) {
            let dataTable = JSON.parse(otchetRealizatoras[i].dataTable)

            if(object.dataTable['time']['r'].length===0&&dataTable.vydano.r.time.length>0){
                object.dataTable['time']['r'] = dataTable.vydano.r.time
            }
            if(object.dataTable['time']['d1'].length===0&&dataTable.vydano.d1.time.length>0){
                object.dataTable['time']['d1'] = dataTable.vydano.d1.time
            }
            if(object.dataTable['time']['d2'].length===0&&dataTable.vydano.d2.time.length>0){
                object.dataTable['time']['d2'] = dataTable.vydano.d2.time
            }
            if(object.dataTable['time']['d3'].length===0&&dataTable.vydano.d3.time.length>0){
                object.dataTable['time']['d3'] = dataTable.vydano.d3.time
            }
            if(object.dataTable['time']['s'].length===0&&dataTable.vozvrat.v.time.length>0){
                object.dataTable['time']['s'] = dataTable.vozvrat.v.time
            }

            if(dataTable.vydano.d3.ml.length>0){
                dolivkiM[i]=3
            }
            else if(dataTable.vydano.d2.ml.length>0){
                dolivkiM[i]=2
            }
            else if(dataTable.vydano.d1.ml.length>0){
                dolivkiM[i]=1
            }
            else {
                dolivkiM[i]=0
            }

            if(dataTable.vydano.d3.kl.length>0){
                dolivkiK[i]=3
            }
            else if(dataTable.vydano.d2.kl.length>0){
                dolivkiK[i]=2
            }
            else if(dataTable.vydano.d1.kl.length>0){
                dolivkiK[i]=1
            }
            else {
                dolivkiK[i]=0
            }

            if(dataTable.vydano.d3.chl.length>0){
                dolivkiCh[i]=3
            }
            else if(dataTable.vydano.d2.chl.length>0){
                dolivkiCh[i]=2
            }
            else if(dataTable.vydano.d1.chl.length>0){
                dolivkiCh[i]=1
            }
            else {
                dolivkiCh[i]=0
            }

            if(dataTable.vydano.d3.sl.length>0){
                dolivkiSl[i]=3
            }
            else if(dataTable.vydano.d2.sl.length>0){
                dolivkiSl[i]=2
            }
            else if(dataTable.vydano.d1.sl.length>0){
                dolivkiSl[i]=1
            }
            else {
                dolivkiSl[i]=0
            }

            if(dataTable.vydano.d3.s02.length>0){
                dolivkiS02[i]=3
            }
            else if(dataTable.vydano.d2.s02.length>0){
                dolivkiS02[i]=2
            }
            else if(dataTable.vydano.d1.s02.length>0){
                dolivkiS02[i]=1
            }
            else {
                dolivkiS02[i]=0
            }

            if(dataTable.vydano.d3.s04.length>0){
                dolivkiS04[i]=3
            }
            else if(dataTable.vydano.d2.s04.length>0){
                dolivkiS04[i]=2
            }
            else if(dataTable.vydano.d1.s04.length>0){
                dolivkiS04[i]=1
            }
            else {
                dolivkiS04[i]=0
            }

            if(dataTable.vydano.d3.b!==0){
                dolivkiB[i]=3
            }
            if(dataTable.vydano.d1.b){
                dolivkiB[i]=1
            }
            if(dataTable.vydano.d2.b!==0){
                dolivkiB[i]=2
            }

            object.dataTable.p.m.v += checkInt(dataTable.vydano.i.ml)
            object.dataTable.p.ch.v += checkInt(dataTable.vydano.i.chl)
            object.dataTable.p.k.v += checkInt(dataTable.vydano.i.kl)
            object.dataTable.p.sl.v += checkInt(dataTable.vydano.i.sl)
            object.dataTable.p.s02.v += checkInt(dataTable.vydano.i.s02)
            object.dataTable.p.s04.v += checkInt(dataTable.vydano.i.s04)
            object.dataTable.p.b.v += checkInt(dataTable.vydano.i.b)

            object.dataTable.p.m.o += checkInt(dataTable.vozvrat.v.ml)
            object.dataTable.p.ch.o += checkInt(dataTable.vozvrat.v.chl)
            object.dataTable.p.k.o += checkInt(dataTable.vozvrat.v.kl)
            object.dataTable.p.sl.o += checkInt(dataTable.vozvrat.v.sl)
            object.dataTable.p.s02.o += checkInt(dataTable.vozvrat.v.s02)
            object.dataTable.p.s04.o += checkInt(dataTable.vozvrat.v.s04)
            object.dataTable.p.b.o += checkInt(dataTable.vozvrat.v.b)

            object.dataTable.p.m.s += checkInt(dataTable.vozvrat.s.ml)
            object.dataTable.p.ch.s += checkInt(dataTable.vozvrat.s.chl)
            object.dataTable.p.k.s += checkInt(dataTable.vozvrat.s.kl)
            object.dataTable.p.sl.s += checkInt(dataTable.vozvrat.s.sl)
            object.dataTable.p.s02.s += checkInt(dataTable.vozvrat.s.s02)
            object.dataTable.p.s04.s += checkInt(dataTable.vozvrat.s.s04)
            object.dataTable.p.b.s += checkInt(dataTable.vozvrat.s.b)

            object.dataTable.p.m.pl += checkInt(dataTable.vozvrat.p.ml)
            object.dataTable.p.ch.pl += checkInt(dataTable.vozvrat.p.chl)
            object.dataTable.p.k.pl += checkInt(dataTable.vozvrat.p.kl)
            object.dataTable.p.sl.pl += checkInt(dataTable.vozvrat.p.sl)
            object.dataTable.p.s02.pl += checkInt(dataTable.vozvrat.p.s02)
            object.dataTable.p.s04.pl += checkInt(dataTable.vozvrat.p.s04)
            object.dataTable.p.b.pl += checkInt(dataTable.vozvrat.p.b)

            object.dataTable.p.m.ps += checkInt(dataTable.vozvrat.virychka.ml)
            object.dataTable.p.ch.ps += checkInt(dataTable.vozvrat.virychka.chl)
            object.dataTable.p.k.ps += checkInt(dataTable.vozvrat.virychka.kl)
            object.dataTable.p.sl.ps += checkInt(dataTable.vozvrat.virychka.sl)
            object.dataTable.p.s02.ps += checkInt(dataTable.vozvrat.virychka.s02)
            object.dataTable.p.s04.ps += checkInt(dataTable.vozvrat.virychka.s04)
            object.dataTable.p.b.ps += checkInt(dataTable.vozvrat.virychka.b)

            object.dataTable.r.ntp += checkInt(dataTable.vozvrat.virychka.sl)
            object.dataTable.r.att += checkInt(dataTable.i.m)
            object.dataTable.r.inc += checkInt(dataTable.i.inc)
        }
        object.dataTable.p.m.ktt = otchetRealizatoras.length
        object.dataTable.p.ch.ktt = otchetRealizatoras.length
        object.dataTable.p.k.ktt = otchetRealizatoras.length
        object.dataTable.p.sl.ktt = otchetRealizatoras.length
        object.dataTable.p.s02.ktt = otchetRealizatoras.length
        object.dataTable.p.s04.ktt = otchetRealizatoras.length
        object.dataTable.p.b.ktt = otchetRealizatoras.length
        object.dataTable.r.otr = 100 * otchetRealizatoras.length
        object.dataTable.p.m.kd = dolivkiM.length>0?Math.max.apply(Math, dolivkiM):0;
        object.dataTable.p.k.kd = dolivkiK.length>0?Math.max.apply(Math, dolivkiK):0;
        object.dataTable.p.ch.kd = dolivkiCh.length>0?Math.max.apply(Math, dolivkiCh):0;
        object.dataTable.p.sl.kd = dolivkiSl.length>0?Math.max.apply(Math, dolivkiSl):0;
        object.dataTable.p.s02.kd = dolivkiS02.length>0?Math.max.apply(Math, dolivkiS02):0;
        object.dataTable.p.s04.kd = dolivkiS04.length>0?Math.max.apply(Math, dolivkiS04):0;
        object.dataTable.p.b.kd = dolivkiB.length>0?Math.max.apply(Math, dolivkiB):0;
        object.dataTable['p']['i'] = checkInt(object.dataTable['p']['m']['ps']) + checkInt(object.dataTable['p']['ch']['ps']) + checkInt(object.dataTable['p']['k']['ps']) + checkInt(object.dataTable['p']['sl']['ps'])
        object.dataTable['i'] = checkInt(object.dataTable['p']['i']) - checkInt(object.dataTable['r']['otr']) - checkInt(object.dataTable['r']['oo']) - checkInt(object.dataTable['r']['inc']) - checkInt(object.dataTable['r']['ntp']) - checkInt(object.dataTable['r']['att']) - checkInt(object.dataTable['r']['at']) - checkInt(object.dataTable['r']['vs'])
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

export default connect(mapStateToProps, mapDispatchToProps)(OtchetOrganizatora);