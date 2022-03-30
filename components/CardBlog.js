import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import cardPageListStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import { pdDDMMYYYY } from '../src/lib'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { deleteBlog, addBlog } from '../src/gql/blog'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'


const CardBlog = React.memo((props) => {
    const classes = cardPageListStyle();
    const { element, setList, list, idx} = props;
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    //addCard
    let [preview, setPreview] = useState(element?element.image:'/static/add.png');
    let [image, setImage] = useState(undefined);
    let handleChangeImage = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setImage(event.target.files[0])
            setPreview(URL.createObjectURL(event.target.files[0]))
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [title, setTitle] = useState(element?element.title:'');
    let handleTitle =  (event) => {
        setTitle(event.target.value)
    };
    let [text, setText] = useState(element?element.text:'');
    let handleText =  (event) => {
        setText(event.target.value)
    };
    let [url, setUrl] = useState(element?element.url:'');
    let handleUrl =  (event) => {
        setUrl(event.target.value)
    };
    let date = pdDDMMYYYY(element?new Date(element.createdAt):new Date())
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    let [all, setAll] = useState(false);
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            {
                'admin'===profile.role&&!element?
                    <>
                    <CardHeader
                        subheader={date}
                    />
                    <CardActionArea>
                        <label htmlFor={element?element._id:'add'}>
                            <img
                                className={isMobileApp?classes.mediaM:classes.mediaD}
                                src={preview}
                                alt={'Изменить'}
                            />
                        </label>
                        <CardContent>
                            <TextField
                                style={{width: '100%'}}
                                label='Заголовок'
                                value={title}
                                className={classes.input}
                                onChange={handleTitle}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                            <br/>
                            <TextField
                                multiline={true}
                                style={{width: '100%'}}
                                label='Текст'
                                value={text}
                                className={classes.input}
                                onChange={handleText}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                            <br/>
                            <TextField
                                style={{width: '100%'}}
                                label='Ссылка'
                                value={url}
                                className={classes.input}
                                onChange={handleUrl}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={async()=> {
                            if (image !== undefined && text.length > 0 && title.length > 0) {
                                setImage(undefined)
                                setPreview('/static/add.png')
                                setTitle('')
                                setText('')
                                setUrl('')
                                const action = async() => {
                                    setList([
                                        await addBlog({image, text, title, url}),
                                        ...list
                                    ])
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            } else {
                                showSnackBar('Заполните все поля')
                            }
                        }
                        } size='small' color='primary'>
                            Добавить
                        </Button>
                    </CardActions>
                    <input
                        accept='image/*'
                        style={{ display: 'none' }}
                        id={element?element._id:'add'}
                        type='file'
                        onChange={handleChangeImage}
                    />
                    </>
                    :
                    element!==undefined?
                        <>
                            <img
                                className={isMobileApp?classes.mediaM:classes.mediaD}
                                src={element.image}
                                alt={element.title}
                            />
                            <div className={classes.shapka}>
                                <div className={classes.title}>{element.title}</div>
                                <div className={classes.date}>{date}</div>
                            </div>
                            {all?
                                <div style={{fontSize: '1rem', margin: 20, whiteSpace: 'pre-wrap'}}>
                                    {element.text}
                                </div>
                                :
                                null
                            }
                        <CardActions>
                            <Button onClick={async()=> {
                                setAll(!all)
                            }} size='small' color='primary'>
                                {all?'Свернуть':'Посмотреть полностью'}
                            </Button>
                            {
                                url?
                                    <a target='_blank' href={url}>
                                        <Button size='small' color='primary'>
                                            Ссылка
                                        </Button>
                                    </a>
                                    :
                                    null
                            }
                            {
                                'admin'===profile.role?
                                    <Button onClick={async()=>{
                                        const action = async() => {
                                            await deleteBlog(element._id)
                                            let _list = [...list]
                                            _list.splice(idx, 1)
                                            setList(_list)
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }} size='small' color='secondary'>
                                        Удалить
                                    </Button>
                                    :
                                    null
                            }
                        </CardActions>
                        </>
                        :null
            }
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardBlog)