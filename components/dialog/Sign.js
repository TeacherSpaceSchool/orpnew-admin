import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as userActions from '../../redux/actions/user'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const Sign =  React.memo(
    (props) =>{
        let [loginEnter, setLoginEnter] = useState('');
        let [passEnter, setPassEnter] = useState('');
        let handlePassEnter =  (event) => {
            setPassEnter(event.target.value)
        };
        let handleLoginEnter =  (event) => {
            setLoginEnter(event.target.value)
        };
        let [hide, setHide] = useState('password');
        let handleHide =  () => {
            setHide(!hide)
        };
        const { error } = props.user;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { signin } = props.userActions;
        const { classes } = props;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main} style={{width: width}}>
                <TextField
                    id='standard-search'
                    label='Логин'
                    type='login'
                    className={classes.input}
                    margin='normal'
                    value={loginEnter}
                    onChange={handleLoginEnter}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            if(loginEnter.length>0&&passEnter.length>0)
                                signin({login: loginEnter, password: passEnter})
                            else
                                document.getElementById('adornment-password').focus()
                        }
                    }}
                />
                <br/>
                <FormControl className={classNames(classes.margin, classes.input)}>
                    <InputLabel htmlFor='adornment-password'>Пароль</InputLabel>
                    <Input
                        id='adornment-password'
                        type={hide ? 'password' : 'text' }
                        value={passEnter}
                        onChange={handlePassEnter}
                        onKeyPress={event => {
                            if (event.key === 'Enter'&&loginEnter.length>0&&passEnter.length>0)
                                signin({login: loginEnter, password: passEnter})
                        }}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                    {hide ? <VisibilityOff />:<Visibility />  }
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <br/>
                {
                    error?
                        <div className={classes.error_message}>Неверный логин или пароль</div>
                        :
                        null
                }
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(loginEnter.length>0&&passEnter.length>0)
                            signin({login: loginEnter, password: passEnter})
                    }} className={classes.button}>
                        Войти
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Sign));