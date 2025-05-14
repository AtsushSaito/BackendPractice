'use client';

import React, { ReactNode } from 'react';
import { Container as MuiContainer, Box, Paper, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppStyles } from '../../theme/useAppStyles';

interface ContainerProps extends BoxProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  withPaper?: boolean;
  paperElevation?: number;
  spacing?: number;
  paddingTop?: number | string;
  paddingBottom?: number | string;
}

const StyledContainer = styled(MuiContainer)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

export default function Container({
  children,
  maxWidth = 'lg',
  withPaper = false,
  paperElevation = 1,
  spacing = 3,
  paddingTop,
  paddingBottom,
  ...props
}: ContainerProps) {
  const styles = useAppStyles();

  return (
    <StyledContainer
      maxWidth={maxWidth}
      sx={{
        paddingTop: paddingTop !== undefined ? paddingTop : undefined,
        paddingBottom: paddingBottom !== undefined ? paddingBottom : undefined,
        ...styles.layout.container,
      }}
    >
      {withPaper ? (
        <StyledPaper elevation={paperElevation}>
          <Box
            {...props}
            sx={{
              '& > *:not(:last-child)': { marginBottom: spacing },
              ...props.sx,
            }}
          >
            {children}
          </Box>
        </StyledPaper>
      ) : (
        <Box
          {...props}
          sx={{
            '& > *:not(:last-child)': { marginBottom: spacing },
            ...props.sx,
          }}
        >
          {children}
        </Box>
      )}
    </StyledContainer>
  );
}
