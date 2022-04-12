import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import Login from '../../icons/login.svg';
import Logout from '../../icons/logout.svg';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as userActions from '../../redux/actions/user'
import * as appActions from '../../redux/actions/app'
import appbarStyle from '../../src/styleMUI/appbar'
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Paper from '@material-ui/core/Paper';
import Cancel from '@material-ui/icons/Cancel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/SearchRounded';
import Sort from '@material-ui/icons/SortRounded';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FilterList from '@material-ui/icons/FilterListRounded';
import DateRange from '@material-ui/icons/DateRange';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Sign from '../dialog/Sign'
import Confirmation from '../dialog/Confirmation'
import SetDate from '../dialog/SetDate'
import SetPoint from '../dialog/SetPoint'
import SetRegion from '../dialog/SetRegion'
import SetInspector from '../dialog/SetInspector'
import SetRealizator from '../dialog/SetRealizator'
import {pdDDMMYY} from '../../src/lib';
import {getRegions} from '../../src/gql/region'
import {getPoints} from '../../src/gql/point'
import {getRealizators} from '../../src/gql/realizator'
import {getInspectors} from '../../src/gql/inspector'

const MyAppBar = React.memo((props) => {
    //props
    const initialRender = useRef(true);
    const classes = appbarStyle();
    const { regionShow, pointShow, realizatorShow, inspectorShow, searchShow, dateShow, pageName, sorts, filters } = props
    const { drawer, search, filter, sort, isMobileApp, date, region, point, realizator, inspector } = props.app;
    const { showDrawer, setSearch, setFilter, setSort, setDate, setPoint, setRegion, setRealizator, setInspector } = props.appActions;
    const { authenticated, profile } = props.user;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { logout } = props.userActions;
    //state
    const [anchorElMobileMenu, setAnchorElMobileMenu] = React.useState(null);
    const openMobileMenu = Boolean(anchorElMobileMenu);
    let handleMobileMenu = (event) => {
        setAnchorElMobileMenu(event.currentTarget);
    }
    let handleCloseMobileMenu = () => {
        setAnchorElMobileMenu(null);
    }
    const [anchorElSort, setAnchorElSort] = useState(null);
    const openSort = Boolean(anchorElSort);
    let handleMenuSort = (event) => {
        setAnchorElSort(event.currentTarget);
    }
    let handleCloseSort = () => {
        setAnchorElSort(null);
    }
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const openFilter = Boolean(anchorElFilter);
    let handleMenuFilter = (event) => {
        setAnchorElFilter(event.currentTarget);
    }
    let handleCloseFilter = () => {
        setAnchorElFilter(null);
    }
    const [anchorElDate, setAnchorElDate] = useState(null);
    const openDate = Boolean(anchorElDate);
    let handleMenuDate = (event) => {
        setAnchorElDate(event.currentTarget);
    }
    let handleCloseDate = () => {
        setAnchorElDate(null);
    }
    const [anchorElPoints, setAnchorElPoints] = useState(null);
    const openPoints = Boolean(anchorElPoints);
    let handleMenuPoints = (event) => {
        setAnchorElPoints(event.currentTarget);
    }
    let handleClosePoints = () => {
        setAnchorElPoints(null);
    }
    const [anchorElRealizators, setAnchorElRealizators] = useState(null);
    const openRealizators = Boolean(anchorElRealizators);
    let handleMenuRealizators = (event) => {
        setAnchorElRealizators(event.currentTarget);
    }
    let handleCloseRealizators = () => {
        setAnchorElRealizators(null);
    }
    const [anchorElInspectors, setAnchorElInspectors] = useState(null);
    const openInspectors = Boolean(anchorElInspectors);
    let handleMenuInspectors = (event) => {
        setAnchorElInspectors(event.currentTarget);
    }
    let handleCloseInspectors = () => {
        setAnchorElInspectors(null);
    }
    const [anchorElRegions, setAnchorElRegions] = useState(null);
    const openRegions = Boolean(anchorElRegions);
    let handleMenuRegions = (event) => {
        setAnchorElRegions(event.currentTarget);
    }
    let handleCloseRegions = () => {
        setAnchorElRegions(null);
    }
    const [openSearch, setOpenSearch] = useState(false);
    let handleSearch = (event) => {
        setSearch(event.target.value)
    };
    useEffect(()=>{
        if(initialRender.current) {
            initialRender.current = false;
        } else {
            if (document.getElementById('search'))
                document.getElementById('search').focus();
        }
    },[openSearch])
    return (
        <div className={classes.root}>
            <AppBar position='fixed' className='appBar'>
                <Toolbar>
                    {
                        authenticated?
                            <IconButton
                                edge='start'
                                aria-owns='menu-appbar'
                                aria-haspopup='true'
                                onClick={() => {showDrawer(!drawer)}}
                                color='inherit'
                            >
                                <MenuIcon/>
                            </IconButton>
                            :
                            null
                    }
                    <Typography onClick={() => {showDrawer(!drawer)}} variant='h6' className={classes.title}>
                        {pageName}
                    </Typography>
                    {isMobileApp?
                        openSearch?
                            <Paper className={classes.searchM}>
                                <Input className={classes.searchField}
                                       id='search'
                                       type={'login'}
                                       value={search}
                                       onChange={handleSearch}
                                       endAdornment={
                                           <InputAdornment position='end'>
                                               <IconButton aria-label='Search' onClick={()=>{setSearch('');setOpenSearch(false)}}>
                                                   <Cancel />
                                               </IconButton>
                                           </InputAdornment>
                                       }/>
                            </Paper>
                            :
                            <>
                            {
                                authenticated&&(regionShow||pointShow||inspectorShow||realizatorShow||dateShow||searchShow||filters||sorts)?
                                    <IconButton
                                        style={{background: date||filter||region&&regionShow||point&&pointShow||inspector&&inspectorShow||realizator&&realizatorShow?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openMobileMenu ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMobileMenu}
                                        color='inherit'
                                    >
                                        <Search />
                                    </IconButton>
                                    :
                                    null
                            }
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorElMobileMenu}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                open={openMobileMenu}
                                onClose={handleCloseMobileMenu}
                            >
                                {
                                    searchShow?
                                        <MenuItem key='search' onClick={()=>{
                                            setOpenSearch(true);handleCloseMobileMenu()
                                        }}>
                                            <div style={{display: 'flex'}}>
                                                <Search/>&nbsp;Поиск
                                            </div>
                                        </MenuItem>
                                        :
                                        null
                                }
                                {filters&&filters.length>0?
                                    [
                                        <MenuItem
                                            key='filterMenu'
                                            style={{background: filter?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                            onClick={handleMenuFilter}
                                        >
                                            <div style={{display: 'flex'}}>
                                                <FilterList/>&nbsp;{filter.length?filter:'Фильтр'}
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='filter'
                                            id='menu-appbar'
                                            anchorEl={anchorElFilter}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={openFilter}
                                            onClose={handleCloseFilter}
                                        >
                                            {filters.map((elem, idx)=><MenuItem key={'filter'+idx} style={{background: filter===elem.value?'rgba(51, 143, 255, 0.29)': '#fff'}}  onClick={()=>{setFilter(elem.value);handleCloseFilter();handleCloseMobileMenu();}}>{elem.name}</MenuItem>)}
                                        </Menu>
                                    ]
                                    :null
                                }
                                {sorts&&sorts.length>0?
                                    [
                                        <MenuItem key='sortMenu' onClick={handleMenuSort}>
                                            <div style={{display: 'flex'}}>
                                                <Sort/>&nbsp;Сортировка
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='sort'
                                            id='menu-appbar'
                                            anchorEl={anchorElSort}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={openSort}
                                            onClose={handleCloseSort}
                                        >
                                            {sorts.map((elem, idx)=><MenuItem key={'sort'+idx} onClick={()=>{sort===`-${elem.field}`?setSort(elem.field):setSort(`-${elem.field}`);handleCloseSort();handleCloseMobileMenu()}}>{sort===`-${elem.field}`?<ArrowDownward />:sort===elem.field?<ArrowUpward />:<div style={{width: '24px'}}/>}{elem.name}</MenuItem>)}
                                        </Menu>
                                    ]
                                    :null
                                }
                                {dateShow?
                                    [
                                        <MenuItem key='dateMenu' style={{background: date?'rgba(51, 143, 255, 0.29)':'transparent'}} onClick={handleMenuDate}>
                                            <div style={{display: 'flex'}}>
                                                <DateRange/>&nbsp;{date?pdDDMMYY(date):'Дата'}
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='date'
                                            id='menu-appbar'
                                            anchorEl={anchorElDate}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={openDate}
                                            onClose={handleCloseDate}
                                        >
                                            <MenuItem key='onDate' style={{background: date?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setMiniDialog('Дата', <SetDate/>);showMiniDialog(true);handleCloseDate();handleCloseMobileMenu();}}>
                                                По дате
                                            </MenuItem>
                                            <MenuItem key='allDate' style={{background: !date?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setDate('');handleCloseDate();handleCloseMobileMenu();}}>
                                                Все
                                            </MenuItem>
                                        </Menu>
                                    ]
                                    :null
                                }
                                {regionShow&&['главинспектор', 'инспектор', 'организатор', 'admin'].includes(profile.role)?
                                    [
                                        <MenuItem key='regionsMenu' style={{background: region?'rgba(51, 143, 255, 0.29)':'transparent'}} onClick={handleMenuRegions}>
                                            <div style={{display: 'flex'}}>
                                                <LocationCityIcon/>&nbsp;{region?region.name:'Регион'}
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='regions'
                                            id='menu-appbar'
                                            anchorEl={anchorElRegions}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={openRegions}
                                            onClose={handleCloseRegions}
                                        >
                                            <MenuItem key='onRegion' style={{background: region?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const regions = await getRegions({});setMiniDialog('Регион', <SetRegion regions={regions}/>);showMiniDialog(true);handleCloseRegions();handleCloseMobileMenu();}}>
                                                По региону
                                            </MenuItem>
                                            <MenuItem key='allRegions' style={{background: !region?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setRegion(undefined);setPoint(undefined);handleCloseRegions();handleCloseMobileMenu();}}>
                                                Все
                                            </MenuItem>
                                        </Menu>
                                    ]
                                    :null
                                }
                                {region&&pointShow&&['главинспектор', 'инспектор', 'организатор', 'admin'].includes(profile.role)?
                                    [
                                        <MenuItem key='pointsMenu' style={{background: point?'rgba(51, 143, 255, 0.29)':'transparent'}} onClick={handleMenuPoints}>
                                            <div style={{display: 'flex'}}>
                                                <LocationOnIcon/>&nbsp;{point?point.name:'Точка'}
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='points'
                                            id='menu-appbar'
                                            anchorEl={anchorElPoints}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={openPoints}
                                            onClose={handleClosePoints}
                                        >
                                            <MenuItem key='onPoints' style={{background: point?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const points = await getPoints({region: region._id});setMiniDialog('Точки', <SetPoint points={points}/>);showMiniDialog(true);handleClosePoints();handleCloseMobileMenu();}}>
                                                По точке
                                            </MenuItem>
                                            <MenuItem key='allPoint' style={{background: !point?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setPoint(undefined);handleClosePoints();handleCloseMobileMenu();}}>
                                                Все
                                            </MenuItem>
                                        </Menu>
                                    ]
                                    :null
                                }
                                {realizatorShow&&['главинспектор', 'инспектор', 'admin'].includes(profile.role)?
                                    [
                                        <MenuItem key='realizatorsMenu' style={{background: realizator?'rgba(51, 143, 255, 0.29)':'transparent'}} onClick={handleMenuRealizators}>
                                            <div style={{display: 'flex'}}>
                                                <PermIdentityIcon/>&nbsp;{realizator?realizator.name:'Реализатор'}
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='realizators'
                                            id='menu-appbar'
                                            anchorEl={anchorElRealizators}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={openRealizators}
                                            onClose={handleCloseRealizators}
                                        >
                                            <MenuItem key='onRealizators' style={{background: realizator?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const realizators = await getRealizators({...region?{region: region._id}:{}, ...point?{point: point._id}:{}});setMiniDialog('Реализаторы', <SetRealizator realizators={realizators}/>);showMiniDialog(true);handleCloseRealizators();handleCloseMobileMenu();}}>
                                                По реализатору
                                            </MenuItem>
                                            <MenuItem key='allRealizator' style={{background: !realizator?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setRealizator(undefined);handleCloseRealizators();handleCloseMobileMenu();}}>
                                                Все
                                            </MenuItem>
                                        </Menu>
                                    ]
                                    :null
                                }
                                {inspectorShow&&['главинспектор', 'admin'].includes(profile.role)?
                                    [
                                        <MenuItem key='inspectorsMenu' style={{background: inspector?'rgba(51, 143, 255, 0.29)':'transparent'}} onClick={handleMenuInspectors}>
                                            <div style={{display: 'flex'}}>
                                                <PermIdentityIcon/>&nbsp;{inspector?inspector.name:'Инспектор'}
                                            </div>
                                        </MenuItem>,
                                        <Menu
                                            key='inspectors'
                                            id='menu-appbar'
                                            anchorEl={anchorElInspectors}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={openInspectors}
                                            onClose={handleCloseInspectors}
                                        >
                                            <MenuItem key='onInspectors' style={{background: inspector?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const inspectors = await getInspectors({});setMiniDialog('Инспекторы', <SetInspector inspectors={inspectors}/>);showMiniDialog(true);handleCloseInspectors();handleCloseMobileMenu();}}>
                                                По инспектору
                                            </MenuItem>
                                            <MenuItem key='allInspector' style={{background: !inspector?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setInspector(undefined);handleCloseInspectors();handleCloseMobileMenu();}}>
                                                Все
                                            </MenuItem>
                                        </Menu>
                                    ]
                                    :null
                                }
                            </Menu>
                            <IconButton
                                aria-owns='menu-appbar'
                                aria-haspopup='true'
                                color='inherit'
                                onClick={()=> {
                                    if (authenticated) {
                                        const action = async () => logout(true)
                                        setMiniDialog('Выйти?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }
                                    else {
                                        setMiniDialog('Вход', <Sign isMobileApp={isMobileApp}/>)
                                        showMiniDialog(true)
                                    }
                                }}
                            >
                                {authenticated?<Logout/>:<Login/>}
                            </IconButton>
                            </>
                        :
                        openSearch?
                            <Paper className={classes.searchD}>
                                <Input className={classes.searchField}
                                       id='search'
                                       type={'login'}
                                       value={search}
                                       onChange={handleSearch}
                                       endAdornment={
                                           <InputAdornment position='end'>
                                               <IconButton aria-label='Search' onClick={()=>{setSearch('');setOpenSearch(false)}}>
                                                   <Cancel />
                                               </IconButton>
                                           </InputAdornment>
                                       }/>
                            </Paper>
                            :
                            <>
                            {inspectorShow&&['главинспектор', 'admin'].includes(profile.role)?
                                <>
                                <Tooltip title='Инспектор'>
                                    <IconButton
                                        style={{background: inspector?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openInspectors ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuInspectors}
                                        color='inherit'
                                    >
                                        <PermIdentityIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    key='Inspectors'
                                    id='menu-appbar'
                                    anchorEl={anchorElInspectors}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openInspectors}
                                    onClose={handleCloseInspectors}
                                >
                                    <MenuItem style={{background: inspector?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const inspectors = await getInspectors({});setMiniDialog('Инспекторы', <SetInspector inspectors={inspectors}/>);showMiniDialog(true);handleCloseInspectors();}}>
                                        {inspector?inspector.name:'По инспектору'}
                                    </MenuItem>
                                    <MenuItem style={{background: !inspector?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setInspector(undefined);handleCloseInspectors();}}>
                                        Все
                                    </MenuItem>
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {realizatorShow&&['главинспектор', 'инспектор', 'admin'].includes(profile.role)?
                                <>
                                <Tooltip title='Реализатор'>
                                    <IconButton
                                        style={{background: realizator?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openRealizators ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuRealizators}
                                        color='inherit'
                                    >
                                        <PermIdentityIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    key='Realizators'
                                    id='menu-appbar'
                                    anchorEl={anchorElRealizators}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openRealizators}
                                    onClose={handleCloseRealizators}
                                >
                                    <MenuItem style={{background: realizator?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const realizators = await getRealizators({...region?{region: region._id}:{}, ...point?{point: point._id}:{}});setMiniDialog('Реализаторы', <SetRealizator realizators={realizators}/>);showMiniDialog(true);handleCloseRealizators();}}>
                                        {realizator?realizator.name:'По реализатору'}
                                    </MenuItem>
                                    <MenuItem style={{background: !realizator?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setRealizator(undefined);handleCloseRealizators();}}>
                                        Все
                                    </MenuItem>
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {region&&pointShow&&['главинспектор', 'инспектор', 'организатор', 'admin'].includes(profile.role)?
                                <>
                                <Tooltip title='Точка'>
                                    <IconButton
                                        style={{background: point?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openPoints ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuPoints}
                                        color='inherit'
                                    >
                                        <LocationOnIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    key='Points'
                                    id='menu-appbar'
                                    anchorEl={anchorElPoints}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openPoints}
                                    onClose={handleClosePoints}
                                >
                                    <MenuItem style={{background: point?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const points = await getPoints({region: region._id});setMiniDialog('Точки', <SetPoint points={points}/>);showMiniDialog(true);handleClosePoints();}}>
                                        {point?point.name:'По точке'}
                                    </MenuItem>
                                    <MenuItem style={{background: !point?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setPoint(undefined);handleClosePoints();}}>
                                        Все
                                    </MenuItem>
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {regionShow&&['главинспектор', 'инспектор', 'организатор', 'admin'].includes(profile.role)?
                                <>
                                <Tooltip title='Регион'>
                                    <IconButton
                                        style={{background: region?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openRegions ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuRegions}
                                        color='inherit'
                                    >
                                        <LocationCityIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    key='Regions'
                                    id='menu-appbar'
                                    anchorEl={anchorElRegions}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openRegions}
                                    onClose={handleCloseRegions}
                                >
                                    <MenuItem style={{background: region?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={async ()=>{const regions = await getRegions({});setMiniDialog('Регион', <SetRegion regions={regions}/>);showMiniDialog(true);handleCloseRegions();}}>
                                        {region?region.name:'По региону'}
                                    </MenuItem>
                                    <MenuItem style={{background: !region?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setRegion(undefined);setPoint(undefined);handleCloseRegions();}}>
                                        Все
                                    </MenuItem>
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {authenticated&&dateShow?
                                <>
                                <Tooltip title='Дата'>
                                    <IconButton
                                        style={{background: date?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openDate ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuDate}
                                        color='inherit'
                                    >
                                        <DateRange/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    key='Date'
                                    id='menu-appbar'
                                    anchorEl={anchorElDate}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openDate}
                                    onClose={handleCloseDate}
                                >
                                    <MenuItem style={{background: date?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setMiniDialog('Дата', <SetDate/>);showMiniDialog(true);handleCloseDate();}}>
                                        {date?pdDDMMYY(date):'По дате'}
                                    </MenuItem>
                                    <MenuItem style={{background: !date?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setDate('');handleCloseDate();}}>
                                        Все
                                    </MenuItem>
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {authenticated&&filters&&filters.length?
                                <>
                                <Tooltip title='Фильтр'>
                                    <IconButton
                                        style={{background: filter?'rgba(51, 143, 255, 0.29)':'transparent'}}
                                        aria-owns={openFilter ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuFilter}
                                        color='inherit'
                                    >
                                        <FilterList/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id='menu-appbar'
                                    key='filter'
                                    anchorEl={anchorElFilter}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openFilter}
                                    onClose={handleCloseFilter}
                                >
                                    {filters.map((elem, idx)=><MenuItem key={'filter'+idx} style={{background: filter===elem.value?'rgba(51, 143, 255, 0.29)': '#fff'}} onClick={()=>{setFilter(elem.value);handleCloseFilter();}}>{elem.name}</MenuItem>)}
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {authenticated&&sorts&&sorts.length?
                                <>
                                <Tooltip title='Сортировка'>
                                    <IconButton
                                        aria-owns={openSort ? 'menu-appbar' : undefined}
                                        aria-haspopup='true'
                                        onClick={handleMenuSort}
                                        color='inherit'
                                    >
                                        <Sort />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id='menu-appbar'
                                    anchorEl={anchorElSort}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openSort}
                                    onClose={handleCloseSort}
                                    key='sort'
                                >
                                    {sorts.map((elem, idx)=><MenuItem key={'sort'+idx} onClick={()=>{sort===`-${elem.field}`?setSort(elem.field):setSort(`-${elem.field}`);handleCloseSort();}}>{sort===`-${elem.field}`?<ArrowDownward />:sort===elem.field?<ArrowUpward />:<div style={{width: '24px'}}/>}{elem.name}</MenuItem>)}
                                </Menu>
                                &nbsp;
                                </>
                                :null
                            }
                            {
                                authenticated&&searchShow?
                                    <Tooltip title='Поиск'>
                                        <IconButton
                                            aria-owns={openSearch ? 'menu-appbar' : undefined}
                                            aria-haspopup='true'
                                            onClick={()=>{
                                                setOpenSearch(true)}}
                                            color='inherit'
                                        >
                                            <Search />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    null
                            }
                            <Tooltip title={authenticated?'Выйти':'Вход'}>
                                <IconButton
                                    aria-owns='menu-appbar'
                                    aria-haspopup='true'
                                    color='inherit'
                                    onClick={()=> {
                                        if (authenticated) {
                                            const action = async () => logout(true)
                                            setMiniDialog('Выйти?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }
                                        else {
                                            setMiniDialog('Вход', <Sign isMobileApp={isMobileApp}/>)
                                            showMiniDialog(true)
                                        }
                                    }}
                                >
                                    {authenticated?<Logout/>:<Login/>}
                                </IconButton>
                            </Tooltip>
                            </>
                    }
                </Toolbar>
            </AppBar>
        </div>
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
        userActions: bindActionCreators(userActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppBar);
