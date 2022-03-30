import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import TableShow from '../components/app/TableShow';
import { pdDDMMYY } from '../src/lib'
import {getPlans, getPlansCount} from '../src/gql/plan'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import plansStyle from '../src/styleMUI/list'
const columns = ['Дата']

const Plans = React.memo((props) => {
    const { data } = props;
    let [rows, setRows] = useState(data.rows);
    let [paginationWork, setPaginationWork] = useState(true);
    const classes = plansStyle();
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getPlans({skip: rows.length}), addedRows = []
            if(addedList.length>0) {
                for(let i = 0; i <addedList.length; i++) {
                    addedRows = [
                        ...addedRows,
                        {
                            values: [pdDDMMYY(addedList[i].date)],
                            href: '/plan/[id]',
                            as: `/plan/${addedList[i]._id}`
                        }
                    ]
                }
                setRows([...rows, ...addedRows])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} regionShow={true} pointShow={true} dateShow={true} pageName='Планы'>
            <Head>
                <title>Планы</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Планы' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/plans`} />
                <link rel='canonical' href={`${urlMain}/plans`}/>
            </Head>
            <TableShow columns={columns} rows={rows}/>
            <div className='count'>
                {`Всего: ${data.count}`}
            </div>
            <Link href='/plan/[id]' as={`/plan/new`}>
                <Fab color='primary' aria-label='add' className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Link>
        </App>
    )
})

Plans.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let list = await getPlans({skip: 0,  ...process.browser&&sessionStorage.scrollPostionLimit?{limit: parseInt(sessionStorage.scrollPostionLimit)}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let rows = []
    for(let i = 0; i <list.length; i++) {
        rows = [
            ...rows,
            {
                values: [pdDDMMYY(list[i].date)],
                href: '/plan/[id]',
                as: `/plan/${list[i]._id}`
            }
        ]
    }
    return {
        data: {
            rows,
            count: await getPlansCount(ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Plans);