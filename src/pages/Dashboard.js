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
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
// ** Import Assets
import useStyles from "../assets/styles";

import { STATISTICS } from "../redux/constants";

import { CHAIN, TOKENADDRESS } from "../constants";
import { getTokenMetadata, getTokenPrice, getCommonFee, burntAndLeftTokenPercent, totalFees } from "../api";

const Dashboard = () => {

    const theme = useTheme();
    const classes = useStyles.pools();
    const mobileClasses = useStyles.mobile();
    const isMobile = useMediaQuery("(max-width:600px)");


    const statistics = useSelector(state => state.statistics);
    const dispatch = useDispatch();

    async function getStatisticsData() {

        Promise.all([
            getTokenMetadata(CHAIN, TOKENADDRESS),
            getTokenPrice(CHAIN, TOKENADDRESS),
            getCommonFee(CHAIN, TOKENADDRESS),
            burntAndLeftTokenPercent(CHAIN, TOKENADDRESS),
            totalFees(CHAIN, TOKENADDRESS),
        ]).then(result => {
            const metadata = result[0][0];
            const price = result[1];
            const commonFee = result[2];
            const burnAndLeft = result[3];
            const totalFee = result[4];
            const newStatistics = JSON.parse(JSON.stringify(statistics));
            newStatistics.price = price && price.usdPrice;
            newStatistics.totalReflection = Number(totalFee) / Math.pow(10, metadata.decimals);
            newStatistics.burnt = Number(burnAndLeft.burnt) / Math.pow(10, metadata.decimals);
            newStatistics.left = Number(burnAndLeft.left) / Math.pow(10, metadata.decimals);
            newStatistics.supplyLeft = `${burnAndLeft.leftPercent}%`;
            newStatistics.commonFee = commonFee;
            dispatch({
                type:STATISTICS,
                payload: newStatistics
            })
        }).catch(e => console.log(e))

    }

    useEffect(async () => {

        getStatisticsData();

        const timer = setInterval(async () => {
            getStatisticsData();
        }, 60000);

        return () => clearInterval(timer);

    }, []);

    const fn = (val, decimal = 4) => {
        if (!isNaN(Number(val))) {
            const trimVal = Number(Number(val).toFixed(decimal));
            const decimalVal = trimVal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return decimalVal;
        } else {
            return Number(0);
        }
    }

    const colors = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AF19FF'];

    const data = [
        { name: 'Current Supply', supply: statistics.left },
        { name: 'Total Burnt', supply: statistics.burnt }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        console.log(payload)
        if (active) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                    <label style={{ color: "#333", fontSize: 11 }}>{`${payload[0].name} : ${fn(payload[0].value, 2)}`}</label>
                </div>
            );
        }

        return null;
    };

    return (
        <Container className={classes.root} maxWidth="lg">
            <Box className={classes.info}>
                <Grid container spacing={3}>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                            <CardContent>
                                <Typography className="title" color="textSecondary">
                                    Current Supply vs Total Burnt
                                </Typography>
                                {
                                    isMobile ? 
                                    <PieChart width={window.innerWidth - 100} height={window.innerWidth > 300 ? 300 : 200}>
                                        <Pie 
                                            data={data}
                                            dataKey="supply"
                                            nameKey="name"
                                            fill="#8884d8"
                                            startAngle={90}
                                            endAngle={450}
                                            cx='50%'
                                            cy='50%'
                                            outerRadius='80%'
                                        >
    
                                            {
                                                data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
                                            }
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                    :
                                    <PieChart width={800} height={400}>
                                        <Pie 
                                            data={data}
                                            dataKey="supply"
                                            nameKey="name"
                                            fill="#8884d8"
                                            startAngle={90}
                                            endAngle={450}
                                            cx='50%'
                                            cy='50%'
                                            outerRadius='80%'
                                        >
    
                                            {
                                                data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
                                            }
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                            <CardContent>
                                <Typography className="title" color="textSecondary">
                                    Statistics
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{marginTop:20, borderBottom:theme.palette.mode==="dark"?"1px solid white":"1px solid black"}}
                                >
                                    <Grid item xs className="text-center">
                                        <span className="title" color="textSecondary" style={{fontWeight:'bold'}}>
                                            Metric
                                        </span>
                                    </Grid>
                                    <Grid item xs className="text-center">
                                        <span className="title" color="textSecondary" style={{fontWeight:'bold'}}>
                                            Value
                                        </span>
                                    </Grid>
                                </Grid>
                                {/* <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{marginTop:10, borderBottom:theme.palette.mode==="dark"?"1px solid white":"1px solid black"}}
                                >
                                    <Grid item xs className="text-center">
                                        <span color="textSecondary" >
                                            Token balance
                                        </span>
                                    </Grid>
                                    <Grid item xs className="text-center">
                                        {(() => {
                                            if (statistics.balance !== undefined) {
                                                return (
                                                    <span className="value big" color="textSecondary">
                                                        {fn(statistics.balance, 2)}
                                                    </span>
                                                )
                                            } else {
                                                return <span className="skelton"><Skeleton animation="wave" /></span>
                                            }
                                        })()}
                                    </Grid>
                                </Grid> */}
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{marginTop:10, borderBottom:theme.palette.mode==="dark"?"1px solid white":"1px solid black"}}
                                >
                                    <Grid item xs className="text-center">
                                        <span  color="textSecondary" >
                                            Total Reflections distributed
                                        </span>
                                    </Grid>
                                    <Grid item xs className="text-center">
                                        {(() => {
                                            if (statistics.totalReflection !== undefined) {
                                                return (
                                                    <span className="value big" color="textSecondary">
                                                        {fn(statistics.totalReflection, 2)}
                                                    </span>
                                                )
                                            } else {
                                                return <span className="skelton"><Skeleton animation="wave" /></span>
                                            }
                                        })()}
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{marginTop:10, borderBottom:theme.palette.mode==="dark"?"1px solid white":"1px solid black"}}
                                >
                                    <Grid item xs className="text-center">
                                        <span  color="textSecondary" >
                                            Number of tokens burnt
                                        </span>
                                    </Grid>
                                    <Grid item xs className="text-center">
                                        {(() => {
                                            if (statistics.burnt !== undefined) {
                                                return (
                                                    <span className="value big" color="textSecondary">
                                                        {fn(statistics.burnt, 2)}
                                                    </span>
                                                )
                                            } else {
                                                return <span className="skelton"><Skeleton animation="wave" /></span>
                                            }
                                        })()}
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{marginTop:10, borderBottom:theme.palette.mode==="dark"?"1px solid white":"1px solid black"}}
                                >
                                    <Grid item xs className="text-center">
                                        <span  color="textSecondary" >
                                            % of initial supply of tokens left
                                        </span>
                                    </Grid>
                                    <Grid item xs className="text-center">
                                        {(() => {
                                            if (statistics.supplyLeft !== undefined) {
                                                return (
                                                    <span className="value big" color="textSecondary">
                                                       {statistics.supplyLeft}
                                                    </span>
                                                )
                                            } else {
                                                return <span className="skelton"><Skeleton animation="wave" /></span>
                                            }
                                        })()}
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{marginTop:10, borderBottom:theme.palette.mode==="dark"?"1px solid white":"1px solid black"}}
                                >
                                    <Grid item xs className="text-center">
                                        <span  color="textSecondary" >
                                            Default Fee
                                        </span>
                                    </Grid>
                                    <Grid item xs className="text-center">
                                        {(() => {
                                            if (statistics.commonFee !== undefined) {
                                                return (
                                                    <span className="value big" color="textSecondary">
                                                        {fn(statistics.commonFee, 2)}%
                                                    </span>
                                                )
                                            } else {
                                                return <span className="skelton"><Skeleton animation="wave" /></span>
                                            }
                                        })()}
                                    </Grid>
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
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(Dashboard);
