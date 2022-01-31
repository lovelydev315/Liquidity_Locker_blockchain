import React, { useEffect, useState } from "react";

import { useTheme } from '@mui/material/styles';
import {connect, useSelector, useDispatch} from 'react-redux';
import {useWeb3React} from "@web3-react/core";

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
import { TextField, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import Link from "@mui/material/Link";
import LockIcon from '@mui/icons-material/Lock';
import Web3 from "web3"

import useStyles from "../assets/styles";

import { TOKENDATA, USERBALANCE } from "../redux/constants";

import { walletconnect } from "../assets/constants/connectors";

import {  CHAINDATA } from "../constants";
import { getTokenMetadata } from "../api";
import { tokenData } from "../redux/reducers";
import { deposit, withdraw, approve, allowance, getTokenBalance, getUserData } from "../web3"

const Dashboard = () => {

    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [network, setNetwork] = useState("Avalanche");
    const [modalTitle, setModalTitle] = useState("");
    const [modalDes, setModalDes] = useState("");
    const [subMethod, setSubMethod] = useState("Project Tokens"); 
    const [lockAmount, setLockAmount] = useState(0);
    const [widthrawDate, setWidthrawDate] = useState(0);
    const [dateUseful, setDateUseful] = useState(false);
    const [userData, setUserData] = useState([]);
    const [isAllowed, setIsAllowed] = useState(0);// 0: checking, 1: not allowed, 2: allowed
    const maxSteps = 4;
    const theme = useTheme();
    const classes = useStyles.pools();
    const mobileClasses = useStyles.mobile();
    const dashboardClasses = useStyles.dashboard();
    const isMobile = useMediaQuery("(max-width:600px)");
    const userBalance = useSelector(state => state.userBalance);
    const token = useSelector(state => state.tokenData);

    const dispatch = useDispatch();

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

    const { account, connector } = useWeb3React();

    const [values, setValues] = React.useState({
        tokenAddress:"",
    });

    const handleNext = () => {
        if (activeStep == 0) {
            if (account === undefined) {
                setModalTitle("Please connect Wallet");
                setModalDes(`Before you can create a lock on ${network}, you must connect your wallet to ${network} network on your wallet. Use testnet for test transactions, and mainnet for real token locks.`);
                handleOpen();
            }else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }else if(activeStep ==2) {
            if (token.symbol == undefined) {
                setModalTitle("Please select Token");
                setModalDes(`Before you can create a lock on ${network}, you must select token on your wallet. Use testnet for test transactions, and mainnet for real token locks.`);
                handleOpen();
            }else {
                
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    useEffect(async () => {
        if (!account) {
            setUserData([]);
            return;
        }
        let provider = await connector.getProvider()
        const newUserData = await getUserData(provider, account);
        setUserData(newUserData);
    }, [account])

    useEffect(async () => {
        setIsAllowed(0);
        if (!account || !token.address) return;
        let provider = await connector.getProvider()
        const tokenBalance = await getTokenBalance(provider, token, account);
        dispatch({type:USERBALANCE, payload: tokenBalance});
        const allowanceAmount = await allowance(provider, token, account);
        if (allowanceAmount < 115792089237316195423570985008687907853269984665640564039457584007913129639935) setIsAllowed(1);
        else setIsAllowed(2);
    }, [account, token])

    const handleChange = async (event) => {
        setValues({ tokenAddress: event.target.value });
        if (event.target.value.length == 42) {
            const address = event.target.value;
            try {
                const tokenData = await getTokenMetadata(CHAINDATA.find((item)=>item.name==network).chain, address);
                dispatch({
                    type:TOKENDATA,
                    payload: tokenData[0]
                })
            } catch(e) {
                dispatch({
                    type:TOKENDATA,
                    payload: {}
                })
            }
        }else {
            dispatch({
                type:TOKENDATA,
                payload: {}
            })
        }
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

    const selectLockAmountMax = () => {
        setLockAmount(userBalance / Math.pow(10, token.decimals));
    }
    const handleLockAmount = (e) => {
        setLockAmount(parseFloat(e.target.value))
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDate = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
        if (selectedDate > currentDate) setDateUseful(true);
        else setDateUseful(false);
        setWidthrawDate(selectedDate);
    }

    const depositToken = async () => {
        let tokenAmount = lockAmount * Math.pow(10, token.decimals);
        let unlockDate = widthrawDate;
        let provider = await connector.getProvider()
        deposit(provider, token, tokenAmount, unlockDate, account).then((status) => {
            if (status) console.log("deposited");
            setActiveStep(0);
        })
    }

    const withdrawToken = async (token, amount) => {
        let provider = await connector.getProvider()
        withdraw(provider, token, amount, account).then(async (status) => {
            if (status) console.log("withdrawed");
            const newUserData = await getUserData(provider, account);
            setUserData(newUserData);
        })
    }

    const approveToken = async () => {
        let provider = await connector.getProvider()
        approve(provider, token, account).then((status) => {
            if (status) setIsAllowed(2);
        });
    }

    const networkData= [
        {name:"Avalanche", subtitle:"Choose if your coin is built on AVAX", url:"/networks/avalanche.png", subData:[{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Ethereum", subtitle:"Choose if your coin is built on Ethereum", url:"/networks/ethereum.png", subData:[{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]},
        {name:"Binance Smart Chain", subtitle:"Choose if your coin is built on Binance Smart Chain", url:"/networks/binance.png", subData:[{name:"Project Tokens", subTitle:"Regular BEP-20 Project Token", url:"/project.png"}]}

    ];
    return (
        <Container className={classes.root} maxWidth="lg" style={{paddingLeft:20, paddingRight:20}}>
            <Box className={classes.info}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="center" >
                    <Grid className={isMobile ? `${mobileClasses.root} grid text-center`  : "grid text-center"} item xs={12} sm={12} md={6} >
                        <div style={{maxWidth:400, display:'inline-block', textAlign:'left'}}>
                            <h1>Create your own custom token lock instantly.</h1>
                            <p>All coins are locked into our audited  smart contract and can only be withdrawn  by you after lock time expires.</p>
                            <Link
                                href="https://testnet.snowtrace.io/address/0x9D1018Cf42c12D78D073C38A79eCaB18A4FDc2A5"
                                target="_blank"
                                color="blue"
                                underline="none"
                                className={classes.button}
                            ><Button variant="contained">Explore Contract</Button></Link>
                        </div>
                    </Grid>
                    <Grid className={isMobile ? `${mobileClasses.root} grid`  : "grid"} item xs={12} sm={12} md={6} >
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
                                >
                                    <SwipeableViews
                                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                        index={activeStep}
                                        onChangeIndex={handleStepChange}
                                    >
                                       
                                        <div key={1} style={{paddingLeft:1, paddingRight:1}}>
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
                                                                <img className={dashboardClasses.networkImage} src={item.url} alt="network" />
                                                            </Grid>
                                                            <Grid item   xs={9} sm={10} md={10}>
                                                                <p  color="textSecondary" className={dashboardClasses.networkTitle}>
                                                                    {item.name}
                                                                </p>
                                                                <p color="textSecondary" className={dashboardClasses.networkDes}>
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
                                        <div key={2} style={{paddingLeft:1, paddingRight:1}}>
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
                                                            <img className={dashboardClasses.networkImage} src={each.url} alt="network" />
                                                        </Grid>
                                                        <Grid item   xs={9} sm={10} md={10}>
                                                            <p  color="textSecondary" className={dashboardClasses.networkTitle}>
                                                                {each.name}
                                                            </p>
                                                            <p  color="textSecondary" className={dashboardClasses.networkDes}>
                                                                {each.subTitle}
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item  className="text-center" xs={2} sm={1} md={1}>
                                                    {each.name==subMethod ? <div className={dashboardClasses.fillCircle} />: <div className={dashboardClasses.emptyCircle} />}
                                                </Grid>
                                            </Grid>)
                                            }
                                            
                                        </div>
                                        <div key={3} style={{paddingLeft:1, paddingRight:1}}>
                                            <p className="text-center" color="textSecondary">
                                                Enter the token address you would like to lock for
                                            </p>
                                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" style={{width:'-webkit-fill-available'}}>
                                                <InputLabel htmlFor="outlined-adornment-password">Address</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type="text"
                                                    value={values.tokenAddress}
                                                    onChange={handleChange}
                                                    // onKeyDown={handleChange}
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
                                            
                                            {
                                                token != undefined && token.symbol !=undefined && token.symbol !="" &&
                                                <div style={{paddingLeft:20, paddingRight:20}}>
                                                    <p style={{margin:"0px"}}>Token Found</p>
                                                    <Grid 
                                                        container
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Grid item className={dashboardClasses.textLeft} xs={6} sm={6} md={6}>
                                                            <img className={dashboardClasses.tokenImage} src="/lock.png" alt="network" />
                                                            <p  color="textSecondary" className={dashboardClasses.tokenTitle}>
                                                                {token.symbol}
                                                            </p>
                                                        </Grid>
                                                        <Grid item className={dashboardClasses.textRight}  xs={6} sm={6} md={6}>
                                                            <Button variant="contained" color="error" sm={12}>Select</Button>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            }
                                            
                                        </div>
                                        <div key={4} style={{paddingLeft:1, paddingRight:1}}>
                                            <Grid 
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                className={dashboardClasses.balanceContainer}
                                            >
                                                <Grid item className={dashboardClasses.textLeft} xs={6} sm={6} md={6}>
                                                    <TextField
                                                        id="standard-number"
                                                        label="Lock Amount"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                            inputprops: { min: 1 }
                                                        }}
                                                        InputProps={{ inputprops: { min: 1 } }}
                                                        variant="standard"
                                                        onChange={handleLockAmount}
                                                        value={lockAmount}
                                                    />
                                                </Grid>
                                                <Grid item className={dashboardClasses.textRight}  xs={6} sm={6} md={6}>
                                                    <p style={{marginBottom:2, marginTop:0, fontSize: "10px"}}>Balance: {(userBalance / Math.pow(10, token.decimals)).toFixed(2)}</p>
                                                    <Grid 
                                                        container
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Grid item className={dashboardClasses.textLeft} xs={6} sm={6} md={6}>
                                                            <Button variant="contained" color="error" sm={12} onClick={selectLockAmountMax}>Max</Button>
                                                        </Grid>
                                                        <Grid item className={dashboardClasses.textRight} xs={6} sm={6} md={6}>
                                                            <img style={{height:30}} src="/lock.png" alt="network" />
                                                            <p  color="textSecondary" className={dashboardClasses.tokenTitle}>
                                                                {token.symbol}
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <br />
                                            {/* <div className="text-center" style={{padding:"10px 0px"}}>
                                                <LockIcon />
                                            </div> */}
                                            <Grid 
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                className={dashboardClasses.balanceContainer}
                                            >
                                                <Grid item className={dashboardClasses.textLeft} xs={6} sm={6} md={6}>
                                                    <TextField
                                                        id="standard-number"
                                                        label="Unlock Date"
                                                        type="date"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                            inputprops: { min: 1 }
                                                        }}
                                                        InputProps={{ inputprops: { min: 1 } }}
                                                        onChange={handleDate}
                                                        variant="standard"
                                                    />
                                                </Grid>
                                                <Grid item className={dashboardClasses.textRight}  xs={6} sm={6} md={6}>
                                                    {
                                                        isAllowed == 2 ? <Button variant="contained" color="secondary" sm={12} disabled={!dateUseful} onClick={depositToken}>Deposit</Button>
                                                        : (isAllowed == 1 ? <Button variant="contained" color="secondary" sm={12} onClick={approveToken}>Approve</Button> : <Button variant="contained" color="secondary" sm={12} disabled>Checking</Button>)
                                                    }
                                                    {/* <Grid 
                                                        container
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Grid item className={dashboardClasses.textLeft} xs={6} sm={6} md={6}>
                                                            
                                                        </Grid>
                                                        <Grid item className={dashboardClasses.textRight} xs={6} sm={6} md={6}>
                                                            <img style={{height:30}} src="/lock.png" alt="network" />
                                                            <p  color="textSecondary" className={dashboardClasses.tokenTitle}>
                                                                ICC
                                                            </p>
                                                        </Grid>
                                                    </Grid> */}
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </SwipeableViews>
                                    <MobileStepper
                                        style
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
                    <Grid className={isMobile ? `${mobileClasses.root} grid `  : "grid"} style={{marginTop:40}} item xs={12} sm={12} md={12} >
                        <Card className="card">
                            <CardHeader
                                style={{background:"#cccccc"}}
                                title="My Locks"
                            />
                            <CardContent >
                                {userData.length == 0 && 
                                <div className="text-center" style={{width:'100%', padding:"20px 0px"}}>
                                    <img src="/mylock.png" alt="My Lock" style={{height:200}}/>
                                    <h2 style={{marginBottom:0}}>No Locked Coin</h2>
                                    <p style={{color:'grey',margin:0}}>You have not locked up any coins yet.</p>
                                </div>}
                                {userData.length != 0 && <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Token</TableCell>
                                            <TableCell align="right">Deposited</TableCell>
                                            <TableCell align="right">Withdrawed</TableCell>
                                            <TableCell align="right">withdrawable</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {userData.map((row) => (
                                            <TableRow
                                            key={row.token}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.token}
                                                </TableCell>
                                                <TableCell align="right">{(row.deposited / Math.pow(10, row.decimals)).toFixed(2)}</TableCell>
                                                <TableCell align="right">{(row.withdrawed / Math.pow(10, row.decimals)).toFixed(2)}</TableCell>
                                                <TableCell align="right">{(row.withdrawable / Math.pow(10, row.decimals)).toFixed(2)}</TableCell>
                                                <TableCell align="right">
                                                    <Button variant="contained" color="success" disabled={row.withdrawable == "0"} style={{width:'100%'}} onClick={() => withdrawToken(row.token, row.withdrawable)}>Withdraw</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>}
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
                        {modalTitle}
                    </h3>
                    <p id="modal-modal-description" sx={{ mt: 2 }} style={{textAlign:'center', fontSize:12, color:'grey'}}>
                        {modalDes}
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
