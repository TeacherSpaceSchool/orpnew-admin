import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import TableShow from '../components/app/TableShow';
import { pdDDMMYY } from '../src/lib'
import {getChecklistInspectors, getChecklistInspectorsCount, unloadingChecklistInspectors} from '../src/gql/checklistInspector'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import Link from 'next/link';
import checklistInspectorsStyle from '../src/styleMUI/list'
import { bindActionCreators } from 'redux'
import * as appActions from '../redux/actions/app'
import { pdDatePicker } from '../src/lib'
const filters = [{name:'День', value: 'day'}, {name:'Неделя', value: 'week'}, {name:'Месяц', value: 'month'}, {name:'Год', value: 'year'}]

const ChecklistInspectors = React.memo((props) => {
    const { data } = props;
    let [rows, setRows] = useState(data.rows);
    let [count, setCount] = useState(data.count);
    const { date, region, point, realizator, inspector, isMobileApp, filter } = props.app;
    const { showLoad } = props.appActions;
    let [columns] = useState(isMobileApp?['Балл', 'Реализатор', 'Дата']:['Балл', 'Реализатор', 'Инспектор', 'Дата']);
    const { profile } = props.user;
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const classes = checklistInspectorsStyle();
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getChecklistInspectors({
                dateType: filter,
                ...date?{date}:{},
                skip: rows.length,
                ...region?{region: region._id}:{},
                ...point?{point: point._id}:{},
                ...realizator?{realizator: realizator._id}:{},
                ...inspector?{inspector: inspector._id}:{}
            }), addedRows = []
            if(addedList.length>0) {
                for(let i = 0; i <addedList.length; i++) {
                    addedRows = [
                        ...addedRows,
                        {
                            values: [addedList[i].score, addedList[i].realizator.name, ...!isMobileApp?[addedList[i].inspector.name]:[], pdDDMMYY(addedList[i].createdAt)],
                            href: '/checklistinspector/[id]',
                            as: `/checklistinspector/${addedList[i]._id}`
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
        let list = await getChecklistInspectors({
            skip: 0,
            dateType: filter,
            ...date?{date}:{},
            ...region?{region: region._id}:{},
            ...point?{point: point._id}:{},
            ...realizator?{realizator: realizator._id}:{},
            ...inspector?{inspector: inspector._id}:{},
        }), rows = []
        for(let i = 0; i <list.length; i++) {
            rows = [
                ...rows,
                {
                    values: [list[i].score, list[i].realizator.name, ...!isMobileApp?[list[i].inspector.name]:[], pdDDMMYY(list[i].createdAt)],
                    href: '/checklistinspector/[id]',
                    as: `/checklistinspector/${list[i]._id}`
                }
            ]
        }
        setRows([...rows]);
        setCount(await getChecklistInspectorsCount({
            dateType: filter,
            ...date?{date}:{},
            ...region?{region: region._id}:{},
            ...point?{point: point._id}:{},
            ...realizator?{realizator: realizator._id}:{},
            ...inspector?{inspector: inspector._id}:{},
        }));
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
    },[region, point, date, realizator, inspector])
    return (
        <App checkPagination={checkPagination} filters={filters} regionShow={true} pointShow={true} realizatorShow={true} inspectorShow={true} dateShow={true} pageName='Чек-лист инспектора'>
            <Head>
                <title>Чек-лист инспектора</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Чек-лист инспектора' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/checklistinspectors`} />
                <link rel='canonical' href={`${urlMain}/checklistinspectors`}/>
            </Head>
            <TableShow columns={columns} rows={rows}/>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            {
                'инспектор'===profile.role?
                    <Link href='/checklistinspector/[id]' as={`/checklistinspector/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    <Fab color='primary' aria-label='add' className={classes.fab} onClick={async ()=>{
                        await showLoad(true)
                        window.open(await unloadingChecklistInspectors({
                            dateType: filter,
                            ...date?{date}:{},
                            ...region?{region: region._id}:{},
                            ...point?{point: point._id}:{},
                            ...realizator?{realizator: realizator._id}:{},
                            ...inspector?{inspector: inspector._id}:{},
                        }), '_blank')
                        await showLoad(false)
                    }}>
                        <GetAppIcon />
                    </Fab>
            }
        </App>
    )
})

ChecklistInspectors.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'главинспектор', 'инспектор'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    //ctx.store.getState().app.date = pdDatePicker()
    ctx.store.getState().app.filter = 'day'
    let list = await getChecklistInspectors({
        date: ctx.store.getState().app.date,
        skip: 0,
        dateType: 'day',
        ...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{},
        ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{},
        ...ctx.store.getState().app.inspector?{inspector: ctx.store.getState().app.inspector._id}:{},
        ...ctx.store.getState().app.realizator?{realizator: ctx.store.getState().app.realizator._id}:{},
        ...process.browser&&sessionStorage.scrollPostionLimit?{limit: parseInt(sessionStorage.scrollPostionLimit)}:{}
    },  ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let rows = []
    for(let i = 0; i <list.length; i++) {
        rows = [
            ...rows,
            {
                values: [list[i].score, list[i].realizator.name, ...!ctx.store.getState().app.isMobileApp?[list[i].inspector.name]:[], pdDDMMYY(list[i].createdAt)],
                href: '/checklistinspector/[id]',
                as: `/checklistinspector/${list[i]._id}`
            }
        ]
    }
    return {
        data: {
            rows,
            count: await getChecklistInspectorsCount({
                date: ctx.store.getState().app.date,
                dateType: 'day',
                ...ctx.store.getState().app.point?{point: ctx.store.getState().app.point._id}:{},
                ...ctx.store.getState().app.region?{region: ctx.store.getState().app.region._id}:{},
                ...ctx.store.getState().app.inspector?{inspector: ctx.store.getState().app.inspector._id}:{},
                ...ctx.store.getState().app.realizator?{realizator: ctx.store.getState().app.realizator._id}:{},
                search: ''
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

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistInspectors);