import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import * as XLSX from 'xlsx';

export default function ResTable(props) {

    const [resData, setResData] = React.useState([]);
    const [columnArr, setColumnArr] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [order, setOrder] = React.useState('');
    const [orderBy, setOrderBy] = React.useState('');

    var result = props.dataResult;
    var arrColumn = props.columnTable;
    var reportName = props.report;

    function getHeader(data) {
        return Object.keys(data[0]).map(key => {
            return <TableCell>{ key.toUpperCase() }</TableCell>
        });
    }

    function getRows(data) {
        return data.map(obj => {
            return <TableRow>{ getCells(obj) }</TableRow>
        });
    }

    function getCells(obj) {
        return Object.values(obj).map(value => {
            return <TableCell>{ value }</TableCell>
        });
    }

    const downloadExcel = (data) => {
        let dtime = new Date();
        let name = reportName + '_' + dtime + ".xlsx";
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - result.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            result.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            )
        //,[order, orderBy, page, rowsPerPage],
    );

    React.useEffect(() => {
        /*async function fillToTable () {
        await setColumnArr(arrColumn);
        await setResData(result);
        }

        fillToTable()*/
        //console.log()
    }, [])

    return (
        <Paper>
            {
                (result.length === 0)
                    ?
                    <Alert severity="warning" sx={{ width: '100%' }}>
                        Empty Result
                    </Alert>
                    :
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={12}>
                            <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <TableContainer sx={{ overflowX: 'initial' }}>
                                <Table
                                    sx={{ minWidth: 750 }}
                                    stickyHeader
                                    aria-label="sticky table"
                                    size="small"
                                >
                                    <TableHead>
                                        <TableRow>
                                            { getHeader(result) }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                         {getRows(visibleRows) }
                                    </TableBody>
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 33 * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 25]}
                                    component="div"
                                    count={result.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                >
                                </TablePagination>
                            </Paper>
                        </Grid>
                        <Grid item xs={4} md={4}>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <Button
                                variant="contained"
                                onClick={() => downloadExcel(result)}
                            >
                                Download
                            </Button>
                        </Grid>
                    </Grid>
            }
        </Paper>
        );
}