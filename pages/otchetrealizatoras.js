import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import TableShow from '../components/app/TableShow';
import { pdDDMMYY } from '../src/lib'
import {getOtchetRealizatoras, getOtchetRealizatorasCount} from '../src/gql/otchetRealizatora'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import otchetRealizatorasStyle from '../src/styleMUI/list'
import { pdDatePicker } from '../src/lib'
const columns = ['Точка', 'Регион', 'Дата']

const OtchetRealizatoras = React.memo((props) => {
    const { data } = props;
    let [rows, setRows] = useState(data.rows);
    let [count, setCount] = useState(data.count);
    const { date, region, point } = props.app;
    const { profile } = props.user;
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const classes = otchetRealizatorasStyle();
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getOtchetRealizatoras({...date?{date}:{}, skip: rows.length, ...region?{region: region._id}:{}, ...point?{point: point._id}:{}}), addedRows = []
            if(addedList.length>0) {
                for(let i = 0; i <addedList.length; i++) {
                    addedRows = [
                        ...addedRows,
                        {
                            values: [addedList[i].point.name, addedList[i].region.name, pdDDMMYY(addedList[i].createdAt)],
                            href: '/otchetrealizatora/[id]',
                            as: `/otchetrealizatora/${addedList[i]._id}`
                        }
                    ]
                }
                setRows([...rows, ...addedRows])
            }
            else
                setPaginationWork(false)
        }
    }
    const getList = async()=>{
        let list = await getOtchetRealizatoras({skip: 0, ...date?{date}:{}, ...region?{region: region._id}:{}, ...point?{point: point._id}:{}}), rows = []
        for(let i = 0; i <list.length; i++) {
            rows = [
                ...rows,
                {
                    values: [list[i].point.name, list[i].region.name, pdDDMMYY(list[i].createdAt)],
                    href: '/otchetrealizatora/[id]',
                    as: `/otchetrealizatora/${list[i]._id}`
                }
            ]
        }
        setRows([...rows]);
        setCount(await getOtchetRealizatorasCount({...date?{date}:{}, ...region?{region: region._id}:{}, ...point?{point: point._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        setPaginationWork(true)
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                getList()
            }
        })()
    },[region, point, date])
    return (
        <App checkPagination={checkPagination} regionShow={true} pointShow={true} dateShow={true} pageName='Отчеты реализатора'>
            <Head>
                <title>Отчеты реализатора</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Отчеты реализатора' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/otchetrealizatoras`} />
                <link rel='canonical' href={`${urlMain}/otchetrealizatoras`}/>
            </Head>
            <TableShow columns={columns} rows={rows}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            {
                'организатор'===profile.role?
                    <Link href='/otchetrealizatora/[id]' as={`/otchetrealizatora/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null
            }
        </App>
    )
})

OtchetRealizatoras.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    ctx.store.getState().app.date = pdDatePicker()
    let list = await getOtchetRealizatoras({date: ctx.store.getState().app.date, skip: 0, search: '', ...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}, ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}, ...process.browser&&sessionStorage.scrollPostionLimit?{limit: parseInt(sessionStorage.scrollPostionLimit)}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let rows = []
    for(let i = 0; i <list.length; i++) {
        rows = [
            ...rows,
            {
                values: [list[i].point.name, list[i].region.name, pdDDMMYY(list[i].createdAt)],
                href: '/otchetrealizatora/[id]',
                as: `/otchetrealizatora/${list[i]._id}`
            }
        ]
    }
    return {
        data: {
            rows,
            count: await getOtchetRealizatorasCount({date: ctx.store.getState().app.date, ...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}, ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}, search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(OtchetRealizatoras);