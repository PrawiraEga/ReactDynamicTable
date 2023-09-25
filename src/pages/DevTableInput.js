//"use client"

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Select, InputLabel, MenuItem, TextField, FormControl, Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getDb, getColumn } from "../services/api";
import SelectComponent from '../components/SelectComponent';
import metadataJson from '../metadata.json';


const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function arrJP(id, label, ket, isCheck, txt) {
    return { id, label, ket, isCheck, txt };
}

function columnArr(columnType, columnName, metadata) {
    let colName = columnName.toUppercase();
    return { columnType, colName, metadata };
}

const availMeta = metadataJson.columns;

const metaJenisPenggunaan = [
    arrJP(1, 'Modal Kerja', 'kredit/pembiayaan yang diperuntukkan sebagai modal kerja debitur yang bersangkutan.', false, ''),
    arrJP(2, 'Investasi', 'kredit/pembiayaan yang diperuntukkan sebagai pembelian barang modal dan jasa yang diperlukan guna rehabilitasi, modernisasi, ekspansi, relokasi usaha ', false, ''),
    arrJP(3, 'Konsumsi', 'kredit/pembiayaan yang diperuntukkan untuk keperluan konsumsi', false, ''),
];

/*function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
];*/

export default function DevTableInput(props) {
    const { changeSandi } = props;

    const [selectedRows, setSelectedRows] = React.useState([]);
    const [strSandi, setStrSandi] = React.useState("");
    const [drows, setDrows] = React.useState([]);
    const [selectedTable, setSelectedTable] = React.useState(null);

    const [dbTableName, setDBTableName] = React.useState({
        dbName: "",
        availableTables: [],
    });
    const [tableName, setTableName] = React.useState("");
    const [availableDBAndTables, setAvailableDBAndTables] = React.useState([]);
    const [columnData, setColumnData] = React.useState([]);

    const [checkboxIds, setCheckboxIds] = React.useState([]);
    const [txtfieldIds, setTxtfieldIds] = React.useState([]);

    function createDrow(id, name, fieldtxt, isCheck) {
        return { id, name, fieldtxt, isCheck }
    }

    const mapToDrows = async () => {
        let objRows = [];
        let addRows = [];
        metaJenisPenggunaan.map((row, index) => {
            //fillCheckboxIds(index)
            //fillTxtfieldIds(index)
            addRows = fillDrows(row, index);
            objRows.push(addRows);
            console.log('objRows : ' + objRows);
        })
        await setDrows(objRows);
        return drows;
    }

    const fillDrows = (row, index) => {
        //let objRow = []
        //if (drows.length === 0) {
            let addRow = {
                id: index+1 ,
                name: row.label,
                fieldtxt: '',
                isCheck: false
            };
            //objRow.push(addRow)
        //}
        console.log('add', addRow)
        return addRow;
    }

    const handleCheckboxChange = (row) => {
        changeSelectedRows(row);
    }

    async function changeSelectedRows(rowId) {
        var index;
        let tempselRows = [];
        if (selectedRows.length === 0) {
            tempselRows = [...selectedRows, rowId];
            await setSelectedRows(tempselRows);
            await setArrSandiStr(tempselRows);
        } else {
            if (selectedRows.includes(rowId)) {
                index = selectedRows.indexOf(rowId);
                if (index >= -1) {
                    selectedRows.splice(index, 1);
                    if (selectedRows.length !== 0) {
                        await setArrSandiStr(selectedRows);
                    } else {
                        await setStrSandi("");
                    }
                }

            } else {
                tempselRows = [...selectedRows, rowId];

                await setSelectedRows(tempselRows);
                await setArrSandiStr(tempselRows);
                
            }
        }
    }

    async function setArrSandiStr(el) {
        let arrSandi = null;
        setStrSandi(arrSandi);
        if (el.length !== 0) {
            for (let i = 0; i < el.length; i++) {
                if (i > 0) {
                    arrSandi = (arrSandi + (",") + ("'" + el[i] + "'"));
                    await setStrSandi(arrSandi);

                } else {
                    arrSandi = ("'" + el[i] + "'");
                    await setStrSandi(arrSandi);

                }
            }
        }
    }

    function addColumnMeta() {
        let columnObj = [];
        let columnData = null;
        if (columnData.length > 0) {
            for (var i = 0; i < columnData.length; i++) {
                //availMeta.map((row) => {
                if (availMeta.includes(columnData[i].columnName)) {
                    let index = availMeta.findIndex(el => el === columnData[i].columnName);
                    columnData = columnArr(columnData[i].columnType, columnData[i].columnName, availMeta[index].metadata)
                } else {
                    columnData = columnArr(columnData[i].columnType, columnData[i].columnName, "")
                }
                columnObj.push(columnData);
                //})
            }
            setDrows(columnObj);
        }
    }

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

    const handleChangeTableName = (value) => {
        let res;
        if (value) {
            setTableName(value)
            getColumn({ db: dbTableName.dbName, table: value })
                .then((obj) => {
                    res = obj.columns;
                    setColumnData(res);
                    addColumnMeta();
                    console.log("Columns ", JSON.stringify(res))
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    /*handleSandi(event){
        this.setSandiTxtProp(sandiTxtProp);
        event.preventDefault();
    };*/

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
                setAvailableDBAndTables(db);
            })
            .catch((err) => {
                console.log(err);
            });
        //mapToDrows();
        //console.log('Drows : ' + drows);
        //setTimeout(() => mapToDrows, 2000);
        //console.log("Array:" + selectedRows);
        
        // setArrSandiStr(selectedRows);
    }, []);

    return (
        
        <Paper sx={{ width: '125%', overflow: 'hidden' }}>
            <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1 }, mx: 'auto' }}
                noValidate
                autoComplete="off"
            >
                <SelectComponent
                    labelString="Database Name"
                    objectVariable={dbTableName.dbName}
                    setVariable={handleChangeDbName}
                    dataOptions={availableDBAndTables.map((o) => o.dbName)}
                >
                </SelectComponent>
                <SelectComponent
                    labelString="Table Name"
                    objectVariable={tableName}
                    setVariable={handleChangeTableName}
                    dataOptions={dbTableName.availableTables}
                    disabled={!dbTableName.dbName}
                >
                </SelectComponent>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" padding="checkbox" width='15%'>
                                <FormControlLabel
                                    value="end"
                                    control={<Checkbox
                                        color="primary"
                                    />}
                                    label="Select"
                                    labelPlacement="end"
                                />

                            </TableCell>
                                <TableCell align="left" width='15%'>&nbsp; NAMA KOLOM &nbsp;</TableCell>
                                <TableCell align="left" width='5%'>&nbsp; FILTER &nbsp;</TableCell>
                                <TableCell align="left" width='5%'>&nbsp; OPERATOR &nbsp;</TableCell>
                                <TableCell align="left" width='65%'>&nbsp; KONDISI &nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {(columnData !== null)
                            ?
                            drows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary" align="left"
                                                //id={row[index].id}
                                                checked={selectedRows.includes(row.id)}
                                                value={row.isCheck}
                                                onChange={() => handleCheckboxChange(row.id)}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <FormControl width="100%">
                                                <TextField
                                                    id="filled-basic"
                                                    //       name={'txtfield_' + { index }}
                                                    variant="filled"
                                                    type="search"
                                                    value={row.fieldtxt}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                            ))
                            
                            :

                            metaJenisPenggunaan.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary" align="left"
                                                //id={row[index].id}
                                                checked={selectedRows.includes(row.id)}
                                                value={row.isCheck}
                                                onChange={() => handleCheckboxChange(row.id)}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.label}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <FormControl width="100%">
                                                <TextField
                                                    id="filled-basic"
                                                    //       name={'txtfield_' + { index }}
                                                    variant="filled"
                                                    type="search"
                                                    value={row.txt}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                            ))
                        }
                        
                    </TableBody>
                </Table>

            </TableContainer>
            <br></br>&nbsp;
            <TextField
                id="filled-search"
                variant="filled"
                label="Selected"
                value={strSandi}
            />
            <br></br>&nbsp;
            <TextField
                id="filled-search"
                variant="filled"
                label="Generated"
                value={strSandi}
            />&nbsp;
            <Button variant="contained"
                onClick={() => changeSandi(strSandi)}
            >OK</Button>
            <br></br>
            </Box>
        </Paper>
    );
}