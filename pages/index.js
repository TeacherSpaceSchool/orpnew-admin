import Head from 'next/head';
import React, {useState, useEffect, useRef} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import {getBlogs} from '../src/gql/blog'
import CardBlog from '../components/CardBlog'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
const height = 294

const Index = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    const { search } = props.app;
    const { profile, authenticated } = props.user;
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getBlogs({search, skip: list.length})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                setPaginationWork(false)
        }
    }
    const getList = async ()=>{
        setList(await getBlogs({search,  skip: 0}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        setPaginationWork(true);
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut)clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[search])
    return (
        <App checkPagination={checkPagination} searchShow={true} pageName={authenticated?'Блог':''}>
            <Head>
                <title>{authenticated?'Блог':''}</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content={authenticated?'Блог':''} />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/`} />
                <link rel='canonical' href={`${urlMain}/`}/>
            </Head>
            <div className={classes.page}>
                {'admin'===profile.role?<CardBlog list={list} setList={setList}/>:null}
                {list?list.map((element, idx)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                              offset={[height, 0]} debounce={0} once={true}
                              placeholder={<CardPlaceholder height={height}/>}>
                        <CardBlog list={list} idx={idx} key={element._id} setList={setList} element={element}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

Index.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {
            list: await getBlogs({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Index);