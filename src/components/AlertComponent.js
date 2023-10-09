import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Button } from '@mui/material';

export default function AlertComponent({ retryFetch, setIsConnectionError }) {

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', top: '10%', left: '0', position: 'fixed' }}>
            <Stack sx={{ width: '80%' }} spacing={1}>
                <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => {
                    retryFetch();
                    setIsConnectionError();
                }}>Retry</Button>} >
                    <AlertTitle style={{ display: 'flex' }}>Error</AlertTitle>Connection Error — <strong>Please check connection or service availability</strong>
                </Alert>
            </Stack>
        </div>
    );
}