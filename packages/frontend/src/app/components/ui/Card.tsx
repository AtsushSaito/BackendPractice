'use client';

import React, { ReactNode } from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Typography, Divider, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppStyles } from '../../theme/useAppStyles';

interface CardProps {
  title?: string | ReactNode;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  elevation?: number;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
}

// スタイル付きコンポーネント
const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export default function Card({
  title,
  subtitle,
  children,
  actions,
  elevation = 1,
  className,
  headerClassName,
  contentClassName,
  actionsClassName,
}: CardProps) {
  const styles = useAppStyles();

  return (
    <StyledCard 
      elevation={elevation} 
      className={className}
      sx={{ ...styles.card.root }}
    >
      {title && (
        <>
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography variant="h6" component="h2">
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            subheader={subtitle}
            className={headerClassName}
            sx={{ ...styles.card.header }}
          />
          <Divider />
        </>
      )}
      
      <CardContent className={contentClassName} sx={{ ...styles.card.content }}>
        {children}
      </CardContent>
      
      {actions && (
        <>
          <Divider />
          <CardActions className={actionsClassName} sx={{ ...styles.card.action }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              {actions}
            </Box>
          </CardActions>
        </>
      )}
    </StyledCard>
  );
} 