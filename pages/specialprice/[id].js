import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getSpecialPrice, setSpecialPrice, getFreePointsForSpecialPrice, deleteSpecialPrice, addSpecialPrice } from '../../src/gql/specialPrice'
import {getPrices} from '../../src/gql/price'
import specialPriceStyle from '../../src/styleMUI/list'
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import {checkInt, inputInt} from '../../src/lib';
import {getRegions} from '../../src/gql/region'

const SpecialPrice = React.memo((props) => {
    const classes = specialPriceStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const router = useRouter()
    const initialRender = useRef(true);
    let [region, setRegion] = useState(undefined);
    let [point, setPoint] = useState(data.object.point);
    let [points, setPoints] = useState([]);
    let [prices, setPrices] = useState(data.object.prices);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                setPoint(undefined)
                if(region)
                    setPoints(await getFreePointsForSpecialPrice({region: region._id}))
                else
                    setPoints([])
            }
            else
                initialRender.current = false;
        })()
    },[region])
    return (
        <App pageName='Специальные цены'>
            <Head>
                <title>Специальные цены</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Специальные цены' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/specialprice/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/specialprice/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                {
                    data.object!==null?
                        <>
                        {
                            router.query.id==='new'?
                                <>
                                <Autocomplete
                                    options={data.regions}
                                    value={region}
                                    onChange={(event, newValue) => {
                                        setRegion(newValue);
                                    }}
                                    className={classes.input}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label='Регион' />}
                                />
                                <Autocomplete
                                    options={points}
                                    value={point}
                                    onChange={(event, newValue) => {
                                        setPoint(newValue);
                                    }}
                                    className={classes.input}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label='Точка' />}
                                />
                                </>
                                :
                                <TextField
                                    label='Точка'
                                    className={classes.input}
                                    margin='normal'
                                    value={point.name}
                                />
                        }
                        <TextField
                            label='Максым'
                            type='number'
                            className={classes.input}
                            margin='normal'
                            value={prices['Максым']}
                            onChange={(event)=>{
                                prices['Максым'] = inputInt(event.target.value)
                                setPrices({...prices})
                            }}
                        />
                        <TextField
                            label='Чалап'
                            type='number'
                            className={classes.input}
                            margin='normal'
                            value={prices['Чалап']}
                            onChange={(event)=>{
                                prices['Чалап'] = inputInt(event.target.value)
                                setPrices({...prices})
                            }}
                        />
                        <TextField
                            label='Квас'
                            type='number'
                            className={classes.input}
                            margin='normal'
                            value={prices['Квас']}
                            onChange={(event)=>{
                                prices['Квас'] = inputInt(event.target.value)
                                setPrices({...prices})
                            }}
                        />
                        <TextField
                            label='Стакан Легенда'
                            type='number'
                            className={classes.input}
                            margin='normal'
                            value={prices['Стакан Легенда']}
                            onChange={(event)=>{
                                prices['Стакан Легенда'] = inputInt(event.target.value)
                                setPrices({...prices})
                            }}
                        />
                        <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                            {
                                router.query.id==='new'?
                                    point?
                                        <Button size='small' color='primary' onClick={()=>{
                                            const action = async() => {
                                                prices['Максым'] = checkInt(prices['Максым'])
                                                prices['Чалап'] = checkInt(prices['Чалап'])
                                                prices['Квас'] = checkInt(prices['Квас'])
                                                prices['Стакан Легенда'] = checkInt(prices['Стакан Легенда'])
                                                await addSpecialPrice({
                                                    point: point._id,
                                                    prices: JSON.stringify(prices)
                                                })
                                                Router.push('/specialprices')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true);
                                        }} className={classes.button}>
                                            Добавить
                                        </Button>
                                        :
                                        null
                                    :
                                    <>
                                    <Button size='small' color='primary' onClick={()=>{
                                        const action = async() => {
                                            prices['Максым'] = checkInt(prices['Максым'])
                                            prices['Чалап'] = checkInt(prices['Чалап'])
                                            prices['Квас'] = checkInt(prices['Квас'])
                                            prices['Стакан Легенда'] = checkInt(prices['Стакан Легенда'])
                                            await setSpecialPrice({
                                                _id: router.query.id,
                                                prices: JSON.stringify(prices)
                                            })
                                            Router.push('/specialprices')
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true);
                                    }} className={classes.button}>
                                        Сохранить
                                    </Button>
                                    <Button size='small' color='primary' onClick={()=>{
                                        const action = async() => {
                                            await deleteSpecialPrice({
                                                _id: router.query.id
                                            })
                                            Router.push('/specialprices')
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true);
                                    }} className={classes.button}>
                                        Удалить
                                    </Button>
                                    </>
                            }
                        </div>
                        </>
                        :
                        'Ничего не найдено'
                }
                </CardContent>
            </Card>
        </App>
    )
})

SpecialPrice.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let object;
    if(ctx.query.id!=='new'){
        object = await getSpecialPrice({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        object.prices = JSON.parse(object.prices)
    }
    else {
        let _prices = await getPrices({}, ctx.req?await getClientGqlSsr(ctx.req):undefined), prices = {}
        for(let i = 0; i <_prices.length; i++) {
            prices[_prices[i].name] = _prices[i].price
        }
        object = {
            point: undefined,
            prices
        }
    }
    return {
        data: {
            object,
            regions: await getRegions({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        specialPrice: state.specialPrice,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecialPrice);