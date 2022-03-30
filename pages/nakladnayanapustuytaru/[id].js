import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getNakladnayaNaPustuyTaru, setNakladnayaNaPustuyTaru, addNakladnayaNaPustuyTaru} from '../../src/gql/nakladnayaNaPustuyTaru'
import {getNakladnayaSklad1} from '../../src/gql/nakladnayaSklad1'
import nakladnayaNaPustuyTaruStyle from '../../src/styleMUI/list'
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const NakladnayaNaPustuyTaru = React.memo((props) => {
    const classes = nakladnayaNaPustuyTaruStyle();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    const router = useRouter()
    let [nakladnaya, setNakladnaya] = useState(data.object.dataTable);
    let [checkAdmin, setCheckAdmin] = useState(data.object.checkAdmin);
    let handleLitr = async (event, type, what) => {
        if(!data.expiredDate) {
            nakladnaya= {...nakladnaya}
            let litr = parseInt(event.target.value)
            if (isNaN(litr)) {
                nakladnaya[type][what] = ''
            } else {
                if(litr<0)
                    litr *= -1
                nakladnaya[type][what] = litr
            }
            nakladnaya['i'][what] = checkInt(nakladnaya['r'][what]) + checkInt(nakladnaya['d1'][what]) + checkInt(nakladnaya['d2'][what]) + checkInt(nakladnaya['d3'][what]) + checkInt(nakladnaya['s'][what])
            setNakladnaya(nakladnaya)
        }
    };
    return (
        <App pageName='Накладная на пустую тару'>
            <Head>
                <title>Накладная на пустую тару</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Накладная на пустую тару' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/nakladnayanapustuytaru/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/nakladnayanapustuytaru/${router.query.id}`}/>
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
                            <Typography className={classes.heading}>Растановка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.r.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.r.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.r.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.r.k10}</b>&nbsp;&nbsp;</div>
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
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.r.m25}
                                    onChange={(event)=>{handleLitr(event, 'r', 'm25')}}
                                />
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
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.r.ch25}
                                    onChange={(event)=>{handleLitr(event, 'r', 'ch25')}}
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
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.r.ch10}
                                    onChange={(event)=>{handleLitr(event, 'r', 'ch10')}}
                                />
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
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.r.k10}
                                    onChange={(event)=>{handleLitr(event, 'r', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>1-й долив</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.d1.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.d1.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.d1.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.d1.k10}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d1.m25}
                                    onChange={(event)=>{handleLitr(event, 'd1', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d1.ch25}
                                    onChange={(event)=>{handleLitr(event, 'd1', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate }
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d1.ch10}
                                    onChange={(event)=>{handleLitr(event, 'd1', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate }
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d1.k10}
                                    onChange={(event)=>{handleLitr(event, 'd1', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>2-й долив</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.d2.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.d2.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}> Ч10: <b style={{color: 'black'}}>{nakladnaya.d2.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.d2.k10}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate }
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d2.m25}
                                    onChange={(event)=>{handleLitr(event, 'd2', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate }
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d2.ch25}
                                    onChange={(event)=>{handleLitr(event, 'd2', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate }
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d2.ch10}
                                    onChange={(event)=>{handleLitr(event, 'd2', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate }
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d2.k10}
                                    onChange={(event)=>{handleLitr(event, 'd2', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>3-й долив</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.d3.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.d3.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.d3.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.d3.k10}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d3.m25}
                                    onChange={(event)=>{handleLitr(event, 'd3', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d3.ch25}
                                    onChange={(event)=>{handleLitr(event, 'd3', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d3.ch10}
                                    onChange={(event)=>{handleLitr(event, 'd3', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.d3.k10}
                                    onChange={(event)=>{handleLitr(event, 'd3', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Съем</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.s.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.s.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.s.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.s.k10}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.s.m25}
                                    onChange={(event)=>{handleLitr(event, 's', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.s.ch25}
                                    onChange={(event)=>{handleLitr(event, 's', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.s.ch10}
                                    onChange={(event)=>{handleLitr(event, 's', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={data.expiredDate}
                                    style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                    type='number'
                                    margin='normal'
                                    value={nakladnaya.s.k10}
                                    onChange={(event)=>{handleLitr(event, 's', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Итого</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.i.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.i.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.i.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.i.k10}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                &nbsp;{nakladnaya.i.m25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.i.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.i.ch10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                &nbsp;{nakladnaya.i.k10}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    {nakladnaya.ostalos?
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Осталось</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.ostalos.m25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.ostalos.ch25}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.ostalos.ch10}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.ostalos.k10}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '5px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Максым 25:
                                    </div>
                                    &nbsp;{nakladnaya.ostalos.m25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '5px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 25:
                                    </div>
                                    &nbsp;{nakladnaya.ostalos.ch25}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '5px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Чалап 10:
                                    </div>
                                    &nbsp;{nakladnaya.ostalos.ch10}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '5px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Квас 10:
                                    </div>
                                    &nbsp;{nakladnaya.ostalos.k10}
                                </center>
                            </ExpansionPanelDetails>
                            <br/>
                        </ExpansionPanel>
                        :
                        null
                    }

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
                                            addNakladnayaNaPustuyTaru({
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        else
                                            setNakladnayaNaPustuyTaru({
                                                _id: data.object._id,
                                                ...profile.role==='admin'&&checkAdmin!==data.object.checkAdmin?{checkAdmin}:{},
                                                dataTable: JSON.stringify(nakladnaya)
                                            })
                                        Router.push('/nakladnayanapustuytarus')
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

NakladnayaNaPustuyTaru.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role)||'admin'===ctx.store.getState().user.profile.role&&ctx.query.id==='new')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getNakladnayaNaPustuyTaru(ctx.query.id!=='new'?{_id: ctx.query.id}:{}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let expiredDate = false
    if(object) {
        object.dataTable = JSON.parse(object.dataTable)
        expiredDate = /*((new Date()-new Date(object.createdAt))/1000/60/60)>36 || */(object.checkAdmin&&'организатор'===ctx.store.getState().user.profile.role)
    }
    else {
        object = {
            dataTable: {
                'r': {'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''},
                'd1':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''},
                'd2':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''},
                'd3':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''},
                's':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''},
                'i':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''},
                'ostalos':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':''}
            }
        }
    }
    let nakladnayaSklad1 = await getNakladnayaSklad1({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    if(nakladnayaSklad1){
        let dataTable = JSON.parse(nakladnayaSklad1.dataTable)
        object.dataTable['ostalos']['m25'] = checkInt(dataTable['vozvrat']['i']['m25']) - checkInt(object.dataTable['i']['m25'])
        if(object.dataTable['ostalos']['m25']<0)
            object.dataTable['ostalos']['m25'] *= -1
        else
            object.dataTable['ostalos']['m25'] = 0
        object.dataTable['ostalos']['ch10'] = checkInt(dataTable['vozvrat']['i']['ch10']) - checkInt(object.dataTable['i']['ch10'])
        if(object.dataTable['ostalos']['ch10']<0)
            object.dataTable['ostalos']['ch10'] *= -1
        else
            object.dataTable['ostalos']['ch10'] = 0
        object.dataTable['ostalos']['ch25'] = checkInt(dataTable['vozvrat']['i']['ch25']) - checkInt(object.dataTable['i']['ch25'])
        if(object.dataTable['ostalos']['ch25']<0)
            object.dataTable['ostalos']['ch25'] *= -1
        else
            object.dataTable['ostalos']['ch25'] = 0
        object.dataTable['ostalos']['k10'] = checkInt(dataTable['vozvrat']['i']['k10']) - checkInt(object.dataTable['i']['k10'])
        if(object.dataTable['ostalos']['k10']<0)
            object.dataTable['ostalos']['k10'] *= -1
        else
            object.dataTable['ostalos']['k10'] = 0
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

export default connect(mapStateToProps, mapDispatchToProps)(NakladnayaNaPustuyTaru);