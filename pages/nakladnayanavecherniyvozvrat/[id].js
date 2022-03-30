import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getNakladnayaNaVecherniyVozvrat} from '../../src/gql/nakladnayaNaVecherniyVozvrat'
import {getOtchetRealizatoras} from '../../src/gql/otchetRealizatora'
import nakladnayaNaVecherniyVozvratStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import {checkInt, pdDDMMYYYY} from '../../src/lib';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const NakladnayaNaVecherniyVozvrat = React.memo((props) => {
    const classes = nakladnayaNaVecherniyVozvratStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const router = useRouter()
    return (
        <App pageName='Накладная на вечерний возврат'>
            <Head>
                <title>Накладная на вечерний возврат</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Накладная на вечерний возврат' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/nakladnayanavecherniyvozvrat/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/nakladnayanavecherniyvozvrat/${router.query.id}`}/>
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
                            <div className={classes.row}>
                                <Typography className={classes.heading}>Максым</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}><b style={{color: 'black'}}>{data.object.dataTable.m.all}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </div>
                        </ExpansionPanelSummary>
                        {
                            data.object.dataTable.m.data.map((element, idx) => {return(
                                <ExpansionPanelDetails key={idx} style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Литр:
                                        </div>
                                        &nbsp;{element['l']}
                                    </center>
                                </ExpansionPanelDetails>
                            )})
                        }
                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel style={{width: '100%'}}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Квас</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}><b style={{color: 'black'}}>{data.object.dataTable.k.all}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        {
                            data.object.dataTable.k.data.map((element, idx) => {return(
                                <ExpansionPanelDetails key={idx} style={{padding: '0px', marginBottom: 10}}>
                                    <center style={{width: '100%'}}>
                                        <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                            Литр:
                                        </div>
                                        &nbsp;{element['l']}
                                    </center>
                                </ExpansionPanelDetails>
                            )})
                        }
                        <br/>
                    </ExpansionPanel>
                </CardContent>
            </Card>
        </App>
    )
})

NakladnayaNaVecherniyVozvrat.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object = await getNakladnayaNaVecherniyVozvrat(ctx.query.id!=='new'?{_id: ctx.query.id}:{}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    if(object)
        object.dataTable = JSON.parse(object.dataTable)
    else {
        object = {
            dataTable: {
                'm': {'all': 0, 'data': []},
                'k': {'all': 0, 'data': []},
            }
        }
        let otchetRealizatoras = await getOtchetRealizatoras({date: new Date()}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        for (let i = 0; i < otchetRealizatoras.length; i++) {
            let dataTable = JSON.parse(otchetRealizatoras[i].dataTable)
            if(checkInt(dataTable.vozvrat.v.ml)>0) {
                object.dataTable['m']['data'].push({'l': dataTable.vozvrat.v.ml})
                object.dataTable['m']['all'] += checkInt(dataTable.vozvrat.v.ml)
            }
            if(checkInt(dataTable.vozvrat.v.kl)>0) {
                object.dataTable['k']['data'].push({'l': dataTable.vozvrat.v.kl})
                object.dataTable['k']['all'] += checkInt(dataTable.vozvrat.v.kl)
            }
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(NakladnayaNaVecherniyVozvrat);