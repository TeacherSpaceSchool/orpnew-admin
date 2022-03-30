import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as appActions from '../../redux/actions/app'
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const SetPoint =  React.memo(
    (props) =>{
        const { classes, points } = props;
        const { setPoint } = props.appActions;
        const { showMiniDialog } = props.mini_dialogActions;
        let [pointChange, setPointChange] = useState(undefined);
        return (
            <div className={classes.main}>
                <Autocomplete
                    options={points}
                    value={pointChange}
                    onChange={(event, newValue) => {
                        setPointChange(newValue);
                    }}
                    className={classes.input}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label='Выберите точку' />}
                />
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(pointChange)
                            await setPoint(pointChange)
                        showMiniDialog(false);
                    }} className={classes.button}>
                        Сохранить
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
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

SetPoint.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetPoint));