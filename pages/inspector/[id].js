import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getInspector, setInspector, addInspector} from '../../src/gql/inspector'
import inspectorStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { useRouter } from 'next/router'
import Router from 'next/router'
import TextField from '@material-ui/core/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as snackbarActions from '../../redux/actions/snackbar'

const Inspector = React.memo((props) => {
    const classes = inspectorStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    let [name, setName] = useState(data.object?data.object.name:'');
    let [login, setLogin] = useState(data.object?data.object.user.login:'');
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };
    let [password, setPassword] = useState('');
    const router = useRouter()
    return (
        <App pageName='Инспектор'>
            <Head>
                <title>Инспектор</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Инспектор' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/inspector/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/inspector/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                {
                    router.query.id==='new'||data.object!==null?
                        <>
                        <TextField
                            label='имя'
                            type='login'
                            className={classes.input}
                            margin='normal'
                            value={name}
                            onChange={(event)=>setName(event.target.value)}
                        />
                        <TextField
                            label='login'
                            type='login'
                            className={classes.input}
                            margin='normal'
                            value={login}
                            onChange={(event)=>setLogin(event.target.value)}
                        />
                        <br/>
                        <Input
                            placeholder='Новый пароль'
                            autoComplete='new-password'
                            type={hide ? 'password' : 'text' }
                            value={password}
                            onChange={(event)=>{setPassword(event.target.value)}}
                            className={classes.input}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                        {hide ? <VisibilityOff />:<Visibility />  }
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    if(router.query.id==='new') {
                                        if(login&&name&&password.length>7)
                                            await addInspector({login, password, phone: '', name})
                                        else
                                            showSnackBar('Заполните все данные')
                                    }
                                    else {
                                        let element = {_id: data.object._id}
                                        if (name !== data.object.name) element.name = name
                                        if (login !== data.object.user.login) element.login = login
                                        if (password.length > 7) element.password = password
                                        await setInspector(element)
                                    }
                                    Router.push('/inspectors')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true);
                            }} className={classes.button}>
                                {router.query.id==='new'?'Добавить':'Сохранить'}
                            </Button>
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

Inspector.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['главинспектор', 'admin'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object: ctx.query.id==='new'?null:await getInspector({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        inspector: state.inspector,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspector);