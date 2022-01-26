import React, { useEffect, useState } from "react";

import { useTheme } from '@mui/material/styles';
import {connect, useSelector, useDispatch} from 'react-redux';

// ** Import Material UI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import Container from "@mui/material/Container";

import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from '@mui/material/Modal';
import {  RadioGroup } from "@mui/material";
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Search from '@mui/icons-material/Search';
import { TextField } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';

// import { autoPlay } from 'react-swipeable-views-utils';

// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
// ** Import Assets
import useStyles from "../assets/styles";

import { STATISTICS } from "../redux/constants";

import { CHAIN, TOKENADDRESS } from "../constants";
import { getTokenMetadata, getTokenPrice, getCommonFee, burntAndLeftTokenPercent, totalFees } from "../api";

const Dashboard = () => {

    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [network, setNetwork] = useState("Ethereum");
    const [subMethod, setSubMethod] = useState("Liquidity Tokens");
    const maxSteps = 4;
    const theme = useTheme();
    const classes = useStyles.pools();
    const mobileClasses = useStyles.mobile();
    const isMobile = useMediaQuery("(max-width:600px)");
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius:'10px',
        boxShadow: 24,
        p: 4,
    };
    const colors = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AF19FF'];

    const [values, setValues] = React.useState({
        tokenAddress:"",
    });

    const handleNext = () => {
        if (network === "Polygon") {
            handleOpen();
            console.log("polygon");
        }else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    
    const handleClickSearch = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

    const data = [
        { name: 'Current Supply', supply: statistics.left },
        { name: 'Total Burnt', supply: statistics.burnt }
    ];

    const networkData= [
        {name:"Ethereum", subtitle:"Choose if your coin is an ERC-20 Token", url:"/networks/ethereum.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Binance Smart Chain", subtitle:"Choose if your coin is built on BSC", url:"/networks/binance.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Avalanche", subtitle:"Choose if your coin is built on AVAX", url:"/networks/avalanche.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Conflux", subtitle:"Choose if your coin is built on Conflux", url:"/networks/conflux.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Polygon", subtitle:"Choose if your coin is built on Polygon", url:"/networks/polygon.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Pulse Chain", subtitle:"Choose if your coin is built on Pulse Chain", url:"/networks/pulsechain.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Cronos", subtitle:"Choose if your coin is built on Cronos", url:"/networks/cronos.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Heco", subtitle:"Choose if your coin is built on Heco", url:"/networks/heco.png", subData:[{name:"Liquidity Tokens", subTitle:"Cake-LP LP Tokens Generated From PancakeSwap Pool", url:"/liquidity.png"},{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
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
                        
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={6} md={6} >
                        <Card className="card">
                        <CardHeader
                            style={{background:"#cccccc"}}
                            title="Create New Lock"
                        />
                            <CardContent >
                                <img src="/lock.png" />
                                
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    style={{width:'100%'}}
                                >
                                    <SwipeableViews
                                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                        index={activeStep}
                                        onChangeIndex={handleStepChange}
                                        
                                    >
                                       
                                        <div key={1} style={{paddingLeft:10, paddingRight:10}}>
                                            <p style={{textAlign:'center'}} color="textSecondary">
                                                Choose the blockchain network.
                                            </p>
                                            {
                                                networkData.map((item)=>
                                                <Grid
                                                    className={classes.networkSelector}
                                                    container
                                                    direction="row"
                                                    justifyContent="space-evenly"
                                                    alignItems="center"
                                                    style={{padding:"10px 0px", border:item.name==network?"1px solid #e55370":"1px solid white", borderRadius:'5px'}}
                                                    key={item.name}
                                                    onClick = {()=>setNetwork(item.name)}
                                                >
                                                    <Grid item  xs={10} sm={11} md={11}>
                                                        <Grid 
                                                            container
                                                            direction="row"
                                                            
                                                            alignItems="center"
                                                        >
                                                            <Grid item className="text-center" xs={3} sm={2} md={2}>
                                                                <img style={{height:40}} src={item.url} alt="network" />
                                                            </Grid>
                                                            <Grid item   xs={9} sm={10} md={10}>
                                                                <p className="title" color="textSecondary" style={{fontWeight:'bold', margin:0}}>
                                                                    {item.name}
                                                                </p>
                                                                <p className="title" color="textSecondary" style={{fontSize:12, color:'grey', marginTop:5, marginBottom:0}}>
                                                                    {item.subtitle}
                                                                </p>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item  className="text-center" xs={2} sm={1} md={1}>
                                                        {item.name==network ? <div style={{width:"20px", height:'20px', borderRadius:"10px", backgroundColor:'#e55370', display:'inline-block'}} />: <div style={{width:"20px", height:'20px', borderRadius:"10px", border:'1px solid #e55370', display:'inline-block'}} />}
                                                    </Grid>
                                                </Grid>
                                                )
                                            }
                                        </div>
                                        <div key={2} style={{paddingLeft:10, paddingRight:10}}>
                                            <p style={{textAlign:'center'}} color="textSecondary">
                                                Select the type of token you would like to create a lock for.
                                                You can create multiple locks with different settings for each one.
                                            </p>
                                            {
                                                network !="" && networkData.find((item)=>item.name==network).subData.map((each)=><Grid
                                                className={classes.networkSelector}
                                                container
                                                direction="row"
                                                justifyContent="space-evenly"
                                                alignItems="center"
                                                style={{padding:"10px 0px", border:each.name==subMethod?"1px solid #e55370":"1px solid white", borderRadius:'5px'}}
                                                key={each.name}
                                                onClick = {()=>setSubMethod(each.name)}
                                            >
                                                <Grid item  xs={10} sm={11} md={11}>
                                                    <Grid 
                                                        container
                                                        direction="row"
                                                        
                                                        alignItems="center"
                                                    >
                                                        <Grid item className="text-center" xs={3} sm={2} md={2}>
                                                            <img style={{height:40}} src={each.url} alt="network" />
                                                        </Grid>
                                                        <Grid item   xs={9} sm={10} md={10}>
                                                            <p className="title" color="textSecondary" style={{fontWeight:'bold', margin:0}}>
                                                                {each.name}
                                                            </p>
                                                            <p className="title" color="textSecondary" style={{fontSize:12, color:'grey', marginTop:5, marginBottom:0}}>
                                                                {each.subTitle}
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item  className="text-center" xs={2} sm={1} md={1}>
                                                    {each.name==subMethod ? <div style={{width:"20px", height:'20px', borderRadius:"10px", backgroundColor:'#e55370', display:'inline-block'}} />: <div style={{width:"20px", height:'20px', borderRadius:"10px", border:'1px solid #e55370', display:'inline-block'}} />}
                                                </Grid>
                                            </Grid>)
                                            }
                                            
                                        </div>
                                        <div key={3} style={{paddingLeft:10, paddingRight:10}}>
                                            <p style={{textAlign:'center'}} color="textSecondary">
                                                Enter the pancakeswap pair address you would like to lock liquidity for
                                            </p>
                                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" style={{width:'-webkit-fill-available'}}>
                                                <InputLabel htmlFor="outlined-adornment-password">Token Address</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type="text"
                                                    value={values.tokenAddress}
                                                    onChange={handleChange('tokenAddress')}
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                        aria-label="toggle search"
                                                        onClick={handleClickSearch}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        >
                                                        <Search />
                                                        </IconButton>
                                                    </InputAdornment>
                                                    }
                                                    label="Password"
                                                />
                                            </FormControl>
                                            <div style={{paddingLeft:20, paddingRight:20}}>
                                                <p style={{margin:"0px"}}>Token Found</p>
                                                <Grid 
                                                    container
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Grid item style={{textAlign:'left'}} xs={3} sm={2} md={2}>
                                                        <img style={{height:30}} src="/lock.png" alt="network" />
                                                        <p className="title" color="textSecondary" style={{fontWeight:'bold', margin:0}}>
                                                            ICC
                                                        </p>
                                                    </Grid>
                                                    <Grid item style={{textAlign:'right'}}  xs={9} sm={10} md={10}>
                                                        <Button variant="contained" color="error" sm>Select</Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                        <div key={4} style={{paddingLeft:10, paddingRight:10}}>
                                            <Grid 
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                style={{borderRadius:10, border:"1px solid #e55370", padding:"10px 20px"}}
                                            >
                                                <Grid item style={{textAlign:'left'}} xs={6} sm={6} md={6}>
                                                    <TextField
                                                        id="standard-number"
                                                        label="Lock Amount"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                            inputProps: { min: 1 }
                                                        }}
                                                        InputProps={{ inputProps: { min: 1 } }}
                                                        variant="standard"
                                                    />
                                                </Grid>
                                                <Grid item style={{textAlign:'right'}}  xs={6} sm={6} md={6}>
                                                    <p style={{marginBottom:2, marginTop:0}}>Balance: </p>
                                                    <Grid 
                                                        container
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Grid item style={{textAlign:'left'}} xs={6} sm={6} md={6}>
                                                            <Button variant="contained" color="error" sm>Max</Button>
                                                        </Grid>
                                                        <Grid item style={{textAlign:'right'}} xs={6} sm={6} md={6}>
                                                            <img style={{height:30}} src="/lock.png" alt="network" />
                                                            <p className="title" color="textSecondary" style={{fontWeight:'bold', marginTop:0, marginBotton:0, marginLeft:10, display:"inline", position:'relative', top:'-8px'}}>
                                                                ICC
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <div className="text-center" style={{padding:"10px 0px"}}>
                                                <LockIcon />
                                            </div>
                                            <Grid 
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                style={{borderRadius:10, border:"1px solid #e55370", padding:"10px 20px"}}
                                            >
                                                <Grid item style={{textAlign:'left'}} xs={6} sm={6} md={6}>
                                                    <TextField
                                                        id="standard-number"
                                                        label="Unlock Date"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                            inputProps: { min: 1 }
                                                        }}
                                                        InputProps={{ inputProps: { min: 1 } }}
                                                        variant="standard"
                                                    />
                                                </Grid>
                                                <Grid item style={{textAlign:'right'}}  xs={6} sm={6} md={6}>
                                                    <p style={{marginBottom:2, marginTop:0}}>Balance: </p>
                                                    <Grid 
                                                        container
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Grid item style={{textAlign:'left'}} xs={6} sm={6} md={6}>
                                                            <Button variant="contained" color="error" sm>Max</Button>
                                                        </Grid>
                                                        <Grid item style={{textAlign:'right'}} xs={6} sm={6} md={6}>
                                                            <img style={{height:30}} src="/lock.png" alt="network" />
                                                            <p className="title" color="textSecondary" style={{fontWeight:'bold', marginTop:0, marginBotton:0, marginLeft:10, display:"inline", position:'relative', top:'-8px'}}>
                                                                ICC
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </SwipeableViews>
                                    <MobileStepper
                                        steps={maxSteps}
                                        position="static"
                                        activeStep={activeStep}
                                        nextButton={
                                        <Button
                                            size="small"
                                            onClick={handleNext}
                                            disabled={activeStep === maxSteps - 1}
                                        >
                                            Next
                                            {theme.direction === 'rtl' ? (
                                            <KeyboardArrowLeft />
                                            ) : (
                                            <KeyboardArrowRight />
                                            )}
                                        </Button>
                                        }
                                        backButton={
                                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                            {theme.direction === 'rtl' ? (
                                            <KeyboardArrowRight />
                                            ) : (
                                            <KeyboardArrowLeft />
                                            )}
                                            Back
                                        </Button>
                                        }
                                    />
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    
                    {networkData.find((item)=>item.name==network) && <div style={{textAlign:'center'}}><img style={{width:"50px"}} src={networkData.find((item)=>item.name==network).url} alt="network" /></div>}
                    <h3 id="modal-modal-title" variant="h6" component="h2" style={{textAlign:'center', marginTop:0}}>
                        Switch Network to {network}
                    </h3>
                    <p id="modal-modal-description" sx={{ mt: 2 }} style={{textAlign:'center', fontSize:12, color:'grey'}}>
                        Before you can create a lock on {network}, you must connect your wallet to {network} network on your wallet. Use testnet for test transactions, and mainnet for real token locks.
                    </p>
                    <Button variant="contained" color="error" style={{width:'100%'}} onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </Container >
    )
}
const mapStateToProps = state => ({
    statistics: state.statistics,
})

export default connect(mapStateToProps)(Dashboard);
