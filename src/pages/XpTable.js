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


function createData(id, name, code, population, size) {
    const density = population / size;
    return { id, name, code, population, size, density };
}

function columnData(id, fieldName, labelName, condition) {
    let colName = fieldName.toUpperCase();
    return { id, colName, labelName, condition };
}

const columns = [
    columnData(uuidv4(), 'nomorrekening', 'Nomor Rekening', '0'),
    columnData(uuidv4(), 'jeniskreditpembiayaan', 'Jenis Kredit Pembiayaan', '1'),
    columnData(uuidv4(), 'nomorakadawal', 'Nomor Akad Awal', '0'),
    columnData(uuidv4(), 'nomorakadakhir', 'Nomor Akad Akhir', '0'),
    columnData(uuidv4(), 'kategoriusahadebitur', 'Kategori Usaha Debitur', '1'),
    columnData(uuidv4(), 'kategoriportofolio', 'Kategori Portofolio', '1'),
    columnData(uuidv4(), 'skimpembiayaansyariah', 'Skim Pembiayaan Syariah', '0'),
    columnData(uuidv4(), 'jenisakad', 'Jenis Akad', '1'),
    columnData(uuidv4(), 'karakteristiksumberdana', 'Karakteristik Sumber Dana', '1'),
    columnData(uuidv4(), 'sifatinvestasi', 'Sifat Investasi', '1'),
    columnData(uuidv4(), 'metodebagihasil', 'Metode Bagi Hasil', '0'),
    columnData(uuidv4(), 'persentasenisbah', 'Persentase Nisbah', '0'),
    columnData(uuidv4(), 'persentaserbhterhadappbh', 'Persentase RBH terhada PPBH', '0'),
    columnData(uuidv4(), 'sifatkreditpembiayaan', 'Sifat Kredit Pembiayaan', '1'),
    columnData(uuidv4(), 'jenispenggunaan', 'Jenis Penggunaan', '1'),
];

const rows = [
    createData(uuidv4(), 'India', 'IN', 1324171354, 3287263),
    createData(uuidv4(), 'China', 'CN', 1403500365, 9596961),
    createData(uuidv4(), 'Italy', 'IT', 60483973, 301340),
    createData(uuidv4(), 'United States', 'US', 327167434, 9833520),
    createData(uuidv4(), 'Canada', 'CA', 37602103, 9984670),
    createData(uuidv4(), 'Australia', 'AU', 25475400, 7692024),
    createData(uuidv4(), 'Germany', 'DE', 83019200, 357578),
    createData(uuidv4(), 'Ireland', 'IE', 4857000, 70273),
    createData(uuidv4(), 'Mexico', 'MX', 126577691, 1972550),
    createData(uuidv4(), 'Japan', 'JP', 126317000, 377973),
    createData(uuidv4(), 'France', 'FR', 67022000, 640679),
    createData(uuidv4(), 'United Kingdom', 'GB', 67545757, 242495),
    createData(uuidv4(), 'Russia', 'RU', 146793744, 17098246),
    createData(uuidv4(), 'Nigeria', 'NG', 200962417, 923768),
    createData(uuidv4(), 'Brazil', 'BR', 210147125, 8515767),
];

export default function XpTable() {
    
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [sandiTxtProp, setSandiTxtProp] = React.useState();
    const [klpTxtProp, setKlpTxtProp] = React.useState("");
    const [freeTxt, setFreeTxt] = React.useState();

    const handleCheckboxChange = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter((id) => id !== rowId));
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };
    const [opr, setOpr] = React.useState('');
    const OprHandleChange = (event) => {
        setOpr(event.target.value);
    }

    const [kelompok, setKelompok] = React.useState('');
    const KlpkHandleChange = (event) => {
        setKelompok(+event.target.value);
    }

    const handleSandi = (e) => {
        if (e !== null) {
            console.log("Sandi Text: " + e);
            setSandiTxtProp(e)
        }

    };

    var dataSelectedRows = selectedRows.map((row) => {
        return row.id
    });
    console.log(dataSelectedRows);

    return (
        <Paper sx={{ width: '125%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" padding="checkbox" width='5%'>
                                <Checkbox
                                    color="primary"
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                                    checked={selectedRows.length === rows.length}
                                    onChange={() => {
                                        if (selectedRows.length === rows.length) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(rows.map((row) => row.id));
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
                        {columns.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selectedRows.includes(row.id)}
                                        onChange={() => handleCheckboxChange(row.id)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.labelName}
                                </TableCell>
                                <TableCell align="left" padding="checkbox">
                                    <Checkbox
                                        color="primary"

                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id="demo-select-small-label">Operator</InputLabel>
                                        <Select
                                            labelId="operator-select-label"
                                            id="operator-select"
                                            value={opr}
                                            label="Operator"
                                            onChange={OprHandleChange}
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
                                        (row.condition == '0')
                                            ?
                                            <FormControl width="100%">
                                                <TextField
                                                    id="filled-basic"
                                                    variant="filled"
                                                    type="search"
                                                    value={sandiTxtProp}
                                                //onChange={() => handleSandi}
                                                //inputProps={klpTxtProp}
                                                /> {''}
                                                <DevDialog
                                                //sendSandi={handleSandi}
                                                />
                                            </FormControl>
                                            :
                                            <FormControl width="100%">
                                                <TextField
                                                    id="filled-search"
                                                    variant="filled"
                                                    type="search"
                                                    name="freeTxt"
                                                    value={freeTxt}
                                                // onChange={() => this.handleSandi.bind(this)}
                                                //inputProps={klpTxtProp}
                                                />
                                            </FormControl>
                                    }

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Container sx={{ left: 'tooltip' }}>
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