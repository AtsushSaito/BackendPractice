'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider,
  Container,
  useMediaQuery 
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { User } from '../types';

// スタイル付きコンポーネント
const NavbarLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  '&:hover': {
    textDecoration: 'none',
    opacity: 0.8,
  },
}));

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // メニュー関連の状態
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  useEffect(() => {
    // ログイン状態を確認
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // ログインユーザー情報を取得する処理
          // Next.jsのAPIルートを使用してCORSを回避
          const response = await fetch('/api/auth/profile', {
            headers: {
              Authorization: token.startsWith('Bearer ')
                ? token
                : `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // トークンが無効な場合
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('認証エラー:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    handleMenuClose();
    router.push('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo and Title */}
          <Typography
            variant="h6"
            component={NavbarLink}
            href="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.1rem',
              mr: 2,
              ml: 0
            }}
          >
            スレッド掲示板
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" component={NavbarLink} href="/">
                ホーム
              </Button>

              {!isLoading && !user && (
                <>
                  <Button color="inherit" component={NavbarLink} href="/login">
                    ログイン
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    component={NavbarLink} 
                    href="/register"
                    sx={{ ml: 1, border: '1px solid white' }}
                  >
                    アカウント登録
                  </Button>
                </>
              )}

              {!isLoading && user && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {user.username}さん
                    </Typography>
                    <IconButton
                      onClick={handleMenuOpen}
                      color="inherit"
                      size="small"
                      edge="end"
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Box>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { minWidth: '180px' }
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2">{user.username}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              
              <Menu
                anchorEl={mobileAnchorEl}
                open={Boolean(mobileAnchorEl)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: '180px' }
                }}
              >
                <MenuItem onClick={handleMobileMenuClose} component={Link} href="/">
                  ホーム
                </MenuItem>
                
                {!isLoading && !user && (
                  <>
                    <MenuItem onClick={handleMobileMenuClose} component={Link} href="/login">
                      ログイン
                    </MenuItem>
                    <MenuItem onClick={handleMobileMenuClose} component={Link} href="/register">
                      アカウント登録
                    </MenuItem>
                  </>
                )}
                
                {!isLoading && user && (
                  <>
                    <MenuItem disabled>
                      <Typography variant="body2">{user.username}さん</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                  </>
                )}
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
