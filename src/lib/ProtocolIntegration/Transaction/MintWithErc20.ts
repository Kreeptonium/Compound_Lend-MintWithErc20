import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import * as dotenv from "dotenv";
import { ICompoundMintERC20Result } from "../Model/CompoundMintERC20Result";
//import {TransactionReceipt} from "web3-eth";
//import {TransactionConfig} from "web3-core";
//import {selectToken} from '../../../abi/Compound/Enum/TokenEnum';

//Configuring the directory path to access .env file
dotenv.config();

let encoded_tx : Promise<any>;

export const MintWithErc20Async = async(erc20Token:string,tokenQuantity:number) : Promise<ICompoundMintERC20Result>=> {

  // Setting up Ethereum blockchain Node through Infura
  const web3 = new Web3(process.env.infuraUrlRinkeby!);
  //Providing Private Key
  //const activeAccount = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  //Setting Contract Address
  let cTokenContractAddress;
  let underlyingContractAddress;
  let cTokenAbiJson;
  //let underlyingDecimals:number;

  const RNKBYDAI = process.env.RNKBYDAI ??'0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa';
  const RNKBYBAT = process.env.RNKBYBAT ??'0xbf7a7169562078c96f0ec1a8afd6ae50f12e5a99';
  const RNKBYETH = process.env.RNKBYETH ??'0xc778417e063141139fce010982780140aa0cd5ab';
  const RNKBYREP = process.env.RNKBYREP ??'0x6e894660985207feb7cf89Faf048998c71E8EE89';
  const RNKBYUSDC = process.env.RNKBYUSDC ??'0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b';
  const RNKBYUSDT = process.env.RNKBYUSDT ??'0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02';
  const RNKBYWBTC = process.env.RNKBYWBTC ??'0x577D296678535e4903D59A4C929B718e1D575e0A';
  const RNKBYZRX = process.env.RNKBYZRX ??'0xddea378A6dDC8AfeC82C36E9b0078826bf9e68B6';

  const RNKBYcDAI = process.env.RNKBYcDAI ??'0x6D7F0754FFeb405d23C51CE938289d4835bE3b14';
  const RNKBYcBAT = process.env.RNKBYcBAT ??'0xEBf1A11532b93a529b5bC942B4bAA98647913002';
  const RNKBYcETH = process.env.RNKBYcETH ??'0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e';
  const RNKBYcREP = process.env.RNKBYcREP ??'0xEBe09eB3411D18F4FF8D859e096C533CAC5c6B60';
  const RNKBYcUSDC = process.env.RNKBYcUSDC ??'0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1';
  const RNKBYcUSDT = process.env.RNKBYcUSDT ??'0x2fB298BDbeF468638AD6653FF8376575ea41e768';
  const RNKBYcWBTC = process.env.RNKBYcWBTC ??'0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96';
  const RNKBYcZRX = process.env.RNKBYcZRX ??'0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B';

  //Checking Compound Tokens. Calling respective ABIs
  if(erc20Token === RNKBYDAI){
    
     cTokenContractAddress = RNKBYcDAI;
     underlyingContractAddress = RNKBYDAI;
     cTokenAbiJson = require('../../../lib/abi/Compound/cDAI.json');
     //underlyingDecimals=8;

  }else if(erc20Token === RNKBYBAT)
  {
     cTokenContractAddress = RNKBYcBAT;
     underlyingContractAddress = RNKBYBAT;
     cTokenAbiJson = require('../../../lib/abi/Compound/cBAT.json');
     //underlyingDecimals=8;

  }else if(erc20Token === RNKBYETH)
  {
    cTokenContractAddress = RNKBYcETH;
    underlyingContractAddress = RNKBYETH;
    cTokenAbiJson = require('../../../lib/abi/Compound/cETH.json');
    //underlyingDecimals=8;

  }else if(erc20Token === RNKBYREP)
  {
    cTokenContractAddress = RNKBYcREP;
    underlyingContractAddress = RNKBYREP;
    cTokenAbiJson = require('../../../lib/abi/Compound/cREP.json');
    //underlyingDecimals=18;

  }else if(erc20Token=== RNKBYUSDC)
  {    
    cTokenContractAddress = RNKBYcUSDC;
    underlyingContractAddress = RNKBYUSDC;
    cTokenAbiJson = require('../../../lib/abi/Compound/cUSDC.json');
    //underlyingDecimals=6;

  }else if(erc20Token===RNKBYUSDT)
  {
    cTokenContractAddress = RNKBYcUSDT;
    underlyingContractAddress = RNKBYUSDT;
    cTokenAbiJson = require('../../../lib/abi/Compound/cUSDT.json');
    //underlyingDecimals=6;

  }else if(erc20Token===RNKBYWBTC)
  {
    cTokenContractAddress = RNKBYcWBTC;
    underlyingContractAddress = RNKBYWBTC;
    cTokenAbiJson = require('../../../lib/abi/Compound/cWBTC.json');
    //underlyingDecimals=8;
  }else if(erc20Token===RNKBYZRX)
  {
    cTokenContractAddress = RNKBYcZRX;
    underlyingContractAddress = RNKBYZRX;
    cTokenAbiJson = require('../../../lib/abi/Compound/cZRX.json');
    //underlyingDecimals=18;
  }
  
  // Initialising the Token Contract
  const cTokenContract = new web3.eth.Contract(cTokenAbiJson as AbiItem[], cTokenContractAddress);
  //console.log(cTokenContract);

    try {

        // Setting Up No.s of Tokens
        const underlyingTokensToSupply = tokenQuantity * Math.pow(10, 8);
        console.log(underlyingTokensToSupply);
        // Mint cTokens by supplying underlying tokens to the Compound Protocol
        encoded_tx =await cTokenContract.methods.mint(web3.utils.toBN(underlyingTokensToSupply.toString())).encodeABI();
        
        /*
        //encoded_tx = tx_builder.encodeABI();
        const txCount = await web3.eth.getTransactionCount(activeAccount.address);
        // Creating transaction object to pass it through "signTransaction"
        let transactionObject1: TransactionConfig = {
        nonce: txCount,
        from: activeAccount.address,
        to: cTokenContractAddress,
        gas: web3.utils.toHex(4300000),
        gasPrice: web3.utils.toHex(4200000000),
        data: encoded_tx,
        */
    }catch (error) {
            throw(error);
            
          }
    
          let compoundMintERC20Result:ICompoundMintERC20Result = {
            encodedText:encoded_tx,
            underlyingTokenContract:underlyingContractAddress,
            compoundTokenContract:cTokenContractAddress,
          }
  return compoundMintERC20Result;
  
}


    
      
