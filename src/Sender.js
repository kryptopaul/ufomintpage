import React from "react";
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PaidIcon from '@mui/icons-material/Paid';
import Web3 from "web3";

export default function Sender(props) {
    // Metamask Connection
    const [isConnected, setConnection] = useState(null);
    const [account , setAccount] = useState(null);
    const [network , setNetwork] = useState(null);

    // Input Validation
    const [sendToAddress , setSendToAddress] = useState(null);
    const [sendAmount , setSendAmount] = useState(null);
    const [sendToAddressError, setSendToAddressError] = useState({error: false, message: ""});
    const [sendAmountError, setSendAmountError] = useState({error: false, message: ""});


    //State for button loading
    const [isLoading, setIsLoading] = useState(false);

    //State for transaction status
    const [transactionStatus, setTransactionStatus] = useState(null);

    const web3 = new Web3(window.ethereum);

    //Connects to Metamask and sets the account and network
    const connectWallet = async () => {
        try{
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setConnection(true);

        const network = await web3.eth.net.getNetworkType();
        setNetwork(network);
        } catch(err){
            console.log("Error: Do you have Metamask installed?" + err)
        }
    }

    //Listen to Network or Account change events
    useEffect(() => {

        const getNewNetwork = async () => {
            const network = await web3.eth.net.getNetworkType();
            setNetwork(network);
        }

        const getNewAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        }

        if (window.ethereum) {
          window.ethereum.on("chainChanged", () => {
            getNewNetwork();
          });
          window.ethereum.on("accountsChanged", () => {
            getNewAccount();
          });
        }
      });



    async function mint (){
            console.log("Mint function triggered")
            try{
            setIsLoading(true);
            const params = {
                from: account,
                to: '0x2672178f729d4Fa3d0058adf4324a64066ED8d57',
                value: web3.utils.toWei("0.1", "ether")
            }
            const tx = await web3.eth.sendTransaction(params);
            console.log(tx);
            setIsLoading(false);
            setTransactionStatus({status: true, txId: `${tx.transactionHash}`});
        } catch(err){
            console.log("Error: " + err)
            setIsLoading(false);
        }
        }



 

    const sendButton = () => {
        return (<LoadingButton loading={isLoading} loadingPosition="start" startIcon={<PaidIcon/>} variant="contained" size="large" style={{margin: '20px'}} onClick={mint}>Mint!</LoadingButton>)
    }

    const connectWalletButton = () => {
        return (<Button variant="contained" size="large" style={{margin: '20px'}} onClick={connectWallet}>Connect Wallet</Button>)
    }

    const successAlert = () => {
        return(
            <div>
<Alert onClose={() => {setTransactionStatus(null)}}>Success! — Track your transaction on <a href={`https://ropsten.etherscan.io/tx/` + transactionStatus.txId} target="_blank" rel="noreferrer">Etherscan</a></Alert>
</div>
        )
    }

    const fieldsIfConnected = () => {
        return(
            
        <div>
            <img src="https://i.imgur.com/V8C19D5.gif" style={{height: '250px'}}></img>           
            <h2 style={{wordBreak: 'break-word'}}>Your address is: {account}</h2>
            <h2 style={{wordBreak: 'break-word'}}>Currently connected to: {network}</h2>
                
        </div>)
    }


    return (
         <div className="gamePage" style={{ marginTop: '25%', backgroundColor: 'white', borderRadius: '25px'}}>



            <div style={{ borderRadius: '25px', padding: '20px', margin:'25px'}}>
                <h1>Welcome to UFOTown Mint! 👽</h1>
        
                {isConnected ? fieldsIfConnected() : null}
                {isConnected ? sendButton() : connectWalletButton()}
                {transactionStatus ? successAlert() : null}
                </div>

        </div>
    );
  }