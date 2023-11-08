import Button from '@mui/material/Button';

export const ImpenetrableButton = (props) => {
    const { onClick = () => {}, ...otherProps } = props;
    const handleClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
    };

    return(
    <Button 
    onClick={handleClick} {...otherProps} ></Button>)
}