import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import cardTableStyle from '../../src/styleMUI/card'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect } from 'react-redux'

const TableShow =  React.memo(
    (props) =>{
        const router = useRouter();
        const classes = cardTableStyle();
        const { search, isMobileApp } = props.app;
        const { columns, rows } = props;
        return (
            <TableContainer component={Paper} className={isMobileApp?classes.tableM:classes.tableD}>
                <Table size='small'>
                    <TableHead>
                        <TableRow className={classes.tableRow}>
                            <TableCell>№</TableCell>
                            {columns.map((column, idx) => <TableCell key={`column${idx}`}>{column}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) =>
                            row.href?
                                <Link href={row.href?row.href:'#'} as={row.href?row.as:'#'} key={`row${idx}`}>
                                    <TableRow className={classes.tableRow} onClick={()=>{
                                        if(row.href&&!search) {
                                            let appBody = (document.getElementsByClassName('App-body'))[0]
                                            sessionStorage.scrollPostionStore = appBody.scrollTop
                                            sessionStorage.scrollPostionName = router.asPath
                                            sessionStorage.scrollPostionLimit = rows.length
                                        }
                                    }}>
                                        <TableCell>
                                            {idx+1}
                                        </TableCell>
                                        {row.values.map((value, idx1) => <TableCell key={`cell${idx}${idx}${idx1}${idx1}`}>{value}</TableCell>)}
                                    </TableRow>
                                </Link>
                                :
                                <TableRow className={classes.tableRow} key={`row${idx}`}>
                                    <TableCell>
                                        {idx+1}
                                    </TableCell>
                                    {row.values.map((value, idx1) => <TableCell key={`cell${idx}${idx1}${idx1}${idx1}`}>{value}</TableCell>)}
                                </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(TableShow);