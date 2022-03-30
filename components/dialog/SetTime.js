import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as appActions from '../../redux/actions/app'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { pdHHMM } from '../../src/lib'

const SetTime =  React.memo(
    (props) =>{
        const { classes, setTimeString } = props;
        let [timeChange, setTimeChange] = useState(pdHHMM(new Date()));
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
                <TextField
                    style={{width: width}}
                    className={classes.textField}
                    label='Время'
                    type='time'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={timeChange}
                    onKeyPress={async event => {
                        if (event.key === 'Enter'){
                            await setTimeString(timeChange)
                            showMiniDialog(false);
                        }
                    }}
                    inputProps={{
                        'aria-label': 'description',
                    }}
                    onChange={ event => setTimeChange(event.target.value) }
                />
                <br/>
                <div>
                    <Button variant="contained" color="primary" onClick={async()=>{
                        await setTimeString(timeChange)
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant="contained" color="secondary" onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

SetTime.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetTime));