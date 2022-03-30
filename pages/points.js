import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import TableShow from '../components/app/TableShow';
import { pdDDMMYY } from '../src/lib'
import {getPoints, getPointsCount} from '../src/gql/point'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
const columns = ['Название', 'Регион', 'Дата']

const Points = React.memo((props) => {
    const { data } = props;
    let [rows, setRows] = useState(data.rows);
    let [count, setCount] = useState(data.count);
    const { search, region } = props.app;
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getPoints({search, skip: rows.length, ...region?{region: region._id}:{}}), addedRows = []
            if(addedList.length>0) {
                for(let i = 0; i <addedList.length; i++) {
                    addedRows = [
                        ...addedRows,
                        {
                            values: [addedList[i].name, addedList[i].region.name, pdDDMMYY(addedList[i].createdAt)]
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
        let list = await getPoints({skip: 0, search, ...region?{region: region._id}:{}}), rows = []
        for(let i = 0; i <list.length; i++) {
            rows = [
                ...rows,
                {
                    values: [list[i].name, list[i].region.name, pdDDMMYY(list[i].createdAt)]
                }
            ]
        }
        setRows([...rows]);
        setCount(await getPointsCount({search, ...region?{region: region._id}:{}}));
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
    },[region])
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
        <App checkPagination={checkPagination} searchShow={true} regionShow={true} pageName='Точки'>
            <Head>
                <title>Точки</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Точки' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/points`} />
                <link rel='canonical' href={`${urlMain}/points`}/>
            </Head>
            <TableShow columns={columns} rows={rows}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

Points.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['организатор', 'admin'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let list = await getPoints({skip: 0, ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined), rows = []
    for(let i = 0; i <list.length; i++) {
        rows = [
            ...rows,
            {
                values: [list[i].name, list[i].region.name, pdDDMMYY(list[i].createdAt)]
            }
        ]
    }
    return {
        data: {
            rows,
            count: await getPointsCount({...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Points);