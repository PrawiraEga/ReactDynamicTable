const [opr, setOpr] = React.useState('');
const OprHandleChange = (event) => {
    setOpr(+event.target.value);
}

return (
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
    );