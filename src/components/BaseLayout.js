import React, { useEffect } from "react";
import Header from "./Header";
// import Footer from "./Footer";
import Spinner from "./Spinner";
import useStyles from "../assets/styles";
import { Link } from "react-router-dom";

import clsx from "clsx";
import useMediaQuery from "@mui/material/useMediaQuery";

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import {ReactComponent as TraderJoe} from "../assets/img/icons/traderJoe.svg";
import {ReactComponent as Snowtrace} from "../assets/img/icons/snowtrace.svg";
import {ReactComponent as Dexscreener} from "../assets/img/icons/dexscreener.svg";
import {ReactComponent as CoinGecko} from "../assets/img/icons/coingecko.svg";
import {ReactComponent as CoinMarketCap} from "../assets/img/icons/coinmarketcap.svg";
import {ReactComponent as EtherScan} from "../assets/img/icons/etherscan.svg";

import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import { traderJoeUrl, dexscreenerUrl, coinGeckoUrl, coinMarketCapUrl, snowtraceUrl, twitterUrl, telegramUrl } from "../constants";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const BaseLayout = ({ children }) => {
  const classes = useStyles.base();
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (isMobile) setOpen(false);
    else setOpen(true);
  }, [isMobile])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    if (isMobile) setOpen(false);
    else setOpen(true);
  };

    return (
        <>
            <main
                className={clsx(classes.content, {
                    [classes.mobileContent]: isMobile,
                })}
            >
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="fixed" open={open}>
                        <Toolbar style={{padding:0}}>
                          <Header style={{padding:0}} />
                        </Toolbar>
                    </AppBar>
                    {isMobile && 
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, color: "inherit", zIndex:10000, position: "absolute", top: "100px", left: "20px", ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>}
                    <Drawer
                        sx={{
                          width: drawerWidth,
                          flexShrink: 0,
                          '& .MuiDrawer-paper': {
                              width: drawerWidth,
                              boxSizing: 'border-box',
                              top: '0',
                              zIndex: 1000,
                              marginTop: '88px',
                              paddingTop: '15px',
                              position: "absolute"
                          },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                      {isMobile && 
                      <>
                        <DrawerHeader>
                          <IconButton onClick={handleDrawerClose}>
                              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                          </IconButton>
                        </DrawerHeader>
                        <Divider />
                      </>}
                        <List
                        >
                            <ListItem button >
                                <ListItemIcon>
                                    <AutoAwesomeMosaicIcon />
                                </ListItemIcon>
                                <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleDrawerClose}>
                                  <ListItemText
                                    primary="Dashboard"
                                  />
                                </Link>
                            </ListItem>
                            {/* <ListItem button >
                                <ListItemIcon>
                                    <ShoppingCartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Buyback" />
                            </ListItem> */}
                            <ListItem button >
                                <ListItemIcon>
                                    <AccountBoxIcon />
                                </ListItemIcon>
                                <Link to="/Portfolio" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleDrawerClose}>
                                  <ListItemText
                                    primary="Portfolio"
                                  />
                                </Link>
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem button>
                              <ListItemIcon>
                                <TraderJoe style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: traderJoeUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="Buy on Trader Joe"/>
                              </Link>
                            </ListItem>
                            <ListItem button>
                              <ListItemIcon>
                                <Dexscreener style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: dexscreenerUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="Dexscreener"/>
                              </Link>
                            </ListItem>
                            <ListItem button>
                              <ListItemIcon>
                                <CoinGecko style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: coinGeckoUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="CoinGecko"/>
                              </Link>
                            </ListItem>
                            <ListItem button>
                              <ListItemIcon>
                                <CoinMarketCap style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: coinMarketCapUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="CoinMarketCap"/>
                              </Link>
                            </ListItem>
                            <ListItem button>
                              <ListItemIcon>
                                <Snowtrace style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: snowtraceUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="Snowtrace"/>
                              </Link>
                            </ListItem>
                            <ListItem button>
                              <ListItemIcon>
                                <TwitterIcon style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: twitterUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="Twitter"/>
                              </Link>
                            </ListItem>
                            <ListItem button>
                              <ListItemIcon>
                                <TelegramIcon style={{color:theme.palette.mode === "dark" ? "white": "black"}}/>
                              </ListItemIcon>
                              <Link to={{ pathname: telegramUrl }} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary="Telegram"/>
                              </Link>
                            </ListItem>
                        </List>
                    </Drawer>
                    <Main open={open}>
                        <DrawerHeader />
                        {children}
                    </Main>
                    </Box>
            </main>
            {/* <Footer /> */}
            <Spinner isLoading={false} />
        </>
    );
};
export default BaseLayout;
