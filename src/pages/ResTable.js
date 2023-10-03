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
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

export default function ResTable(props) {

    const [resData, setResData] = React.useState([]);
    const [columnArr, setColumnArr] = React.useState([]);

    var result = props.dataResult;
    var arrColumn = props.columnTable;

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
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    }

    React.useEffect(() => {
        /*async function fillToTable () {
        await setColumnArr(arrColumn);
        await setResData(result);
        }

        fillToTable()*/
    }, [])

    return (
        <Paper>
            {
                (arrColumn.length === 0)
                    ?
                    <LinearProgress />
                    :
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={12}>
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="simple table"
                                    size="small"
                                >
                                    <TableHead>
                                        <TableRow>
                                            { getHeader(result) }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { getRows(result) }
                                    </TableBody>
                                </Table>
                            </TableContainer>
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