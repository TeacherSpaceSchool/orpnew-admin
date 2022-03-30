import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getPlan, setPlan, addPlan, deletePlan} from '../../src/gql/plan'
import planStyle from '../../src/styleMUI/list'
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
import {checkInt, inputInt, pdDDMMYYYY} from '../../src/lib';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getPoints} from '../../src/gql/point'
import { pdDatePicker } from '../../src/lib'

const Plan = React.memo((props) => {
    const classes = planStyle();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp } = props.app;
    let [date, setDate] = useState(data.object.date);
    let [norma, setNorma] = useState(data.object.norma);
    let [normaRegions, setNormaRegions] = useState(data.object.normaRegions);
    let handleNormaRegions =  (event, region, point) => {
        normaRegions[region].norma -= normaRegions[region].points[point].norma
        norma -= normaRegions[region].points[point].norma

        normaRegions[region].points[point].norma = inputInt(event.target.value)

        normaRegions[region].norma += checkInt(normaRegions[region].points[point].norma)
        norma += checkInt(normaRegions[region].points[point].norma)

        setNorma(norma)
        setNormaRegions({...normaRegions})
    };
    const router = useRouter()
    return (
        <App pageName='План'>
            <Head>
                <title>План</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='План' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/plan/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/plan/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    {
                        data.object._id?
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Дата:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYYY(date)}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Цель:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {norma}
                                </div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Прогресс:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {data.object.current}
                                </div>
                            </div>
                            </>
                            :
                            <>
                            <TextField
                                className={classes.input}
                                label='Дата начала'
                                type='date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={date}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                                onChange={ event => setDate(event.target.value) }
                            />
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Цель:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {norma}
                                </div>
                            </div>
                            </>
                    }
                    {
                        Object.values(normaRegions).map((normaRegion, idx) => <ExpansionPanel key={`region${idx}`} style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>{normaRegion.name}</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    Цель: <b style={{color: 'black'}}>{normaRegion.norma}</b>
                                    {
                                        data.object.currentRegions&&data.object.currentRegions[normaRegion._id]?
                                            <>
                                            &nbsp;&nbsp;
                                            Прогресс: <b style={{color: 'black'}}>{data.object.currentRegions[normaRegion._id].current}</b>
                                            </>
                                            :
                                            null
                                    }
                                  </Typography>
                            </ExpansionPanelSummary>
                            {Object.values(normaRegion.points).map((normaPoint, idx1)=>{
                                    return(
                                        <ExpansionPanelDetails key={`point${idx}${idx1}`}>
                                            <center style={{width: '100%'}}>
                                                <b>{normaPoint.name}</b><br/>
                                                <div style={{width: '40px', marginRight: '10px', display: 'inline-block', verticalAlign: 'middle'}}>
                                                    Цель:
                                                </div>
                                                <TextField
                                                    style={{marginTop: '12px', marginRight: '10px', width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                                    type="number"
                                                    margin='normal'
                                                    value={normaPoint.norma}
                                                    onChange={(event)=>{handleNormaRegions(event, normaRegion._id, normaPoint._id)}}
                                                />
                                                {
                                                    data.object.currentRegions&&data.object.currentRegions[normaRegion._id]&&data.object.currentRegions[normaRegion._id].points[normaPoint._id]?
                                                        <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle'}}>
                                                            Прогресс: <div style={{display: 'inline-block', fontWeight: 'bold'}}>{data.object.currentRegions[normaRegion._id].points[normaPoint._id].current}</div>
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </center>
                                        </ExpansionPanelDetails>
                                    )
                                })
                            }
                        </ExpansionPanel>)
                    }
                    <br/>
                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                        {
                            !data.object._id?
                                <Button size='small' color='primary' onClick={()=>{
                                    const action = async() => {
                                        await addPlan({normaRegions: JSON.stringify(normaRegions), norma, date})
                                        Router.push('/plans')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true);
                                }} className={classes.button}>
                                    Добавить
                                </Button>
                                :
                                <>
                                <Button size='small' color='primary' onClick={()=>{
                                    const action = async() => {
                                        await setPlan({normaRegions: JSON.stringify(normaRegions), norma, _id: data.object._id})
                                        Router.push('/plans')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true);
                                }} className={classes.button}>
                                    Сохранить
                                </Button>
                                <Button size='small' color='secondary' onClick={()=>{
                                    const action = async() => {
                                        await deletePlan(data.object._id)
                                        Router.push('/plans')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true);
                                }} className={classes.button}>
                                    Удалить
                                </Button>
                                </>
                        }
                    </div>
                </CardContent>
            </Card>
        </App>
    )
})

Plan.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object
    if(ctx.query.id==='new'){
        object = {
            date: pdDatePicker(new Date()),
            norma: 0,
            normaRegions: {}
        }
        let points = await getPoints({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        for (let i = 0; i < points.length; i++) {
            if(!object.normaRegions[points[i].region._id])
                object.normaRegions[points[i].region._id] = {
                    _id: points[i].region._id,
                    name: points[i].region.name,
                    points: {},
                    norma: 0
                }
            object.normaRegions[points[i].region._id].points[points[i]._id] = {
                _id: points[i]._id,
                name: points[i].name,
                norma: 0
            }
        }
    }
    else {
        object = await getPlan({_id: ctx.query.id}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
        object.normaRegions = JSON.parse(object.normaRegions)
        object.currentRegions = JSON.parse(object.currentRegions)
    }
    return {
        data: {
            object
        }
    };
};

function mapStateToProps (state) {
    return {
        organizator: state.organizator,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plan);