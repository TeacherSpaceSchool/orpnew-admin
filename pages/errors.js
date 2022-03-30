import Head from 'next/head';
import React, { useState } from 'react';
import App from '../layouts/App';
import CardError from '../components/CardError';
import pageListStyle from '../src/styleMUI/list'
import {getErrors, clearAllErrors, getErrorsCount} from '../src/gql/error'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import CardErrorPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import Fab from '@material-ui/core/Fab';
import RemoveIcon from '@material-ui/icons/Clear';
import Confirmation from '../components/dialog/Confirmation'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'

const Error = React.memo((props) => {
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const classes = pageListStyle();
    const { data } = props;
    const { profile } = props.user;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getErrors({skip: list.length})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} setList={setList} list={list} pageName='Сбои'>
            <Head>
                <title>Сбои</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Сбои' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic/error`} />
                <link rel='canonical' href={`${urlMain}/statistic/error`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={120} offset={[120, 0]} debounce={0} once={true}  placeholder={<CardErrorPlaceholder/>}>
                        <CardError element={element}/>
                    </LazyLoad>
                ):null}
            </div>
            {
                profile.role==='admin'?
                    <Fab onClick={async()=>{
                        const action = async() => {
                            await clearAllErrors()
                            setList([])
                            setCount(0)
                        }
                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                        showMiniDialog(true)
                    }} color='primary' aria-label='add' className={classes.fab}>
                        <RemoveIcon />
                    </Fab>
                :
                null
            }

            <div className='count'>
                {
                    `Всего сбоев: ${count}`
                }
            </div>
        </App>
    )
})

Error.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            list: await getErrors({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getErrorsCount(ctx.req?await getClientGqlSsr(ctx.req):undefined)
        },
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Error);