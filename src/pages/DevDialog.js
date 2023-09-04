import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DevTableSandi from './DevTableSandi';
import { LookupContext } from '../context/LookupContext';

// Outlier object function Table Sandi
function arrJP(id, label, ket) {
    return { id, label, ket };
}

const metaJenisPenggunaan = [
    arrJP(1, 'Modal Kerja', 'kredit/pembiayaan yang diperuntukkan sebagai modal kerja debitur yang bersangkutan.'),
    arrJP(2, 'Investasi', 'kredit/pembiayaan yang diperuntukkan sebagai pembelian barang modal dan jasa yang diperlukan guna rehabilitasi, modernisasi, ekspansi, relokasi usaha '),
    arrJP(3, 'Konsumsi', 'kredit/pembiayaan yang diperuntukkan untuk keperluan konsumsi'),
];

function arrKU(grup, id, label, ket) {
    return { grup, id, label, ket }
}

const metaKategoriUsaha = [
    arrKU('kategoriusahadebitur', 1, 'UM', 'Debitur Usaha Mikro, Kecil, dan Menengah – Mikro'),
    arrKU('kategoriusahadebitur', 2, 'UK', 'Debitur Usaha Mikro, Kecil, dan Menengah - Kecil'),
    arrKU('kategoriusahadebitur', 3, 'UT', 'Debitur Usaha Mikro, Kecil, dan Menengah - Menengah'),
    arrKU('kategoriusahadebitur', 4, 'NU', 'Bukan Debitur Usaha Mikro, Kecil, dan Menengah')
]

//========================================

export default function DevDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xl');

    const [sandiTxt, setSandiTxt] = React.useState("");

    let { lookupVal } = React.useContext(LookupContext);

    let sandiVal = props.sandiVal;
    let rowCondition = props.rowCondition;
    let rowIndex = props.rowIndex;
    let metadata = props.metadata;

    const handleClickOpen = () => {
        setOpen(true);
        //console.log("rowCondition:", JSON.stringify(rowCondition));
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSandi = (val) => {
        
        if (val !== null) {
            //sendSandi(e)
            let rowitVal = [rowIndex, val];
            sandiVal = rowitVal;
            let valSandi = props.sandiVal;
            valSandi(rowitVal);
            setOpen(false);
        }
    }

    React.useEffect(() => {
        //console.log("LookupValD:", JSON.stringify(lookupVal));
        //console.log("Sandi Val: ", sandiVal)
    }, [lookupVal])

    // Table Sandi Function
    function TableSandiDev() {

    }
    //========================================

    return (
        <React.Fragment>
            {/*<LookupContext.Provider value={lookup}>*/}
            <Button variant="outlined" onClick={handleClickOpen}>
                Open Dialog
            </Button>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Optional sizes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>
                    <DevTableSandi lookupMeta={metadata} sandiVal={handleSandi} />
                    {/*{
                        rowCondition === '1' ?
                            <DevTableSandi lookupMeta={metaJenisPenggunaan} sandiVal={handleSandi} />
                            :
                            <DevTableSandi lookupMeta={metaKategoriUsaha} sandiVal={handleSandi} />
                    }*/}
                    
                    {/*<DevTableSandi changeSandi={handleChangeSandi} />*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            {/*</LookupContext.Provider>*/}
        </React.Fragment>
    );
}