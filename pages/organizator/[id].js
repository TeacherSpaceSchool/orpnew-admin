import initialApp from '../../src/initialApp'
import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getOrganizator, setOrganizator} from '../../src/gql/organizator'
import organizatorStyle from '../../src/styleMUI/list'
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
import {getRegions} from '../../src/gql/region';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Organizator = React.memo((props) => {
    const classes = organizatorStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    let [login, setLogin] = useState(data.object.user.login);
    let [region, setRegion] = useState(data.object.region);
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };
    let [password, setPassword] = useState('');
    const router = useRouter()
    return (
        <App pageName='Организатор'>
            <Head>
                <title>Организатор</title>
                <meta name='description' content='ORP-SHORO' />
                <meta property='og:title' content='Организатор' />
                <meta property='og:description' content='ORP-SHORO' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/organizator/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/organizator/${router.query.id}`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                {
                    data.object!==null?
                        <>
                        <TextField
                            label='имя'
                            type='login'
                            className={classes.input}
                            margin='normal'
                            value={data.object.name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <Autocomplete
                            options={data.regions}
                            value={region}
                            onChange={(event, newValue) => {
                                setRegion(newValue);
                            }}
                            className={classes.input}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label='Регион' />}
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
                                    let element = {_id: data.object._id}
                                    if (login!==data.object.user.login) element.login = login
                                    if (password.length>7) element.password = password
                                    if (region&&region._id!==data.object.region._id) {
                                        element.region = region._id
                                        element.guidRegion = region.guid
                                    }
                                    await setOrganizator(element)
                                    Router.push('/organizators')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true);
                            }} className={classes.button}>
                                Сохранить
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

Organizator.getInitialProps = async function(ctx) {
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
            object: await getOrganizator({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            regions: await getRegions({free: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        organizator: state.organizator,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizator);