import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import axios from "axios";
import JSONViewer from 'react-json-viewer';
import dataResult from '../smplResult.json';
import ResTable from './ResTable';
import { sendQuery } from "../services/api";

//const result = dataResult.data;

export default function AlertDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [queryRes, setQueryRes] = React.useState([]);
    const [isSuccess, setIsSuccess] = React.useState("");

    const [resData, setResData] = React.useState([]);
    const [columnArr, setColumnArr] = React.useState([]);

    var result = props.result;

    const handleClickOpen = () => {
        setOpen(true);
        getQuery();
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function getQuery() {
        let res;

        if (result !== null) {
            const que = {
                    value: result
            }

            //try {
                sendQuery(que)
                    .then(response => {
                        if (response.status === 200) {
                            res = response.data;
                            setQueryRes(JSON.parse(JSON.stringify(res)));
                            setIsSuccess(true);
                            console.log("QUERY RESULT : ", JSON.stringify(response));
                        } else throw new Error(response);
                    })
                    .catch((e) => {
                        setIsSuccess(false);
                        console.log("ERROR QUERY : ", e);
                    })
                /*const response = await axios.post("http://localhost:8080/reqQuery", que)
                if (response.ok) {
                    res = await response.data;
                    await setQueryRes(JSON.parse(JSON.stringify(res)));
                    setIsSuccess(true);
                    console.log("QUERY RESULT : ", JSON.stringify(response));
                }*/
                
            /*}
            catch (e){
                console.log("ERROR QUERY : ", e);
            }*/
        }
        //navigate("http://localhost:8080/reqQuery");
    }

    React.useEffect(() => {
        async function fillColumnArr() {
            let arrColumn = [];
            let data = result[0];
            arrColumn = Object.keys(data);
            await setColumnArr(arrColumn);
            await setResData(result);
        }

        if(result !== '') fillColumnArr()
        
    }, []);

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                PROCESS
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Query Result"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        
                        { isSuccess !== "" && queryRes.length > 0 ? (
                            (isSuccess === true) ? (
                                <Box margin={{
                                    top: 16,
                                    right: 16,
                                    bottom: 0,
                                    left: 24,
                                }}>
                                <Alert onClose={() => setIsSuccess("")}>
                                        Query Success
                                </Alert>
                                <ResTable
                                dataResult={queryRes}
                                columnTable={columnArr}
                                    />
                                </Box>
                            )
                                : (
                                    <Alert severity="error" onClose={() => setIsSuccess("")}>
                                        <AlertTitle style={{ display: "flex" }}>Error</AlertTitle>
                                        Error! — <strong>Query submit failed, Please Check Query or Service</strong>
                                    </Alert>
                                )
                        ) : <LinearProgress />
                        }
                            {/*(queryRes.length > 0)
                            ?
                            <ResTable
                                dataResult={queryRes}
                                columnTable={columnArr}
                            />
                            :
                            <LinearProgress />*/}
                        
                        {/*{
                            (resData.length > 0)
                                (queryRes !== null)
                                ?
                                
                                <JSONViewer
                                    json={queryRes}
                                />
                                :
                                <LinearProgress />
                        }*/}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>CLOSE</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}