import React, {useState, useRef} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import cardFaqStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { deleteFaq, addFaq, setFaq } from '../src/gql/faq'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import PdfViewer from '../components/dialog/PdfViewer'
import VideoViewer from '../components/dialog/VideoViewer'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

const CardFaq = React.memo((props) => {
    const classes = cardFaqStyle();
    const { element, setList, list, idx } = props;
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    //addCard
    let [file, setFile] = useState(undefined);
    let handleChangeFile = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setFile(event.target.files[0])
            setUrl(URL.createObjectURL(event.target.files[0]))
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [name, setName] = useState(element&&element.title?element.title:'');
    let [video, setVideo] = useState(element&&element.video?element.video:'');
    let handleVideo =  (event) => {
        setVideo(event.target.value)
    };
    let [url, setUrl] = useState(element&&element.url?element.url:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let _roles = ['организатор', 'реализатор', 'инспектор', 'главинспектор']
    let [roles, setRoles] = useState(element&&element.typex?element.typex:[]);
    let handleRoles =  (event) => {
        setRoles(event.target.value)
    };
    const { setMiniDialog, showMiniDialog, showFullDialog, setFullDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let faqRef = useRef(null);
    return (
        <>
        {
            'admin'===profile.role?
                <Card className={isMobileApp?classes.cardM:classes.cardD}>
                    <CardContent>
                        <FormControl className={classes.input}>
                            <InputLabel>Роли</InputLabel>
                            <Select
                                multiple
                                value={roles}
                                onChange={handleRoles}
                                input={<Input/>}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 500,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {_roles.map((role) => (
                                    <MenuItem key={role} value={role}
                                              style={{background: roles.includes(role) ? '#f5f5f5' : '#ffffff'}}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <TextField
                            label='Название'
                            value={name}
                            className={classes.input}
                            onChange={handleName}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <br/>
                        <br/>
                        <TextField
                            label='Видео'
                            value={video}
                            className={classes.input}
                            onChange={handleVideo}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <br/>
                        <br/>
                        <div className={classes.row}>
                            <Button size='small' color={file?'primary':'secondary'} onClick={async()=>{faqRef.current.click()}}>
                                Загрузить инструкцию
                            </Button>
                            {
                                url?
                                    <Button onClick={async()=> {
                                        setFullDialog(element.title, <PdfViewer pdf={url}/>)
                                        showFullDialog(true)
                                    }} size='small' color='primary'>
                                        Прочитать инструкцию
                                    </Button>
                                    :
                                    null
                            }
                        </div>
                    </CardContent>
                    <CardActions>
                        {
                            element!==undefined?
                                <>
                                <Button onClick={async()=>{
                                    let editElement = {_id: element._id}
                                    if(name.length>0&&name!==element.title)editElement.title = name
                                    if(video!==element.video)editElement.video = video
                                    if(file!==undefined)editElement.file = file
                                    if(JSON.stringify(roles)!==JSON.stringify(element.typex))editElement.typex = roles
                                    const action = async() => {
                                        await setFaq(editElement)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} size='small' color='primary'>
                                    Сохранить
                                </Button>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await deleteFaq(element._id)
                                        let _list = [...list]
                                        _list.splice(idx, 1)
                                        setList(_list)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} size='small' color='secondary'>
                                    Удалить
                                </Button>
                                </>
                                :
                                <Button onClick={async()=> {
                                    if (name.length > 0) {
                                        const action = async() => {
                                            setList([
                                                await addFaq({typex: roles, video: video, file: file, title: name}),
                                                ...list
                                            ])
                                        }
                                        setFile(undefined)
                                        setName('')
                                        setRoles([])
                                        setVideo('')
                                        setUrl('')
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    } else {
                                        showSnackBar('Заполните все поля')
                                    }
                                }} size='small' color='primary'>
                                    Добавить
                                </Button>
                        }
                    </CardActions>
                    <input
                        accept='application/pdf'
                        style={{ display: 'none' }}
                        ref={faqRef}
                        type='file'
                        onChange={handleChangeFile}
                    />
                </Card>
                :
                element!==undefined?
                    <Card className={isMobileApp?classes.cardM:classes.cardD}>
                        <CardActionArea>
                            <CardContent>
                                <h3 className={classes.input}>
                                    {element.title}
                                </h3>
                                {
                                    video?
                                        <>
                                        <br/>
                                        <Button onClick={async()=> {
                                            setFullDialog(element.title, <VideoViewer video={element.video}/>)
                                            showFullDialog(true)
                                        }} size='small' color='primary'>
                                            Просмотреть видео инструкцию
                                        </Button>
                                        </>
                                        :
                                        null
                                }
                                {
                                    url?
                                        <>
                                        <br/>
                                        <br/>
                                        <Button onClick={async()=> {
                                            setFullDialog(element.title, <PdfViewer pdf={url}/>)
                                            showFullDialog(true)
                                        }} size='small' color='primary'>
                                            Прочитать инструкцию
                                        </Button>
                                        </>
                                        :
                                        null
                                }
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    :null
        }</>
    );
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardFaq)