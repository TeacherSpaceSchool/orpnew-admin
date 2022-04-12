import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import drawerStyle from '../../src/styleMUI/drawer'
import * as appActions from '../../redux/actions/app'
import Drawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import StorageIcon from '@material-ui/icons/Storage';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import Collapse from '@material-ui/core/Collapse';

const MyDrawer = React.memo((props) => {
    const { classes } = props
    const { drawer, isMobileApp } = props.app;
    const { profile } = props.user;
    const { showDrawer } = props.appActions;
    let variant = isMobileApp?'temporary' : 'permanent';
    const open = isMobileApp?drawer:true;
    const router = useRouter();
    let [uncover, setUncover] = useState(
        (router.pathname.includes('region')||router.pathname.includes('point')||router.pathname.includes('inspector')&&!router.pathname.includes('checklistinspector')&&!router.pathname.includes('actinspector')||router.pathname.includes('realizator')&&!router.pathname.includes('otchetrealizatora')||router.pathname.includes('organizator')&&!router.pathname.includes('otchetorganizatora')||router.pathname.includes('price')||router.pathname.includes('specialprice')||router.pathname.includes('tara'))?
            'Данные'
            :
            router.pathname.includes('otchetrealizatora')||router.pathname.includes('otchetorganizatora')||router.pathname.includes('nakladnayasklad2')||router.pathname.includes('nakladnayasklad1')||router.pathname.includes('nakladnayanavecherniyvozvrat')||router.pathname.includes('nakladnayanapustuytaru')?
                'Накладные'
                :
                router.pathname.includes('actinspector')||router.pathname.includes('checklistinspector')?
                    'Инспекция'
                    :
                    router.pathname.includes('plan')||router.pathname.includes('error')||router.pathname.includes('statistic')||router.pathname.includes('reiting')||router.pathname.includes('geo')?
                        'Статистика'
                        :
                        ''
    );
    const handleUncover = (item)=>{
        if(uncover===item)item = ''
        setUncover(item)
    }
    return (
        <Drawer
            disableSwipeToOpen = {true}
            disableBackdropTransition = {true}
            onOpen={()=>showDrawer(true)}
            disableDiscovery={true}
            variant= {variant}
            className={classes.drawer}
            open={open}
            onClose={()=>showDrawer(false)}
            classes={{paper: classes.drawerPaper,}}
        >
            {
                isMobileApp?
                    null
                    :
                    <div className={classes.toolbar}/>
            }
            {
                profile.role?
                    <List>
                        <Divider />
                        {
                            ['admin', 'организатор', 'главинспектор'].includes(profile.role)?
                                <>
                                <ListItem style={{background: router.pathname.includes('region')||router.pathname.includes('point')||router.pathname.includes('realizator')&&!router.pathname.includes('otchetrealizatora')||router.pathname.includes('inspector')&&!router.pathname.includes('checklistinspector')&&!router.pathname.includes('actinspector')||router.pathname.includes('organizator')&&!router.pathname.includes('otchetorganizatora')||router.pathname.includes('price')||router.pathname.includes('specialprice')||router.pathname.includes('tara')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('Данные');}}>
                                    <ListItemIcon><StorageIcon color='inherit'/></ListItemIcon>
                                    <ListItemText primary='Данные' />
                                    <ListItemIcon>{uncover==='Данные'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        <Collapse in={uncover==='Данные'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/regions'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('region')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Регионы' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/points'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('point')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Точки' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/organizators'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('organizator')&&!router.pathname.includes('otchetorganizator')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Организаторы' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/realizators'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('realizator')&&!router.pathname.includes('otchetrealizator')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Реализаторы' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'главинспектор'].includes(profile.role)?
                                        <>
                                        <Link href={'/inspectors'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('inspector')&&!router.pathname.includes('checklistinspector')&&!router.pathname.includes('actinspector')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Инспекторы' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/prices'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('price')&&!router.pathname.includes('specialprice')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Цены' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/specialprices'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('specialprice')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Специальные цены' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/taras'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('tara')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Тары' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                            </List>
                        </Collapse>
                        {
                            ['admin', 'организатор', 'реализатор'].includes(profile.role)?
                                <>
                                <ListItem style={{background: router.pathname.includes('otchetrealizatora')||router.pathname.includes('otchetorganizatora')||router.pathname.includes('nakladnayasklad2')||router.pathname.includes('nakladnayasklad1')||router.pathname.includes('nakladnayanavecherniyvozvrat')||router.pathname.includes('nakladnayanapustuytaru')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('Накладные');}}>
                                    <ListItemIcon><AssignmentIcon color='inherit'/></ListItemIcon>
                                    <ListItemText primary='Накладные' />
                                    <ListItemIcon>{uncover==='Накладные'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        <Collapse in={uncover==='Накладные'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/nakladnayanavecherniyvozvrats'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('nakladnayanavecherniyvozvrat')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Накладные на вечерний возврат' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/nakladnayanapustuytarus'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('nakladnayanapustuytaru')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Накладные на пустую тару' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/nakladnayasklad1s'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('nakladnayasklad1')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Накладные склад №1' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/nakladnayasklad2s'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('nakladnayasklad2')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Накладные склад №2' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/otchetorganizatoras'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('otchetorganizatora')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Отчеты организатора' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                <Link href={`/otchetrealizatora${profile.role==='реализатор'?'/[id]':'s'}`} as={`/otchetrealizatora${profile.role==='реализатор'?'/new':'s'}`}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('otchetrealizatora')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary={`Отчет${profile.role==='реализатор'?'':'ы'} реализатора`} />
                                    </ListItem>
                                </Link>
                                <Divider/>
                            </List>
                        </Collapse>
                        {
                            ['admin', 'главинспектор', 'инспектор'].includes(profile.role)?
                                <>
                                <ListItem style={{background: router.pathname.includes('actinspector')||router.pathname.includes('checklistinspector')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('Инспекция');}}>
                                    <ListItemIcon><AssignmentTurnedInIcon color='inherit'/></ListItemIcon>
                                    <ListItemText primary='Инспекция' />
                                    <ListItemIcon>{uncover==='Инспекция'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        <Collapse in={uncover==='Инспекция'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                <Link href={'/checklistinspectors'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('checklistinspector')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='Чек-лист инспектора' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                <Link href={'/actinspectors'}>
                                    <ListItem style={{marginLeft: 16, background: router.pathname.includes('actinspector')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary='АКТ инспектора' />
                                    </ListItem>
                                </Link>
                                <Divider/>
                            </List>
                        </Collapse>
                        {
                            ['admin', 'организатор', 'реализатор'].includes(profile.role)?
                                <>
                                <ListItem style={{background: router.pathname.includes('plan')||router.pathname.includes('error')||router.pathname.includes('statistic')||router.pathname.includes('reiting')||router.pathname.includes('geo')?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('Статистика');}}>
                                    <ListItemIcon><AssessmentIcon color='inherit'/></ListItemIcon>
                                    <ListItemText primary='Статистика' />
                                    <ListItemIcon>{uncover==='Статистика'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        <Collapse in={uncover==='Статистика'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/plans'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('plan')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Планы' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/statistic'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('statistic')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Статистика' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'организатор', 'реализатор'].includes(profile.role)?
                                        <>
                                        <Link href={'/geo'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('geo')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Геолокация' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/errors'}>
                                            <ListItem style={{marginLeft: 16, background: router.pathname.includes('error')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary='Сбои' />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                            </List>
                        </Collapse>
                        <Link href={'/faq'}>
                            <ListItem style={{background: router.pathname==='/faq'?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('');showDrawer(false)}}>
                                <ListItemIcon><QuestionAnswerIcon color='inherit'/></ListItemIcon>
                                <ListItemText primary='FAQ' />
                            </ListItem>
                        </Link>
                        <Divider/>
                        <Link href={'/'}>
                            <ListItem style={{background: router.pathname==='/'?'#f5f5f5':'#ffffff'}} button onClick={()=>{handleUncover('');showDrawer(false)}}>
                                <ListItemIcon><ArtTrackIcon color='inherit'/></ListItemIcon>
                                <ListItemText primary='Новости' />
                            </ListItem>
                        </Link>
                        <Divider/>
                    </List>
                    :
                    null
            }
        </Drawer>
    )
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    }
}

MyDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(drawerStyle)(MyDrawer))