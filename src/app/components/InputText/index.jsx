import { FilledInput, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const InputText = ({
    onClear,
    value
}) => {
    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <FilledInput
                value={value}
                endAdornment={<ClearIcon
                    sx={{
                        cursor: 'pointer'
                    }}
                    fontSize="large"
                    onClick={e => {
                        e.preventDefault()
                        onClear()
                    }} />}
            />
        </FormControl>
    );
}

export default InputText;