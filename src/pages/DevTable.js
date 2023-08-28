// "use client"

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Select, InputLabel, MenuItem, TextField, FormControl } from '@mui/material';
import MaxWidthDialog from './MaxWidthDialog';
import DevDialog from './DevDialog';
import { v4 as uuidv4 } from 'uuid';
import { Box, Container, Grid } from '@mui/system';
import { LookupContext } from '../context/LookupContext';


function columnData(id, fieldName, labelName, condition, isCheck, strSandi, filterCheck, filterVal) {
    let colName = fieldName.toUpperCase();
    return { id, colName, labelName, condition, isCheck, strSandi, filterCheck, filterVal };
}

const columns = [
    columnData(uuidv4(), 'nomorrekening', 'Nomor Rekening', '0', false, '', false, ''),
    columnData(uuidv4(), 'jeniskreditpembiayaan', 'Jenis Kredit Pembiayaan', '1', false, '', false, ''),
    columnData(uuidv4(), 'nomorakadawal', 'Nomor Akad Awal', '0', false, '', false, ''),
    columnData(uuidv4(), 'nomorakadakhir', 'Nomor Akad Akhir', '0', false, '', false, ''),
    columnData(uuidv4(), 'kategoriusahadebitur', 'Kategori Usaha Debitur', '2', false, '', false, ''),
    columnData(uuidv4(), 'kategoriportofolio', 'Kategori Portofolio', '1', false, '', false, ''),
    columnData(uuidv4(), 'skimpembiayaansyariah', 'Skim Pembiayaan Syariah', '0', false, '', false, ''),
    columnData(uuidv4(), 'jenisakad', 'Jenis Akad', '1', false, '', false, ''),
    columnData(uuidv4(), 'karakteristiksumberdana', 'Karakteristik Sumber Dana', '1', false, '', false, ''),
    columnData(uuidv4(), 'sifatinvestasi', 'Sifat Investasi', '1', false, '', false, ''),
    columnData(uuidv4(), 'metodebagihasil', 'Metode Bagi Hasil', '0', false, '', false, ''),
    columnData(uuidv4(), 'persentasenisbah', 'Persentase Nisbah', '0', false, '', false, ''),
    columnData(uuidv4(), 'persentaserbhterhadappbh', 'Persentase RBH terhada PPBH', '0', false, '', false, ''),
    columnData(uuidv4(), 'sifatkreditpembiayaan', 'Sifat Kredit Pembiayaan', '1', false, '', false, ''),
    columnData(uuidv4(), 'jenispenggunaan', 'Jenis Penggunaan', '1', false, '', false, ''),
];

export default function DevTable() {

    const [selectedRows, setSelectedRows] = React.useState([]);
    const [tableContent, setTableContent] = React.useState(columns);
    const [sandiTxtProp, setSandiTxtProp] = React.useState();
    const [someVal, setSomeVal] = React.useState();
    const [klpTxtProp, setKlpTxtProp] = React.useState('');
    //let lookupVal = '3';

    const handleCheckboxChange = (row, idx) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter((id) => id !== row));
            if (tableContent[idx].isCheck === true) {
                tableContent[idx].isCheck = false
            } else {
                tableContent[idx].isCheck = true
            }
            fillSelectedRows();
        } else {
            if (tableContent[idx].isCheck === true) {
                tableContent[idx].isCheck = false
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
            tableContent[idx].filterCheck  = false
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

    const handleSandi = (e) => {
        if (e !== null) {
            console.log("Sandi Text: " + e);
            setSandiTxtProp(e)
        }
        
    };

    const onSandiVal = (events, callback = () => {}) => {
        console.log("Sandi Row Tbl: ", events)
        let index = events[0];
        let sandiStr = events[1];
        console.log("index: ", index);
        console.log("sandistr: ", sandiStr);
        columns[index].strSandi = sandiStr;
        console.log("columns: ", columns);
        const tempTable = [...tableContent];
        tempTable[index].strSandi = sandiStr;
        tempTable[index].filterCheck = true;
        setTableContent(tempTable);
        console.log("Temp Table: ", tempTable);
        fillSelectedRows();
    }

    //this.handleSandi = this.handleSandi.bind(this);


    // console.log(selectedRows.data);
    const fillSelectedRows = () => {
        setSelectedRows([]);
        tableContent.map((row) => {
            if (row.isCheck) {
                selectedRows.push(row);
            }
        });
        //console.log(selectedRows);
    } 
    

    React.useEffect(() => {
        console.log('Selected Row: ', selectedRows)
    }, [])

    return (
        
        <Paper sx={{ width: '125%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" padding="checkbox" width='5%'>
                                <Checkbox
                                    color="primary"
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < columns.length}
                                    checked={selectedRows.length === columns.length}
                                    onChange={() => {
                                        if (selectedRows.length === 0) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(columns.map((row) => columns.id));
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
                                        <InputLabel id="demo-select-small-label">Operator</InputLabel>
                                        <Select
                                            labelId="operator-select-label"
                                            id="operator-select"
                                            //value={row.filterVal}
                                            label="Operator"
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
                                        (row.condition === '0')
                                        ?
                                        <FormControl width="100%">
                                        <TextField
                                            id="filled-basic"
                                            variant="filled"
                                            type="search"
                                            value={sandiTxtProp}
                                            //onChange={() => handleSandi}
                                            //inputProps={klpTxtProp}
                                        />
                                        </FormControl>
                                            :
                                        /*<LookupContext.Provider value={lookupVal}>*/
                                        <FormControl width="100%">
                                        <TextField
                                                    id="filled-search"
                                                    variant="filled"
                                                    type="search"
                                                    name="freeTxt"
                                                    value={row.strSandi}
                                                    //onBlur={() => sandiVal}
                                            // onChange={() => this.handleSandi.bind(this)}
                                        //inputProps={klpTxtProp}
                                        /> {}
                                        <DevDialog
                                                    rowCondition={row.condition}
                                                    rowIndex={index}
                                                    sandiVal={onSandiVal}
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
            <Container sx={{ left: 'tooltip'}}>
                <TextField
                id="filled-multiline-static"
                label="Multiline"
                multiline
                rows={5}
                defaultValue="Default Value"
                variant="filled"
            />
            </Container>
            
            </Paper>
            
    );
}