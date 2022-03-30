import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import TableShow from '../components/app/TableShow';
import { pdDDMMYY } from '../src/lib'
import {getRealizators, getRealizatorsCount} from '../src/gql/realizator'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
const columns = ['Имя', 'Точка', 'Регион', 'Дата']

const Realizators = React.memo((props) => {
    const { data } = props;
    let [rows, setRows] = useState(data.rows);
    let [count, setCount] = useState(data.count);
    const { search, region, point } = props.app;
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getRealizators({search, skip: rows.length, ...region?{region: region._id}:{}, ...point?{point: point._id}:{}}), addedRows = []
            if(addedList.length>0) {
                for(let i = 0; i <addedList.length; i++) {
                    addedRows = [
                        ...addedRows,
                        {
                            values: [addedList[i].name, addedList[i].point.name, addedList[i].region.name, pdDDMMYY(addedList[i].createdAt)],
                            href: '/realizator/[id]',
                            as: `/realizator/${addedList[i]._id}`
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
        let list = await getRealizators({skip: 0, search, ...region?{region: region._id}:{}, ...point?{point: point._id}:{}}), rows = []
        for(let i = 0; i <list.length; i++) {
            rows = [
                ...rows,
                {
                    values: [list[i].name, list[i].point.name, list[i].region.name, pdDDMMYY(list[i].createdAt)],
                    href: '/realizator/[id]',
                    as: `/realizator/${list[i]._id}`
                }
            ]
        }
        setRows([...rows]);
        setCount(await getRealizatorsCount({search, ...region?{region: region._id}:{}, ...point?{point: point._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        setPaginationWork(true)
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                getList()
            }
        })()
    },[region, point])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[search])
    return (
        <App checkPagination={checkPagination} searchShow={true} regionShow={true} pointShow={true} pageName='Реализаторы'>
            <Head>
                <title>Реализаторы</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Реализаторы' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/realizators`} />
                <link rel='canonical' href={`${urlMain}/realizators`}/>
            </Head>
            <TableShow columns={columns} rows={rows}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Realizators.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let list = await getRealizators({skip: 0, search: '', ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}, ...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}, ...process.browser&&sessionStorage.scrollPostionLimit?{limit: parseInt(sessionStorage.scrollPostionLimit)}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined), rows = []
    for(let i = 0; i <list.length; i++) {
        rows = [
            ...rows,
            {
                values: [list[i].name, list[i].point.name, list[i].region.name, pdDDMMYY(list[i].createdAt)],
                href: '/realizator/[id]',
                as: `/realizator/${list[i]._id}`
            }
        ]
    }
    return {
        data: {
            rows,
            count: await getRealizatorsCount({
                    search: '',
                    ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{},
                    ...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{}
                }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Realizators);