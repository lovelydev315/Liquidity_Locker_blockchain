import React from "react";

// ** Import Material UI Components
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import SvgIcon from "@mui/material/SvgIcon";
import AppBar from "@mui/material/AppBar";

// ** Import Assets
import useStyles from "../assets/styles";

import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from '@mui/icons-material/Telegram';
import { ReactComponent as MediumIcon } from "../assets/img/medium.svg";

const Footer = () => {
    const classes = useStyles.footer();
    return (
        <AppBar
            position="static"
            component="footer"
            className={classes.footer}
        >
            <Toolbar className={classes.toolbar}>
                <Container maxWidth="md">
                    <Link href="https://github.com" underline="none">
                        <Button startIcon={<GitHubIcon />}>GITHUB</Button>
                    </Link>
                    <Link href="https://twitter.com/AutoMaticYield" underline="none">
                        <Button startIcon={<TwitterIcon />}>TWITTER</Button>
                    </Link>
                    <Link href="https://t.me/automaticnetwork" underline="none">
                        <Button startIcon={<TelegramIcon />}>TELEGRAM</Button>
                    </Link>
                    <Link href="https://medium.com/@AutoMaticNetwork" underline="none">
                        <Button
                            startIcon={
                                <SvgIcon
                                    component={MediumIcon}
                                    viewBox="0 0 512 512"
                                />
                            }
                        >
                            MEDIUM
                        </Button>
                    </Link>
                </Container>
            </Toolbar>
        </AppBar>

    );
};
export default Footer;
