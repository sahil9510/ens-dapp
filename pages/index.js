import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Web3Modal from 'web3modal'
import { providers } from 'ethers'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const web3ModalRef = useRef();
  const [walletConnected,setWalletConnected]= useState(false);
  const [ens,setENS] = useState("")
  const [address,setAddress] = useState("")
  const connectWallet = async()=>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    }catch(err){
      console.error(err)
    }
  }

  const setupENSorAddress = async(address,web3Provider)=>{
    var _ens = await web3Provider.lookupAddress(address);
    
    console.log(_ens)
    if(_ens){
      setENS(_ens)
    }else{
      setAddress(address)
    }
  }

  const getProviderOrSigner = async(needSigner=false)=>{
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();
    if(chainId!==5){
      window.alert("Change to Goerli Network!")
      throw new Error("Change to Goerli Network!");
    }

    const signer = web3Provider.getSigner();

    const address = await signer.getAddress();

    setupENSorAddress(address,web3Provider);
    return signer;

  }

  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet();
    }
  },[walletConnected])

  const renderButton = ()=>{
    if(walletConnected){
      return <div>Wallet Connected!</div>
    }else{
      return <button onClick={connectWallet} className={styles.button}>
        Connect Wallet
      </button>
    }
  }
  return (
    <div className={styles.body}>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content='ENS-DAPP' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to Crypto Punks {ens? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT Collection for Crypto Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="learnweb3punks.png" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Sahil
      </footer>
    </div>
  )
}
