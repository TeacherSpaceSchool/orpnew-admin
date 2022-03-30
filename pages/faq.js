import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import CardFaq from '../components/CardFaq';
import pageListStyle from '../src/styleMUI/list'
import {getFaqs} from '../src/gql/faq'
import { connect } from 'react-redux'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'

const Faqs = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    const { search, } = props.app;
    const { profile } = props.user;
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getFaqs({search, skip: list.length})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                setPaginationWork(false)
        }
    }
    const getList = async()=>{
        setList(await getFaqs({search, skip: 0}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        setPaginationWork(true)
    }
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
    let height = 'admin'===profile.role?244:125
    return (
        <App checkPagination={checkPagination} searchShow={true} pageName='Инструкции'>
            <Head>
                <title>Инструкции</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Инструкции' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/faq`} />
                <link rel='canonical' href={`${urlMain}/faq`}/>
            </Head>
            <div className={classes.page}>
                {'admin'===profile.role?<CardFaq list={list} setList={setList}/>:null}
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                        <CardFaq list={list} idx={idx} setList={setList} key={element._id} element={element}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

Faqs.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {list: await getFaqs({skip: 0, search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)}
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Faqs);