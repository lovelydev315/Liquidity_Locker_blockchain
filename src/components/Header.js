import React, { useState, useEffect, useCallback } from "react";

import clsx from "clsx";
import { useWeb3React } from "@web3-react/core";

// ** Import Material-Ui Components
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// ** Import Redux
import { theme_mode_store } from "../redux/actions/config";
import { useSelector, useDispatch } from "react-redux";

// ** Import Icons
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LaunchIcon from "@mui/icons-material/Launch";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

// ** Import Modules
import { useHistory } from "react-router-dom";
import { useApi } from "../hooks";

// ** Import Assets
import useStyles from "../assets/styles";
import Logo from "../assets/img/team.png";

// ** Import Components
import ConnectWallet from "./ConnectWallet";
import { ConnectedWallet } from "../assets/constants/wallets";

import config from "../config/app";

// ** Import
const Header = () => {
    // ** Declare Maintainers
    const api = useApi();
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles.header();
    const isMobile = useMediaQuery("(max-width:600px)");
    const isIPad = useMediaQuery("(max-width:1024px)");

    const { account } = useWeb3React();

    const cWallet = ConnectedWallet();

    const [tokenEl, setTokenEl] = React.useState(null);
    const isOpenTokenMenu = Boolean(tokenEl);

    const [prices, setPrices] = useState({});
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openWalletList, setOpenWalletList] = useState(false);

    const { isDarkMode } = useSelector((state) => state.config);

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <AppBar position="sticky" className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
                <Link href="https://automatic.network" underline="none">
                    <img className={classes.logo} style={{width:"100px"}} src={Logo} alt="logo" />
                </Link>
                {/* <div
                    className={clsx({
                        [classes.hide]: isMobile,
                    })}
                    style={{ flex: 0.8 }}
                />
                <div
                    className={clsx({
                        [classes.hide]: isMobile,
                    })}
                    style={{ flex: 0.2 }}
                /> */}
                <Box className={classes.actionGroup}>
                    {
                        !isMobile && (
                            <>
                                <Link underline="none" target="_blank" href="https://dory-pilkunnussija.gitbook.io/automatic-whitepaper/">
                                    <span
                                        className={classes.btnHeader}
                                    >
                                        Explorer
                                    </span>
                                </Link>
                                <Link underline="none" target="_blank" href="https://dory-pilkunnussija.gitbook.io/automatic-whitepaper/">
                                    <span
                                        className={classes.btnHeader}
                                    >
                                        About
                                    </span>
                                </Link>
                                <Link underline="none" target="_blank" href="https://dory-pilkunnussija.gitbook.io/automatic-whitepaper/">
                                    <span
                                       className={classes.btnHeader}
                                    >
                                        Lockups
                                    </span>
                                </Link>
                                <Link underline="none" target="_blank" href="https://dory-pilkunnussija.gitbook.io/automatic-whitepaper/">
                                    <span
                                        className={classes.btnHeader}
                                    >
                                        Mint
                                    </span>
                                </Link>
                                <Link underline="none" target="_blank" href="https://dory-pilkunnussija.gitbook.io/automatic-whitepaper/">
                                    <span
                                        className={classes.btnHeader}
                                    >
                                        Vesting
                                    </span>
                                </Link>
                                
                            </>
                        )
                    }
                    <Box className={classes.connectWallet}>
                        {(() => {
                            if (account) {
                                return (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={
                                            cWallet && <img width={22} src={cWallet.logo} alt={cWallet.name} />
                                        }
                                        onClick={() => {
                                            setOpenWalletList(true);
                                        }}
                                        className={isMobile ? classes.hide : ""}
                                    >
                                        {`${account.substring(0, 8)} ... ${account.substring(account.length - 4)}`}
                                    </Button>
                                )
                            } else {
                                return (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setOpenWalletList(true);
                                        }}
                                        className={isMobile ? classes.hide : ""}
                                    >
                                        Connect Wallet
                                    </Button>
                                )
                            }
                        })()}
                    </Box>
                    {/* <IconButton
                        color="inherit"
                        onClick={() => toggleDarkMode()}
                        className={classes.darkModeButton}
                    >
                        {isDarkMode ? <NightsStayIcon /> : <WbSunnyIcon />}
                    </IconButton> */}
                    <IconButton
                        color="inherit"
                        onClick={() => toggleDrawer()}
                        className={clsx(classes.drawerButton, {
                            [classes.hide]: !isMobile,
                        })}
                    >
                        <MenuOpenIcon />
                    </IconButton>
                </Box>
            </Toolbar>
            {/* <Drawer
                open={openDrawer}
                anchor="bottom"
                className={classes.drawer}
                onClose={() => toggleDrawer()}
            >
                <List>
                    <ListItem button >
                        <ListItemText>Matic Network</ListItemText>
                        <ListItemIcon>
                            <img width={28} src="https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912" alt="Net" />
                        </ListItemIcon>
                    </ListItem>
                    <ListItem button >
                        <ListItemText>Add AUMI to your MetaMask
                        </ListItemText>
                        <ListItemIcon>
                            <img width={28} src={config.aumi.img} alt="Token" />
                        </ListItemIcon>
                    </ListItem>
                    <Link underline="none" target="_blank" href="https://quickswap.exchange/#/swap?outputCurrency=0x3eB177A6693eC81d1E170136f8AD02fffBE172a7">
                        <ListItem button>
                            <ListItemText>Buy Token</ListItemText>
                            <ListItemIcon>
                                <ShoppingCartRoundedIcon />
                            </ListItemIcon>
                        </ListItem>
                    </Link>
                    <Link underline="none" target="_blank" href="https://dory-pilkunnussija.gitbook.io/automatic-whitepaper/">
                        <ListItem button>
                            <ListItemText>Docs</ListItemText>
                            <ListItemIcon>
                                <LaunchIcon />
                            </ListItemIcon>
                        </ListItem>
                    </Link>
                    <ListItem button onClick={() => history.push("/pools")}>
                        <ListItemText>Pools</ListItemText>
                        <ListItemIcon>
                            <LaunchIcon />
                        </ListItemIcon>
                    </ListItem>
                    <ListItem>
                        <Button
                            variant="contained"
                            startIcon={
                                <img width={28} src={cWallet.logo} alt={cWallet.name} />
                            }
                            onClick={() => {
                                setOpenWalletList(true);
                            }}
                            className="connectButton"
                        >
                            {account
                                ? `${account.substring(
                                    0,
                                    8
                                )} ... ${account.substring(
                                    account.length - 4
                                )}`
                                : "Connect Wallet"}
                        </Button>
                    </ListItem>
                </List>
            </Drawer> */}
            <ConnectWallet
                isOpen={openWalletList}
                setIsOpen={setOpenWalletList}
            />
        </AppBar >
    );
};

export default Header;
