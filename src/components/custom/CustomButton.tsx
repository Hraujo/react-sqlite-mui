import { CenterFocusWeakRounded } from '@mui/icons-material';
import { Button, styled} from '@mui/material';

export const CustomButton = styled(Button)({
    textTransform: 'none',
    '&:hover': {
        color: '#000',
        backgroundColor: '#cde38a',
    }
});