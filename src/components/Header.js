import React, { useState } from "react";

import clsx from "clsx";
import { useWeb3React } from "@web3-react/core";

// ** Import Material-Ui Components
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "@mui/material/Link";

// ** Import Redux
// import { theme_mode_store } from "../redux/actions/config";
import { useSelector, useDispatch } from "react-redux";

// ** Import Icons
// import NightsStayIcon from "@mui/icons-material/NightsStay";
// import WbSunnyIcon from "@mui/icons-material/WbSunny";

// ** Import Modules
import { useApi } from "../hooks";

// ** Import Assets
import useStyles from "../assets/styles";
import Logo from "../assets/img/logo.png";
import LogoMobile from "../assets/img/logoMobile.png";

// ** Import Components
import ConnectWallet from "./ConnectWallet";
import { ConnectedWallet } from "../assets/constants/wallets";

// import config from "../config/app";

// ** Import
const Header = () => {
    // ** Declare Maintainers
    const api = useApi();
    // const dispatch = useDispatch();
    const classes = useStyles.header();
    const isMobile = useMediaQuery("(max-width:600px)");

    const { account } = useWeb3React();

    const cWallet = ConnectedWallet();
    const [openWalletList, setOpenWalletList] = useState(false);

    // const { isDarkMode } = useSelector((state) => state.config);

    // const toggleDarkMode = () => {
    //     dispatch(theme_mode_store(!isDarkMode));
    // };

    return (
        <AppBar position="sticky" className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
                <Link href="https://automatic.network" underline="none">
                    <img className={classes.logo} src={isMobile ? LogoMobile : Logo} alt="logo" style={{ height: 60 }} />
                </Link>
                <div
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
                />
                <Box className={classes.actionGroup}>
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
                                       
                                    >
                                        Connect Wallet
                                    </Button>
                                )
                            }
                        })()}
                    </Box>
                    
                </Box>
            </Toolbar>
            <ConnectWallet
                isOpen={openWalletList}
                setIsOpen={setOpenWalletList}
            />
        </AppBar >
    );
};

export default Header;
