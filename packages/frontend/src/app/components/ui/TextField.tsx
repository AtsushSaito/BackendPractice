'use client';

import React from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  id?: string;
  label?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  helperText?: React.ReactNode;
  error?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  width?: string | number;
  fullWidth?: boolean;
}

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function TextField({
  id,
  label,
  variant = 'outlined',
  helperText,
  error = false,
  startAdornment,
  endAdornment,
  width,
  fullWidth = true,
  ...props
}: TextFieldProps) {
  const inputProps = {
    ...(startAdornment && {
      startAdornment: (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      ),
    }),
    ...(endAdornment && {
      endAdornment: (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
      ),
    }),
  };

  return (
    <FormControl error={error} fullWidth={fullWidth} sx={{ width }}>
      <StyledTextField
        id={id}
        label={label}
        variant={variant}
        error={error}
        fullWidth={fullWidth}
        InputProps={Object.keys(inputProps).length ? inputProps : undefined}
        {...props}
      />
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
