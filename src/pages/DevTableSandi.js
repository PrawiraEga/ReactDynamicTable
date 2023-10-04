//"use client"

import * as React from 'react';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import { LookupContext } from '../context/LookupContext';


function arrJP(id, label, ket) {
    return { id, label, ket };
}



/*const metaJenisPenggunaan = [
    arrJP(1, 'Modal Kerja', 'kredit/pembiayaan yang diperuntukkan sebagai modal kerja debitur yang bersangkutan.'),
    arrJP(2, 'Investasi', 'kredit/pembiayaan yang diperuntukkan sebagai pembelian barang modal dan jasa yang diperlukan guna rehabilitasi, modernisasi, ekspansi, relokasi usaha '),
    arrJP(3, 'Konsumsi', 'kredit/pembiayaan yang diperuntukkan untuk keperluan konsumsi'),
];*/

function setMeta(isCheck, sandi, ket) {
    return { isCheck, sandi, ket}
}


/*const metaKategoriUsaha = [
    arrKU('kategoriusahadebitur', 1, 'UM', 'Debitur Usaha Mikro, Kecil, dan Menengah – Mikro'),
    arrKU('kategoriusahadebitur', 2, 'UK', 'Debitur Usaha Mikro, Kecil, dan Menengah - Kecil'),
    arrKU('kategoriusahadebitur', 3, 'UT', 'Debitur Usaha Mikro, Kecil, dan Menengah - Menengah'),
    arrKU('kategoriusahadebitur', 4, 'NU', 'Bukan Debitur Usaha Mikro, Kecil, dan Menengah')
]*/

export default function DevTableSandi(props) {
    const { lookup } = React.useContext(LookupContext);

    //const { changeSandi } = props;
    let lookupMeta = props.lookupMeta;
    let sandiVal = props.sandiVal;
    let rowDat;

    const [selectedRows, setSelectedRows] = React.useState([]);
    const [strSandi, setStrSandi] = React.useState("");
    const [metaLookup, setMetaLookup] = React.useState([]);

    const handleCheckboxChange = (row) => {
        changeSelectedRows(row);

    }

    async function fillMetaLookup(obj) {
        //const data = { ...metaLookup, obj };
        const objData = [];
        for (var idx = 0; idx < obj.length; idx++) {
            rowDat = setMeta(false, obj[idx].sandi, obj[idx].keterangan);
            objData.push(rowDat);
        }
        await setMetaLookup(objData);
        /*obj.map((row) => {
            rowDat = setMeta(false, row.sandi, row.keterangan);
            setMetaLookup(prevMeta => [...prevMeta, rowDat]);
        })*/
        //const lookup = { ...metaLookup, obj };
        //setMetaLookup(lookup.obj);
        await console.log("lookup meta: ", metaLookup);
    }

    async function changeSelectedRows(row) {
        var index;
        let tempselRows = [];
        if (selectedRows.length === 0) {
            //row.isCheck = true;
            tempselRows = [...selectedRows, row.sandi];
            await setSelectedRows(tempselRows);
            await setArrSandiStr(tempselRows);
        } else {
            if (selectedRows.includes(row.sandi)) {
                index = selectedRows.indexOf(row.sandi);
                row.isCheck = false;
                if (index >= -1) {    
                    selectedRows.splice(index, 1);
                    if (selectedRows.length !== 0) {
                        await setArrSandiStr(selectedRows);
                    } else {
                        await setStrSandi("");
                    }
                }
                
            } else {
                //row.isCheck = true;
                tempselRows = [...selectedRows, row.sandi];
                
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

    /*function handleSandi(event) {
        this.setSandiTxtProp(sandiTxtProp);
        event.preventDefault();
    };*/

    function sendSandi(event) {
        this.setSandiTxtProp(strSandi);
        event.preventDefault();
    };

    React.useEffect(() => {
        console.log("Array:" + selectedRows);
        fillMetaLookup(lookupMeta);
        // setArrSandiStr(selectedRows);
    }, [selectedRows, lookupMeta]);

    return (
        <Paper sx={{ width: '125%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440, m: 0 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" padding="checkbox" width='5%'>
                                <FormControlLabel
                                    value="end"
                                    control={<Checkbox
                                        color="primary"
                                    />}
                                    label="Select"
                                    labelPlacement="end"
                                />

                            </TableCell>
                            <TableCell align="left" width='15%'>&nbsp; SANDI &nbsp;</TableCell>
                            {/*<TableCell align="left" width='15%'>&nbsp; LABEL &nbsp;</TableCell>*/}
                            <TableCell align="left" width='70%'>&nbsp; KETERANGAN &nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            metaLookup.map((row,idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell padding="checkbox" width='5%'>
                                        <Checkbox
                                            color="primary" align="left"
                                            checked={selectedRows.includes(row.sandi)}
                                            onChange={() => handleCheckboxChange(row)}
                                            value={row.isCheck}
                                        />
                                    </TableCell>
                                    {/*<TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>*/}
                                    <TableCell component="th" scope="row">
                                        {row.sandi}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.ket}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {/*{
                            (lookupVal === '1')
                            ?
                            metaJenisPenggunaan.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary" align="left"
                                        checked={selectedRows.includes(row.id)}
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
                                    {row.ket}
                                </TableCell>
                            </TableRow>
                            ))
                                :
                                metaKategoriUsaha.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary" align="left"
                                                checked={selectedRows.includes(row.id)}
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
                                            {row.ket}
                                        </TableCell>
                                    </TableRow>
                                ))
                        }*/}
                        {}
                    </TableBody>
                </Table>
                
            </TableContainer>
            <br></br>&nbsp;
            < TextField
                id="filled-search"
                variant="filled"
                value={strSandi}
            />&nbsp;
            <Button variant="contained"
                onClick={() => sandiVal(strSandi)}
            >OK</Button>
                <br></br>
                
        </Paper>
    );
}