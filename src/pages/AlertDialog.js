import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import axios from "axios";
import JSONViewer from 'react-json-viewer';

export default function AlertDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [queryRes, setQueryRes] = React.useState(null);
    let result = props.result;

    const handleClickOpen = () => {
        setOpen(true);
        getQuery();
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function getQuery() {
        let res;
        const que = {
            value: result
        }
        
        const response = await axios.post("http://localhost:8080/sendQuery", que)
        res = await response.data;
        await setQueryRes(JSON.parse(JSON.stringify(res)));
        console.log("QUERY RESULT : ", JSON.stringify(response));
        //navigate("http://localhost:8080/sendQuery");
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                PROCESS
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Query Result"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {(queryRes !== null)
                            ?
                            <JSONViewer
                                json={queryRes}
                            />
                            : <LinearProgress />
                        }

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>CLOSE</Button>
               
                </DialogActions>
            </Dialog>
        </div>
    );
}