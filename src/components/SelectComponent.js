import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function SelectComponent({
    disabled,
    labelString,
    objectName,
    objectVariable,
    setVariable,
    dataOptions,
    error = false,
    fullWidth
}) {

    return (
        <Autocomplete
            ListboxProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
            disabled={disabled}
            fullWidth={fullWidth}
            disablePortal
            id="comboBox"
            name={objectName}
            value={objectVariable}
            onChange={(event, value) => setVariable(value)}
            options={dataOptions}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label={labelString} error={error} helperText={error ? `${labelString} is required` : null} margin="normal" />}
        />
    );
}