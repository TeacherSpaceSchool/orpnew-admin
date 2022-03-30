import React, {useState, useEffect, useRef} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import cardStyle from '../../src/styleMUI/card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import Info from '@material-ui/icons/Info';

const AutocomplectOnline = React.memo((props) => {
    const classes = cardStyle();
    const {setElement, getElements, label, defaultValue, autoRef, dialogAddElement, size, variant, redirect} = props;
    const focus = useRef(false);
    const [inputValue, setInputValue] = React.useState(defaultValue?defaultValue.name?defaultValue.name:defaultValue.number?defaultValue.number:'':'');
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async()=>{
            if (!focus.current||inputValue.length<3) {
                setElements([]);
                if(open)
                    setOpen(false)
                if(loading)
                    setLoading(false)
            }
            else {
                if(!loading)
                    setLoading(true)
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    setElements(await getElements(inputValue))
                    if(!open)
                        setOpen(true)
                    setLoading(false)
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    }, [inputValue]);
    const handleChange = event => {
        focus.current = true
        setInputValue(event.target.value);
    };
    let [elements, setElements] = useState([]);

    return (
        <Autocomplete
            ref={autoRef}
            defaultValue={defaultValue}
            onClose={()=>setOpen(false)}
            open={open}
            size={size?size:'medium'}
            inputValue={inputValue}
            disableOpenOnFocus
            className={classes.input}
            options={elements}
            getOptionLabel={option => option.name?option.name:option.number}
            onChange={(event, newValue) => {
                focus.current = false
                if(dialogAddElement&&typeof newValue === 'string') {
                    setTimeout(() => {
                        setMiniDialog('Добавить', dialogAddElement(setElement, setInputValue, newValue.inputValue))
                        showMiniDialog(true)
                    });
                }
                else if(dialogAddElement&&newValue && newValue.inputValue) {
                    setMiniDialog('Добавить', dialogAddElement(setElement, setInputValue, newValue.inputValue))
                    showMiniDialog(true)
                }
                else {
                    setInputValue(!newValue?'':newValue.name?newValue.name:newValue.number)
                    setElement(newValue)
                }
            }}
            filterOptions={(options, params) => {
                if (dialogAddElement&&params.inputValue.length>2) {
                    options.push({
                        inputValue: params.inputValue,
                        name: `Добавить ${params.inputValue}`
                    });
                }
                return options;
            }}
            noOptionsText='Ничего не найдено'
            renderInput={params => (
                <div className={classes.row}>
                    {
                        redirect?
                            <a href={redirect} target='_blank'>
                                <Info style={{marginRight: 5, cursor: 'pointer'}}/>
                            </a>
                            :
                            null
                    }
                    <TextField {...params} label={`Выбрать ${label}`} fullWidth  variant={variant?variant:'standard'/*'outlined'*/}
                               onChange={handleChange}
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <React.Fragment>
                                           {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                           {params.InputProps.endAdornment}
                                       </React.Fragment>
                                   ),
                               }}
                    />
                </div>
            )}
        />
    )
})

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocomplectOnline);