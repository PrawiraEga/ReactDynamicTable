// "use client"

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Select, InputLabel, MenuItem, TextField, FormControl, Button } from '@mui/material';
import MaxWidthDialog from './MaxWidthDialog';
import DevDialog from './DevDialog';
import { v4 as uuidv4 } from 'uuid';
import { Box, Container, Grid } from '@mui/system';
import { LookupContext } from '../context/LookupContext';
import dataColumns from '../KRP_01.json';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AlertDialog from './AlertDialog';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function columnData(id, fieldName, labelName, colType, isCheck, strSandi, filterCheck, filterVal, metadata) {
    let colName = fieldName.toUpperCase();
    return { id, colName, labelName, colType, isCheck, strSandi, filterCheck, filterVal, metadata };
}

var datColumns = [];
const setColumns = dataColumns.columns;
//console.log(JSON.parse(setColumns));
async function setDatColumns(obj) {
    let columns = [];
    let rowData = null;
    obj.map((row, idx) => {
        rowData = columnData(idx, row.columnName, row.label, row.columnType, false, '', false, '', row.metadata)
        columns.push(rowData)
    });
    datColumns = await columns;
}

setDatColumns(setColumns);


const columns = [
    columnData(uuidv4(), 'nomorrekening', 'Nomor Rekening', 'string', '0', false, '', false, ''),
    columnData(uuidv4(), 'jeniskreditpembiayaan', 'Jenis Kredit Pembiayaan', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'nomorakadawal', 'Nomor Akad Awal', 'string', '0', false, '', false, ''),
    columnData(uuidv4(), 'nomorakadakhir', 'Nomor Akad Akhir', 'string', '0', false, '', false, ''),
    columnData(uuidv4(), 'kategoriusahadebitur', 'Kategori Usaha Debitur', 'string', '2', false, '', false, ''),
    columnData(uuidv4(), 'kategoriportofolio', 'Kategori Portofolio', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'skimpembiayaansyariah', 'Skim Pembiayaan Syariah', 'string', '0', false, '', false, ''),
    columnData(uuidv4(), 'jenisakad', 'Jenis Akad', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'karakteristiksumberdana', 'Karakteristik Sumber Dana', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'sifatinvestasi', 'Sifat Investasi', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'metodebagihasil', 'Metode Bagi Hasil', 'number', '0', false, '', false, ''),
    columnData(uuidv4(), 'persentasenisbah', 'Persentase Nisbah', 'number', '0', false, '', false, ''),
    columnData(uuidv4(), 'persentaserbhterhadappbh', 'Persentase RBH terhada PPBH', 'number', '0', false, '', false, ''),
    columnData(uuidv4(), 'sifatkreditpembiayaan', 'Sifat Kredit Pembiayaan', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'jenispenggunaan', 'Jenis Penggunaan', 'string', '1', false, '', false, ''),
    columnData(uuidv4(), 'hargaperolehanaset', 'Harga Perolehan Aset', 'number', '0', false, '', false, ''),
];

export default function DevTable() {

    const [sandiTxtProp, setSandiTxtProp] = React.useState('');
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [tableContent, setTableContent] = React.useState(datColumns);
    const [queryRes, setQueryRes] = React.useState('');
    const [resLine, setResLine] = React.useState(2);
    //let lookupVal = '3';
    let navigate = useNavigate();

    const tempQue = "SELECT IDPELAPOR, PERIODELAPORAN, PLAFON, PERIODEDATA FROM `mart.antasena`.`krp01`" + "\n" +
    "WHERE PERIODELAPORAN = 'M' AND PLAFON = 20000000 AND PERIODEDATA = '2022-11-30' LIMIT 5"

    const handleCheckboxChange = (row, idx) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter((id) => id !== row));
            if (tableContent[idx].isCheck === true) { // When?
                tableContent[idx].isCheck = false;
                tableContent[idx].filterCheck = false;
                tableContent[idx].filterVal = '';
                tableContent[idx].strSandi = '';
            } else {
                tableContent[idx].isCheck = true;
            }
            fillSelectedRows();
        } else {
            if (tableContent[idx].isCheck === true) {
                tableContent[idx].isCheck = false;
                tableContent[idx].filterCheck = false;
                tableContent[idx].filterVal = '';
                tableContent[idx].strSandi = '';
            } else {
                tableContent[idx].isCheck = true
            }
            fillSelectedRows();
        }
    };
    //const [opr, setOpr] = React.useState('');
    const OprHandleChange = (e, idx) => {
        const tempTable = [...tableContent];
        
        tempTable[idx].filterVal = e.target.value;
        console.log("Opr Event: ", e.target);
        console.log("Row filterVal: ", tempTable[idx].filterVal);
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
    }

    const handleFilterCheck = (row, idx) => {
        const tempTable = [...tableContent];
        if (tableContent[idx].filterCheck === true) {
            tableContent[idx].filterCheck = false
            if (tableContent[idx].colType === 'number') {
                tableContent[idx].strSandi = '';
                tableContent[idx].filterVal = '';
            }
        } else {
            tableContent[idx].filterCheck  = true
        }
        console.log("Filter CHeck: ", tempTable[idx].filterCheck);
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
    }

    const [kelompok, setKelompok] = React.useState('');
    const KlpkHandleChange = (event) => {
        setKelompok(+event.target.value);
    }

    /*function setValueLookup(e) {
        lookupVal = e;
        console.log("lookupVal: ", JSON.stringify(lookupVal) );
    }*/

    const handleSum = async (e) => {
        let sum;
        sum = await e.target.value;
        setQueryRes(sum);
    }

    const handleSandi = (e, idx) => {
        const tempTable = [...tableContent];
        if (e !== null) {
            if (tempTable[idx].colType === 'number') {
                tempTable[idx].isCheck = true;
                tempTable[idx].filterCheck = true;
                tempTable[idx].strSandi = e.target.value;
                tempTable[idx].filterVal = "=";
                console.log("Temp Table: ", tempTable);
                setTableContent(tempTable);
                fillSelectedRows();
            } else {
                tempTable[idx].isCheck = true;
                tempTable[idx].filterCheck = true;
                tempTable[idx].strSandi = e.target.value;
                tempTable[idx].filterVal = "IN";
                console.log("Temp Table: ", tempTable);
                setTableContent(tempTable);
                fillSelectedRows();
            }
            //console.log("Sandi Text: " + e);
            //setSandiTxtProp(e.target.value);
            
        }
    };

    const handleEdit = (e, idx) => {
        const tempTable = [...tableContent];
        if (e.target.value !== null && e.target.value !== "") {
            //console.log("Sandi Text: " + e);
            //setSandiTxtProp(e.target.value);
            //tempTable[idx].isCheck = true;
            //tempTable[idx].filterCheck = true;
            tempTable[idx].strSandi = e.target.value;
            //tempTable[idx].filterVal = "IN";
            console.log("Temp Table: ", tempTable);
            setTableContent(tempTable);
            fillSelectedRows();
        } else {
            tempTable[idx].isCheck = false;
            tempTable[idx].filterCheck = false;
            tempTable[idx].strSandi = e.target.value;
            tempTable[idx].filterVal = "";
            console.log("Temp Table: ", tempTable);
            setTableContent(tempTable);
            fillSelectedRows();
        }
    };

    const onSandiVal = (events) => {
        console.log("Sandi Row Tbl: ", events)
        let index = events[0];
        let sandiStr = events[1];
        console.log("index: ", index);
        console.log("sandistr: ", sandiStr);
        //columns[index].strSandi = sandiStr;
        console.log("columns: ", columns);
        const tempTable = [...tableContent];
        tempTable[index].isCheck = true;
        tempTable[index].strSandi = sandiStr;
        tempTable[index].filterCheck = true;
        tempTable[index].filterVal = "IN";
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
        //generateQuery(tempTable);
    }

    //this.handleSandi = this.handleSandi.bind(this);


    // console.log(selectedRows.data);
    const fillSelectedRows = async () => {
        setSelectedRows([]);
        tableContent.map((row) => {
            if (row.isCheck) {
                if (row.strSandi) {
                    row.strSandi = row.strSandi;
                }
                selectedRows.push(row);
            }
        });
        await generateQuery(selectedRows);
        console.log('Selected Row: ',selectedRows);
    }

    const setMaxRowResult = (q) => {
        let rowMax = q.split(/\r\n|\r|\n/).length + 1;
        setResLine(rowMax);
    }

    const generateQuery = (obj) => {
        let arrField = '';
        let whereQue = '';
        let agrQue = '';
        if (obj.length !== 0) {    
            obj.map((row) => {
                if (arrField !== '') {
                    if (row.colType === 'number' && row.filterCheck === false && row.filterVal === '') { 
                        agrQue = 'SUM(' + row.colName + ')'; // Set Agr
                        arrField = arrField + ", " + agrQue;
                    } else {
                        arrField = arrField + ', ' + row.colName;
                    }
                } else {
                    if (row.colType === 'number' && row.filterCheck === false && row.filterVal === '') {
                        agrQue = 'SUM(' + row.colName + ')';
                        arrField = agrQue;
                    } else {
                        arrField = row.colName;
                    }
                }
                if (row.filterCheck == true && row.filterVal !== '') { // Set Where
                    if (whereQue !== '') {
                        if (row.filterVal === 'IN' || row.filterVal === 'NOT IN') {
                            whereQue = whereQue + ' AND\n' + row.colName + ' ' + row.filterVal + ' ' + '(' + row.strSandi + ')';
                        } else if (row.colType === 'number') {
                            whereQue = whereQue + ' AND\n' + row.colName + ' ' + row.filterVal + ' ' + row.strSandi;
                        }
                        else {
                            whereQue = whereQue + ' AND\n' + row.colName + ' ' + row.filterVal + ' ' + "'" + row.strSandi + "'";
                        }
                    } else {
                        if (row.filterVal === 'IN' || row.filterVal === 'NOT IN') {
                            whereQue = 'WHERE ' + row.colName + ' ' + row.filterVal + ' ' + '(' + row.strSandi + ')';
                        } else if (row.colType === 'number') {
                            whereQue = 'WHERE ' + row.colName + ' ' + row.filterVal + ' ' + row.strSandi;
                        }
                        else {
                            whereQue = 'WHERE ' + row.colName + ' ' + row.filterVal + ' ' + "'" + row.strSandi + "'";
                        }
                    }
                } else {
                    
                }
            });
        }
        let resQuery = 'SELECT ' + 'PERIODELAPORAN, ' + arrField + ' FROM `mart.antasena`.`krp01` ' + '\n' + whereQue + " AND PERIODEDATA = '2022-11-30'" + " AND PERIODELAPORAN = 'M' " + '\n' + 'LIMIT 10';
        setMaxRowResult(resQuery);
        setQueryRes(resQuery);
        console.log("Result Query: ", resQuery);
    }

    const handleGenerate = (e) => {
        e.preventDefault();
        getQuery();
    }

    async function processQuery(){
        const query = queryRes;
        let que = "mart_test";
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(que)
        };
        let result;
        
      /*  const response = await fetch('http:localhost:8080/sendQuery', query)
        const data = await response.json();
        result = await data.result;*/
        const response = await fetch('http://localhost:8080/map/sendQuery', requestOptions)
        result = await response.json();
        //await setQueryRes(JSON.stringify(result));
        //console.log( "QUERY RESULT : ", JSON.stringify(result));
    }

    async function getQuery() {
        let result;
        let query = "mart_test";
        const que = {
            value: tempQue
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(que)
        };
        const response = await axios.post("http://localhost:8080/sendQuery", que)
        result = await response.data;
        await setQueryRes(JSON.stringify(result));
        console.log( "QUERY RESULT : ", JSON.stringify(result));
        //navigate("http://localhost:8080/sendQuery");
    }

    React.useEffect(() => {
        //console.log('Selected Row: ', selectedRows)
        if (selectedRows.length !== 0) {
            generateQuery(selectedRows);
        }
    }, [selectedRows])

    return (
        /*<ThemeProvider theme={darkTheme}>*/
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440, m: 0.5 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" padding="checkbox" width='5%'>
                                <Checkbox
                                    color="primary"
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < tableContent.length}
                                    checked={selectedRows.length === tableContent.length}
                                    onChange={() => {
                                        if (selectedRows.length === 0) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(tableContent.map((row) => columns.id));
                                        }
                                    }}
                                /> &nbsp; &nbsp;
                            </TableCell>
                            <TableCell align="left" width='15%'>&nbsp; NAMA KOLOM &nbsp;</TableCell>
                            <TableCell align="left" width='5%'>&nbsp; FILTER &nbsp;</TableCell>
                            <TableCell align="left" width='5%'>&nbsp; OPERATOR &nbsp;</TableCell>
                            <TableCell align="left" width='65%'>&nbsp; KONDISI &nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableContent.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {
                                    
                                }
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={row.isCheck}
                                        onChange={() => handleCheckboxChange(row, index)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.labelName}
                                </TableCell>
                                <TableCell align="left" padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={row.filterCheck}
                                        onChange={() => handleFilterCheck(row, index)}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {/*<InputLabel id="operator-select-label">Equal</InputLabel>*/}
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        {/*<InputLabel id="demo-select-small-label">Operator</InputLabel>*/}
                                        <Select
                                            labelId="operator-select-label"
                                            id="operator-select"
                                            value={row.filterVal}
                                            //label="Operator"
                                            onChange={e => OprHandleChange(e,index)}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value="=">EQUAL</MenuItem>
                                            <MenuItem value="IN">IN</MenuItem>
                                            <MenuItem value="NOT IN">NOT IN</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                
                                <TableCell align="left" width='65%'>
                                    {
                                        (row.metadata === "")
                                        ?
                                        <FormControl width="20%">
                                        <TextField
                                                    name="filterVal"
                                                    //label="Enter text"
                                                    //placeholder="Placeholder"
                                            id="filled-basic"
                                            variant="filled"
                                                    type="search"
                                                    defaultValue={row.strSandi}
                                                    onChange={(e) => handleSandi(e, index)}
                                            //onBlur={(e) => handleSandi(e,index)}
                                            //inputProps={klpTxtProp}
                                        />
                                        </FormControl>
                                            :
                                        /*<LookupContext.Provider value={lookupVal}>*/
                                        <FormControl width="20%" display="table-row" flex-direction="row">
                                        <TextField
                                                    id="filled-search"
                                                    variant="filled"
                                                    type="search"
                                                    name="freeTxt"
                                                    defaultValue={row.strSandi}
                                                    value={row.strSandi}
                                                    onChange={(e) => handleEdit(e,index)}
                                                    //onChange={(e) => handleSandi(e, index)}
                                        //inputProps={klpTxtProp}
                                        /> {}
                                        <DevDialog
                                                    //rowCondition={row.condition}
                                                    rowIndex={index}
                                                    sandiVal={onSandiVal}
                                                    metadata={row.metadata}
                                        //sendSandi={handleSandi}
                                        />
                                        </FormControl>
                                        /*</LookupContext.Provider>*/
                                    }
                                </TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Container
                //sx={{ left: 'tooltip' }}
            >
                <TextField
                    id="filled-multiline-static"
                    label="Multiline"
                    multiline
                    rows={resLine}
                    defaultValue="Default Value"
                    variant="filled"
                    fullWidth="true"
                    value={queryRes}
                    onChange={(e) => handleSum(e)}
                />&nbsp;
                <AlertDialog result={queryRes}
                />
                {/*<Button variant="contained"
                    onClick={handleGenerate}
                >Process</Button>*/}
            </Container>    
        </Box>
        /*</ThemeProvider>*/
            
    );
}