import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Select, InputLabel, MenuItem, TextField, FormControl, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import DevDialog from './DevDialog';
import AlertDialog from './AlertDialog';
import { getDb, getColumn } from "../services/api";
import SelectComponent from '../components/SelectComponent';
import AlertComponent from '../components/AlertComponent';
import metadataJson from '../metadata.json';

function columnObject(id, fieldName, columnType, isCheck, strKondisi, filterCheck, filterVal, metadata) {
    let columnName = fieldName.toUpperCase();
    return { id, columnName, columnType, isCheck, strKondisi, filterCheck, filterVal, metadata };
}

const availMeta = metadataJson.columns;

export default function GenerateReport() {
    const [dbTableName, setDBTableName] = React.useState({
        dbName: "",
        availableTables: [],
    });
    const [tableName, setTableName] = React.useState("");
    const [availableDBAndTables, setAvailableDBAndTables] = React.useState([]);
    const [columnData, setColumnData] = React.useState([]);
    const [isConnectionError, setIsConnectionError] = React.useState({
        isError: false,
        errorFrom: "",
        dataValue: "",
    });
    const [errorStates, setErrorState] = React.useState("");

    const [selectedRows, setSelectedRows] = React.useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [queryRes, setQueryRes] = React.useState('');
    const [resLine, setResLine] = React.useState(2);

    const handleChangeDbName = (value) => {
        if (tableName) {

        }
        setDBTableName({
            dbName: value,
            availableTables: availableDBAndTables.reduce((result, o) => {
                if (o.dbName === value) result = o.tables;
                return result;
            }, []),
        });
    };

    const handleChangeTableName = async (value) => {
        let res;
        setQueryRes('');
        if (value) {
            setTableName(value);
            await getColumn({ db: dbTableName.dbName, table: value })
                .then((obj) => {
                    res = obj.columns;
                    setColumnData(res);
                    changeTableColumns();
                    console.log("Columns ", JSON.stringify(res));
                    //setErrorState(false);
                    
                    setIsConnectionError({
                        isError: false,
                        errorFrom: "",
                        dataValue: "",
                    });
                })
                .catch((err) => {
                    //setErrorState(true);

                    setIsConnectionError({
                        isError: true,
                        errorFrom: "initialTable",
                        dataValue: value,
                    });
                    console.log(err);
                    /*return (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {err}
                        </Alert>
                    )*/
                    
                    
                });
            //addColumnMeta();
        }
    }

    const handleCheckboxChange = (row, idx) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter((id) => id !== row));
            if (tableContent[idx].isCheck === true) { // When?
                tableContent[idx].isCheck = false;
                tableContent[idx].filterCheck = false;
                tableContent[idx].filterVal = '';
                tableContent[idx].strKondisi = '';
            } else {
                tableContent[idx].isCheck = true;
            }
            fillSelectedRows();
        } else {
            if (tableContent[idx].isCheck === true) {
                tableContent[idx].isCheck = false;
                tableContent[idx].filterCheck = false;
                tableContent[idx].filterVal = '';
                tableContent[idx].strKondisi = '';
            } else {
                tableContent[idx].isCheck = true
            }
            fillSelectedRows();
        }
    };

    const handleFilterCheck = (row, idx) => {
        const tempTable = [...tableContent];
        if (tableContent[idx].filterCheck === true) {
            tableContent[idx].filterCheck = false
            if (tableContent[idx].columnType === 'number') {
                tableContent[idx].strKondisi = '';
                tableContent[idx].filterVal = '';
            }
        } else {
            tableContent[idx].filterCheck = true
        }
        console.log("Filter CHeck: ", tempTable[idx].filterCheck);
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
    }

    const OprHandleChange = (e, idx) => {
        const tempTable = [...tableContent];

        tempTable[idx].filterVal = e.target.value;
        console.log("Opr Event: ", e.target);
        console.log("Row filterVal: ", tempTable[idx].filterVal);
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
    }

    const handleSandi = (e, idx) => {
        const tempTable = [...tableContent];
        if (e !== null) {
            if (tempTable[idx].columnType === 'number') {
                tempTable[idx].isCheck = true;
                tempTable[idx].filterCheck = true;
                tempTable[idx].strKondisi = e.target.value;
                tempTable[idx].filterVal = "=";
                console.log("Temp Table: ", tempTable);
                setTableContent(tempTable);
                fillSelectedRows();
            } else {
                tempTable[idx].isCheck = true;
                tempTable[idx].filterCheck = true;
                tempTable[idx].strKondisi = e.target.value;
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
            tempTable[idx].strKondisi = e.target.value;
            //tempTable[idx].filterVal = "IN";
            console.log("Temp Table: ", tempTable);
            setTableContent(tempTable);
            fillSelectedRows();
        } else {
            tempTable[idx].isCheck = false;
            tempTable[idx].filterCheck = false;
            tempTable[idx].strKondisi = e.target.value;
            tempTable[idx].filterVal = "";
            console.log("Temp Table: ", tempTable);
            setTableContent(tempTable);
            fillSelectedRows();
        }
    };

    const handleSum = async (e) => {
        let sum;
        sum = await e.target.value;
        setQueryRes(sum);
    }

    const onSandiVal = ( events ) => {
        console.log("Sandi Row Tbl: ", events)
        let index = events[0];
        let sandiStr = events[1];
        console.log("index: ", index);
        console.log("sandistr: ", sandiStr);
        //columns[index].strKondisi = sandiStr;
        const tempTable = [...tableContent];
        tempTable[index].isCheck = true;
        tempTable[index].strKondisi = sandiStr;
        tempTable[index].filterCheck = true;
        tempTable[index].filterVal = "IN";
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
        //generateQuery(tempTable);
    }

    //=========================================
    const fillSelectedRows = async () => {
        setSelectedRows([]);
        tableContent.map((row) => {
            if (row.isCheck) {
                if (row.strKondisi) {
                    row.strKondisi = row.strKondisi;
                }
                selectedRows.push(row);
            }
        });
        await generateQuery(selectedRows);
        console.log('Selected Row: ', selectedRows);
    }

    const generateQuery = (obj) => {
        let arrField = '';
        let whereQue = '';
        let agrQue = '';
        if (obj.length !== 0) {
            obj.map((row) => {
                if (arrField !== '') {
                    if ((row.columnType === 'number' || row.columnType === 'bigint' || row.columnType === 'float')
                        && row.filterCheck === false && row.filterVal === '') {
                        agrQue = 'SUM(' + row.columnName + ')'; // Set Agr
                        arrField = arrField + ', ' + agrQue;
                    } else {
                        arrField = arrField + ', ' + row.columnName;
                    }
                } else {
                    if ((row.columnType === 'number' || row.columnType === 'bigint' || row.columnType === 'float')
                        && row.filterCheck === false && row.filterVal === '=') {
                        agrQue = 'SUM(' + row.columnName + ')';
                        arrField = agrQue;
                    } else {
                        arrField = row.columnName;
                    }
                }
                if (row.filterCheck == true && row.filterVal !== '') { // Set Where
                    if (whereQue !== '') {
                        if (row.filterVal === 'IN' || row.filterVal === 'NOT IN') {
                            whereQue = whereQue + ' AND\n' + row.columnName + ' ' + row.filterVal + ' ' + '(' + row.strKondisi + ')';
                        }
                        /*else if (row.colType === 'number') {
                            whereQue = whereQue + ' AND\n' + row.columnName + ' ' + row.filterVal + ' ' + row.strKondisi;
                        }*/
                        else {
                            whereQue = whereQue + ' AND\n' + row.columnName + ' ' + row.filterVal + ' ' + row.strKondisi;
                        }
                    } else {
                        if (row.filterVal === 'IN' || row.filterVal === 'NOT IN') {
                            whereQue = 'WHERE ' + row.columnName + ' ' + row.filterVal + ' ' + '(' + row.strKondisi + ')';
                        }
                        /*else if (row.colType === 'number') {
                            whereQue = 'WHERE ' + row.columnName + ' ' + row.filterVal + ' ' + row.strKondisi;
                        }*/
                        else {
                            whereQue = 'WHERE ' + row.columnName + ' ' + row.filterVal + ' ' + row.strKondisi;
                        }
                    }
                } else {

                }
            });
        }
        let resQuery = 'SELECT ' + arrField + ' FROM `' + dbTableName.dbName + '`.`' + tableName + '`' + '\n' + whereQue + " AND PERIODEDATA = '2022-11-30'" + '\n' + 'LIMIT 10';
        setMaxRowResult(resQuery);
        setQueryRes(resQuery);
        console.log("Result Query: ", resQuery);
    }

    const changeTableColumns = () => {
        let columnObj = [];
        if (columnData.length > 0) {
            for (var i = 0; i < columnData.length; i++) {
                let dataColumn = null;
                for (var j = 0; j < availMeta.length; j++) {
                    if (columnData[i].columnName === availMeta[j].columnName) {
                        dataColumn = columnObject(i, columnData[i].columnName, columnData[i].columnType, false, '', false, '', availMeta[j].metadata);
                        continue;
                    } else if ((j === availMeta.length - 1) && (dataColumn === null)) {
                        dataColumn = columnObject(i, columnData[i].columnName, columnData[i].columnType, false, '', false, '', "");
                    }
                }
                columnObj.push(dataColumn);
            }
            setTableContent(columnObj);
            console.log("Col Obj : ", columnObj);
        }
    }

    const setMaxRowResult = (q) => {
        let rowMax = q.split(/\r\n|\r|\n/).length + 1;
        setResLine(rowMax);
    }

    const retryFetch = async (from, dataValue) => {
        window.location.reload(true)
        switch (from) {
            case "getDB":
                await getDb()
                    .then(({ db }) => {
                        setAvailableDBAndTables(db);
                        setIsConnectionError({
                            isError: false,
                            errorFrom: "",
                            dataValue: "",
                        });
                    })
                    .catch((err) => {
                        setIsConnectionError({
                            isError: true,
                            errorFrom: "getDB",
                            dataValue: dataValue,
                        });
                        console.log(err);
                    });
                break;
            case "initialTable":
                if (dataValue)
                    await getColumn({ db: dbTableName.dbName, table: dataValue })
                        .then((obj) => {
                            setColumnData( obj.columns );
                            setIsConnectionError({
                                isError: false,
                                errorFrom: "",
                                dataValue: "",
                            });
                        })
                        .catch((err) => {
                            setIsConnectionError({
                                isError: true,
                                errorFrom: "initialTable",
                                dataValue: dataValue,
                            });
                            console.log(err);
                        });
                break;
            default:
                return;
        }
    };

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer `
        }
    }

    React.useEffect(() => {
        getDb(options)
            .then(({ db }) => {
                //setErrorState(false);
                setAvailableDBAndTables(db);
                setIsConnectionError({
                    isError: false,
                    errorFrom: "",
                    dataValue: "",
                });
            })
            .catch((err) => {
                setIsConnectionError({
                    isError: true,
                    errorFrom: "getDB",
                    dataValue: "",
                });
                //setErrorState(true);
                console.log(err);
            });
    }, []);

    React.useEffect(() => {
        let columnObj = [];
        if (columnData.length > 0) {
            for (var i = 0; i < columnData.length; i++) {
                let dataColumn = null;
                for (var j = 0; j < availMeta.length; j++) {
                    if (columnData[i].columnName === availMeta[j].columnName) {
                        dataColumn = columnObject(i, columnData[i].columnName, columnData[i].columnType, false, '', false, '', availMeta[j].metadata);
                        continue;
                    } else if ((j === availMeta.length - 1) && (dataColumn === null)) {
                        dataColumn = columnObject(i, columnData[i].columnName, columnData[i].columnType, false, '', false, '', "");
                    }
                }
                columnObj.push(dataColumn);
            }
            setTableContent(columnObj);
            console.log("Col Obj : ", columnObj);
        }
    }, [columnData]);

    React.useEffect(() => {
        if (selectedRows.length !== 0) {
            generateQuery(selectedRows);
        }
    }, [selectedRows])

    return (
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {isConnectionError.isError ? (
                <AlertComponent
                    retryFetch={() =>
                        retryFetch(
                            isConnectionError.errorFrom,
                            isConnectionError.dataValue,
                            isConnectionError.iValue
                        )
                    }
                    setIsConnectionError={() =>
                        setIsConnectionError({
                            isError: false,
                            errorFrom: "",
                            dataValue: "",
                        })
                    }
                />
            ) : null}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 200,
                        }}
                    >
                        <SelectComponent
                            labelString="Database Name"
                            objectVariable={dbTableName.dbName}
                            setVariable={handleChangeDbName}
                            dataOptions={availableDBAndTables.map((o) => o.dbName)}
                            
                        >
                        </SelectComponent>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "inherit",
                            }}
                        >
                        <SelectComponent
                            labelString="Table Name"
                            objectVariable={tableName}
                            setVariable={handleChangeTableName}
                            dataOptions={dbTableName.availableTables}
                            disabled={!dbTableName.dbName}
                            
                        >
                            </SelectComponent>
                        </div>
                    </Paper>
                </Grid>
                {
                    (tableContent.length === 0) ?
                        <Grid item xs={12}>
                            <h1 style={{ margin: '0 auto' }}>
                            <u>Please Select DB & Table</u>
                            </h1>
                        </Grid>
                        
                        :
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2, display: 'flex', flexDirection: 'column'
                                }}
                            >
                                <TableContainer sx={{ maxHeight: 440, m: 0.5 }}>
                                    <Table
                                        stickyHeader aria-label="sticky table"
                                        size="small"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" padding="checkbox" width='5%'>
                                                    <Checkbox
                                                        color="primary"
                                                        //indeterminate={selectedRows.length > 0 && selectedRows.length < tableContent.length}
                                                        checked={selectedRows.length === tableContent.length}
                                                        onChange={(event) => {
                                                           /* if (selectedRows.length === 0) {
                                                                setSelectedRows([]);
                                                            } else {*/
                                                            if (event.target.checked) {
                                                                const newSelected = tableContent.map((n) => n);
                                                                newSelected.forEach(e => {
                                                                    e.isCheck = true
                                                                })
                                                                setSelectedRows(newSelected);
                                                                return;
                                                            } else {
                                                                //const newSelected = tableContent.map((n) => n);
                                                                setSelectedRows([]);
                                                                setQueryRes('');
                                                                tableContent.forEach(e => {
                                                                    e.isCheck = false
                                                                })
                                                                //setSelectedRows(newSelected);
                                                                
                                                                return;
                                                                
                                                            }

                                                                
                                                            //}
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
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={row.isCheck}
                                                            onChange={() => handleCheckboxChange(row, index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.columnName}
                                                    </TableCell>
                                                    <TableCell align="left" padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={row.filterCheck}
                                                            onChange={() => handleFilterCheck(row, index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                            <Select
                                                                labelId="operator-select-label"
                                                                id="operator-select"
                                                                value={row.filterVal}
                                                                onChange={e => OprHandleChange(e, index)}
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
                                                                        id="filled-basic"
                                                                        variant="filled"
                                                                        type="search"
                                                                        defaultValue={row.strKondisi}
                                                                        onChange={(e) => handleSandi(e, index)}
                                                                    />
                                                                </FormControl>
                                                                :
                                                                <FormControl width="20%" display="table-row" flex-direction="row">
                                                                    <TextField
                                                                        id="filled-search"
                                                                        variant="filled"
                                                                        type="search"
                                                                        name="freeTxt"
                                                                        defaultValue={row.strKondisi}
                                                                        value={row.strKondisi}
                                                                        onChange={(e) => handleEdit(e, index)}
                                                                    /> { }
                                                                    <DevDialog
                                                                        rowIndex={index}
                                                                        sandiVal={onSandiVal}
                                                                        metadata={row.metadata}
                                                                    />
                                                                </FormControl>
                                                        }
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            <TextField
                                margin="normal"
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
                        </Grid>      
                }
                
                <Grid item xs={12} md={8} lg={9}>
                    
                </Grid>
            </Grid>

            <Box sx={{ width: '100%', overflow: 'hidden' }}
                margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24,
            }}>
                
            </Box>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                
                

            </Box>
            <Box>
                
            </Box>
        </Container>
        );

}