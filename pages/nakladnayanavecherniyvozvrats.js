import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import TableShow from '../components/app/TableShow';
import { pdDDMMYY } from '../src/lib'
import {getNakladnayaNaVecherniyVozvrats, getNakladnayaNaVecherniyVozvratsCount} from '../src/gql/nakladnayaNaVecherniyVozvrat'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import { pdDatePicker } from '../src/lib'
const columns = ['Регион', 'Дата']

const NakladnayaNaVecherniyVozvrats = React.memo((props) => {
    const { data } = props;
    let [rows, setRows] = useState(data.rows);
    let [count, setCount] = useState(data.count);
    const { region, date } = props.app;
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getNakladnayaNaVecherniyVozvrats({skip: rows.length, ...region?{region: region._id}:{}, ...date?{date}:{}}), addedRows = []
            if(addedList.length>0) {
                for(let i = 0; i <addedList.length; i++) {
                    addedRows = [
                        ...addedRows,
                        {
                            values: [addedList[i].region.name, pdDDMMYY(addedList[i].createdAt)],
                            href: '/nakladnayanavecherniyvozvrat/[id]',
                            as: `/nakladnayanavecherniyvozvrat/${addedList[i]._id}`
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
        let list = await getNakladnayaNaVecherniyVozvrats({skip: 0, ...region?{region: region._id}:{}, ...date?{date}:{}}), rows = []
        for(let i = 0; i <list.length; i++) {
            rows = [
                ...rows,
                {
                    values: [list[i].region.name, pdDDMMYY(list[i].createdAt)],
                    href: '/nakladnayanavecherniyvozvrat/[id]',
                    as: `/nakladnayanavecherniyvozvrat/${list[i]._id}`
                }
            ]
        }
        setRows([...rows]);
        setCount(await getNakladnayaNaVecherniyVozvratsCount({...region?{region: region._id}:{}, ...date?{date}:{}}));
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
    },[region, date])
    return (
        <App checkPagination={checkPagination} regionShow={true} dateShow={true} pageName='Накладные на вечерний возврат'>
            <Head>
                <title>Накладные на вечерний возврат</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Накладные на вечерний возврат' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/nakladnayanavecherniyvozvrats`} />
                <link rel='canonical' href={`${urlMain}/nakladnayanavecherniyvozvrats`}/>
            </Head>
            <TableShow columns={columns} rows={rows}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
        </App>
    )
})

NakladnayaNaVecherniyVozvrats.getInitialProps = async function(ctx) {
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
    let list = await getNakladnayaNaVecherniyVozvrats({date: ctx.store.getState().app.date, skip: 0, search: '', ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}, ...process.browser&&sessionStorage.scrollPostionLimit?{limit: parseInt(sessionStorage.scrollPostionLimit)}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let rows = []
    for(let i = 0; i <list.length; i++) {
        rows = [
            ...rows,
            {
                values: [list[i].region.name, pdDDMMYY(list[i].createdAt)],
                href: '/nakladnayanavecherniyvozvrat/[id]',
                as: `/nakladnayanavecherniyvozvrat/${list[i]._id}`
            }
        ]
    }
    return {
        data: {
            rows,
            count: await getNakladnayaNaVecherniyVozvratsCount({date: ctx.store.getState().app.date, ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{}, search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(NakladnayaNaVecherniyVozvrats);