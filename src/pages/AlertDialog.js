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
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';

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
    const [sbOpen, setSbOpen] = React.useState(false);
    const [sbErrorOpen, setSbErrorOpen] = React.useState(false);

    const [resData, setResData] = React.useState([]);
    const [columnArr, setColumnArr] = React.useState([]);

    var result = props.result;

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const handleClickOpen = () => {
        setOpen(true);
        getQuery();
    };

    const handleClose = () => {
        setOpen(false);
        setIsSuccess("");
    };

    const handleSbClose = () => {
        setSbOpen(false);
        setSbErrorOpen(false);
    }

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
                            setResData(JSON.parse(JSON.stringify(res)));
                            setIsSuccess(true);
                            setSbOpen(true);
                            console.log("QUERY RESULT : ", JSON.stringify(response));
                        } else throw new Error(response);
                    })
                    .catch((e) => {
                        setIsSuccess(false);
                        setSbErrorOpen(true);
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
            await setQueryRes(result);
        }

        /*async function callQuery() {
            let res;

            if (result !== null) {
                const que = {
                    value: result
                }
                sendQuery(que)
                    .then(response => {
                        if (response.status === 200) {
                            res = response.data;
                            setResData(JSON.parse(JSON.stringify(res)));
                            setIsSuccess(true);
                            setSbOpen(true);
                            console.log("QUERY RESULT : ", JSON.stringify(response));
                        } else throw new Error(response);
                    })
                    .catch((e) => {
                        setIsSuccess(false);
                        setSbErrorOpen(true);
                        console.log("ERROR QUERY : ", e);
                    })
            }
        }*/

        /*if (result !== '')
            fillColumnArr()
            callQuery()*/
        /*if (queryRes.length > 0)
            getQuery()*/

    }, [result]);

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
                        
                        {isSuccess !== "" && resData.length > 0 ? (
                            (isSuccess === true) ? (
                                <Box margin={{
                                    top: 16,
                                    right: 16,
                                    bottom: 0,
                                    left: 24,
                                }}>
                                    <Stack spacing={2}>
                                        {/*<Item>*/}
                                        <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleSbClose}>
                                            <Alert severity="success" sx={{ width: '100%' }}>
                                                Query Success
                                            </Alert>
                                        </Snackbar>
                                        <ResTable
                                            dataResult={resData}
                                            columnTable={columnArr}
                                        />
                                        {/*</Item>*/}
                                        {/*<Item>*/}
                                            
                                        {/*</Item>*/}
                                    </Stack>
                                    <Stack>
                                        
                                    </Stack>
                                </Box>
                            )
                                : (
                                    <Snackbar open={setSbErrorOpen} autoHideDuration={6000} onClose={handleClose}>
                                    <Alert severity="error">
                                        <AlertTitle style={{ display: "flex" }}>Error</AlertTitle>
                                        Error! — <strong>Query submit failed, Please Check Query or Service</strong>
                                        </Alert>
                                    </Snackbar>
                                )
                        ) : null
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