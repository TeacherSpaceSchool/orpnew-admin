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
import AutocomplectOnline from '../app/AutocomplectOnline'

const SetRealizator =  React.memo(
    (props) =>{
        const { classes, realizators } = props;
        const { setRealizator } = props.appActions;
        const { showMiniDialog } = props.mini_dialogActions;
        let [realizatorChange, setRealizatorChange] = useState(undefined)
        return (
            <div className={classes.main}>
                <AutocomplectOnline setElement={setRealizatorChange} getElements={async (search)=>{
                    let _realizators = []
                    if(search.length>2)
                        _realizators = realizators.filter(element=>{return element.name.toLowerCase().includes(search)})
                    return _realizators
                }} label={'реализатора'} minLength={0}/>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(realizatorChange)
                            await setRealizator(realizatorChange)
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

SetRealizator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetRealizator));