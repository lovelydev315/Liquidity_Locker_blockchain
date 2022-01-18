import React, { useEffect } from "react";

import { useTheme } from '@mui/material/styles';
import {connect, useSelector, useDispatch} from 'react-redux';

// ** Import Material UI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Skeleton from '@mui/material/Skeleton';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import useMediaQuery from "@mui/material/useMediaQuery";
// ** Import Assets
import useStyles from "../assets/styles";

import { STATISTICS } from "../redux/constants";

import { CHAIN, TOKENADDRESS } from "../constants";
import { getTokenMetadata, getTokenBalance, getTokenPrice, getCurrentFee, burntAndLeftTokenPercent, totalFees, walletExchange } from "../api";

const Portfolio = () => {

    const theme = useTheme();
    const classes = useStyles.pools();
    const mobileClasses = useStyles.mobile();
    const isMobile = useMediaQuery("(max-width:600px)");


    const statistics = useSelector(state => state.statistics);
    const walletAddress = useSelector(state => state.walletAddress);
    const dispatch = useDispatch();

    async function getStatisticsData(address) {

        Promise.all([
            getTokenMetadata(CHAIN, TOKENADDRESS),
            getTokenBalance(CHAIN, TOKENADDRESS, address),
            getTokenPrice(CHAIN, TOKENADDRESS),
            walletExchange(CHAIN, TOKENADDRESS, address),
            // getCurrentFee(CHAIN, TOKENADDRESS, walletAddress.address),
        ]).then(result => {
            const metadata = result[0][0];
            const balanceData = result[1][0];

            const price = result[2];
            const buy_sell = result[3];
            const balance = balanceData ? balanceData.balance : 0;
            const newStatistics = JSON.parse(JSON.stringify(statistics));
            newStatistics.balance = balance / Math.pow(10, metadata.decimals);
            newStatistics.profit = (Number(balance) + buy_sell.sell - buy_sell.buy) / Math.pow(10, metadata.decimals);
            newStatistics.price = price && price.usdPrice;
            dispatch({
                type:STATISTICS,
                payload: newStatistics
            })
        }).catch(e => console.log(e))

    }

    useEffect(() => {
        if (!walletAddress.address) return;

        getStatisticsData(walletAddress.address);

        let timer = setInterval(() => {
            getStatisticsData(walletAddress.address);
        }, 60000);
        return () => {
            clearInterval(timer)
        };

    }, [walletAddress]);

    const fn = (val, decimal = 4) => {
        if (!isNaN(Number(val))) {
            const trimVal = Number(Number(val).toFixed(decimal));
            const decimalVal = trimVal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return decimalVal;
        } else {
            return Number(0);
        }
    }

    return (
        <Container className={classes.root} maxWidth="lg">
            <Box className={classes.info}>
                <Grid container spacing={3}>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} >
                        <Card className="card">
                            <CardContent sx={{ alignItems: "self-start !important" }}>
                                <Typography className="title" color="textSecondary" sx={{ marginBottom: "10px" }}>
                                    My Wallet
                                </Typography>
                                <Typography className="text" color="textSecondary" sx={{ paddingLeft: "20px" }}>
                                    {walletAddress.address}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                            <CardContent>
                                <Typography className="title" color="textSecondary">
                                    Balance ($BN)
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={isMobile ? { height: "50px" } : { height: "200px" }}
                                >
                                    {(() => {
                                        if (statistics.balance !== undefined) {
                                            return (
                                                <span className="value big" color="textSecondary" style={isMobile ? { padding: 10 } : { padding: 20 }}>
                                                    {fn(statistics.balance, 2)}
                                                </span>
                                            )
                                        } else {
                                            return <span className="skelton" style={isMobile ? { padding: 10 } : { padding: 20 }}><Skeleton animation="wave" /></span>
                                        }
                                    })()}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                            <CardContent>
                                <Typography className="title" color="textSecondary">
                                    Balance Value ($USD)
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={isMobile ? { height: "50px" } : { height: "200px" }}
                                >
                                    {(() => {
                                        if (statistics.balance !== undefined) {
                                            return (
                                                <span className="value big" color="textSecondary" style={isMobile ? { padding: 10 } : { padding: 20 }}>
                                                    ${fn(statistics.balance * statistics.price, 2)}
                                                </span>
                                            )
                                        } else {
                                            return <span className="skelton" style={isMobile ? { padding: 10 } : { padding: 20 }}><Skeleton animation="wave" /></span>
                                        }
                                    })()}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                            <CardContent>
                                <Typography className="title" color="textSecondary">
                                    Reflections Earned ($BN)
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={isMobile ? { height: "50px" } : { height: "200px" }}
                                >
                                    {(() => {
                                        if (statistics.balance !== undefined) {
                                            return (
                                                <span className="value big" color="textSecondary" style={isMobile ? { padding: 10 } : { padding: 20 }}>
                                                    {fn(statistics.profit, 2)}
                                                </span>
                                            )
                                        } else {
                                            return <span className="skelton" style={isMobile ? { padding: 10 } : { padding: 20 }}><Skeleton animation="wave" /></span>
                                        }
                                    })()}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                            <CardContent>
                                <Typography className="title" color="textSecondary">
                                    Reflections Earned ($USD)
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={isMobile ? { height: "50px" } : { height: "200px" }}
                                >
                                    {(() => {
                                        if (statistics.balance !== undefined) {
                                            return (
                                                <span className="value big" color="textSecondary" style={isMobile ? { padding: 10 } : { padding: 20 }}>
                                                    ${fn(statistics.profit * statistics.price, 2)}
                                                </span>
                                            )
                                        } else {
                                            return <span className="skelton" style={isMobile ? { padding: 10 } : { padding: 20 }}><Skeleton animation="wave" /></span>
                                        }
                                    })()}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                </Grid>
            </Box>
        </Container >
    )
}
// export default Portfolio
const mapStateToProps = state => ({
    statistics: state.statistics,
    walletAddress: state.walletAddress
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(Portfolio);
