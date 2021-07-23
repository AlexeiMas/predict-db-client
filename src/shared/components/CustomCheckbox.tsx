import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 0,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(155, 156, 183, 1), inset 0 -1px 0 rgba(155, 156, 183, 1)',
    color: '#9B9CB7',
    backgroundColor: '#f9f9fb',
    'input:hover ~ &': {
      backgroundColor: '#EEEEF2',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#f9f9fb',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-2 -3 16 16' fill-rule='evenodd' clip-rule='evenodd' fill='none'%3E%3Cpath" +
        " d='M11 1L4 8L1 5' stroke='%239B9CB7' stroke-width='1.2' stroke-linejoin='bevel'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#EEEEF2',
    },
  },
});

function CustomCheckbox(props: CheckboxProps) {
  const classes = useStyles();

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
}

export default CustomCheckbox;
