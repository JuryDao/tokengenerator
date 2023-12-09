import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import YOUR_CONTRACT_ABI from '../contracts/JuryDAO.json';
import { Button } from '@mui/material';

const NFTMinter = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mintedToken, setMintedToken] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          const contractAddress = '0x46c67EDfe5a6DF6bC1cF47d548e9EC13Ea1ac5a4';
          const contract = new web3Instance.eth.Contract(YOUR_CONTRACT_ABI, contractAddress);
          setContract(contract);
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        console.error('MetaMask not found');
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.enable();
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccounts(accounts);

      const contractAddress = '0x46c67EDfe5a6DF6bC1cF47d548e9EC13Ea1ac5a4';
      const contract = new web3Instance.eth.Contract(YOUR_CONTRACT_ABI, contractAddress);
      setContract(contract);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccounts([]);
    setContract(null);
  };

  const mintNFT = async () => {
    if (contract) {
      try {
        if (!name || !age) {
          alert('Please enter name and age');
          return;
        }

        await contract.methods.mintNFT(name, parseInt(age)).send({ from: accounts[0] });

        const tokenId = await contract.methods.tokenIdCounter().call();
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        setMintedToken({ tokenId, tokenURI });
      } catch (error) {
        console.error('Error minting NFT:', error);
        alert('Error minting NFT. Check the console for details.');
      }
    }
  };

  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-[#00060A]">
      <div className="pr-12 py-[13px] left-[136px] top-[16px] absolute justify-start items-center inline-flex">
            <img src="/images/logo.png" alt="JuryDAO Logo" className="h-10 w-auto" />

            <div className="text-white text-2xl font-bold font-['Martel'] leading-loose pl-2 "> JuryDAO </div>
      </div>
      <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        
    
        {/* Navigation menu for larger screens */}
        <div className="pr-12 py-[13px] justify-items-end top-[30px] absolute right-[136px] inline-flex">
          <div className={`hidden lg:flex space-x-4 ml-auto  ${isMenuOpen ? 'flex-col' : 'flex'}`}>
            <a href="#" className="text-white text-sm font-semibold font-['Open Sans'] leading-normal tracking-tight">Home</a>
            <a href="#" className="text-white text-sm font-semibold font-['Open Sans'] leading-normal tracking-tight">About</a>
            <a href="#" className="text-white text-sm font-semibold font-['Open Sans'] leading-normal tracking-tight">Contact</a>
          </div>
        </div>
    
        {/* Navigation menu for smaller screens */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 right-0 left-0 bg-white p-4">
            <a href="#" className="block text-black">Home</a>
            <a href="#" className="block text-black">About</a>
            <a href="#" className="block text-black">Contact</a>
          </div>
        )}
        <div className="font-bold text-3xl pt-[150px] pb-2 text-white text-center">Mint Your NFT</div>
        <b
              style={{
                alignSelf: 'stretch',
                position: 'relative',
                transform: ' rotate(0.21deg)',
                transformOrigin: '0 0',
              }}
            >
              Welcome!
            </b>
        <div
              style={{
                alignSelf: 'stretch',
                position: 'relative',
                fontWeight: '500',
                transform: ' rotate(0.21deg)',
                transformOrigin: '0 0',
              }}
            >
              The decentralized web awaits
            </div>
        

      {web3 && accounts.length > 0 ? (
        <div className='flex flex-col items-center justify-center'>
          
          <p className='font-bold text-3xl pt-[150px] pb-6 text-white text-center '>Connected Wallet: {accounts[0]}</p>
          
          <div className='flex flex-col pt-4 items-center justify-center'>
          <Button
                style={{ alignSelf: 'stretch', position: 'relative' }}
                sx={{ width: 331 }}
                color="primary"
                variant="contained"
                onClick={disconnectWallet}
              >
                              Disconnect Wallet
              </Button>
          </div>
          <br />
          <label className="text-white pr-2">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md text-black"
            />
          </label>

          <br />
          <label className="text-white pr-2">
            Age:
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
            className='border-2 border-gray-300 p-2 rounded-md text-black' />
          </label>
          <br />
          <div className='flex flex-col pt-4 items-center justify-center'>
          <Button style={{ alignSelf: 'stretch', position: 'relative' }}
                sx={{ width: 331 }}
                color="primary"
                variant="contained" 
                onClick={mintNFT}>Mint NFT</Button>
          {mintedToken && (
            <div>
              <p>Minted Token ID: {mintedToken.tokenId}</p>
              <p>Minted Token URI: {mintedToken.tokenURI}</p>
            </div>
          )}
          </div>
        </div>
      ) : (
        <MainFrame connectWallet={connectWallet} />
      )}
      
      
    </div>
  );
};

const MainFrame = ({ connectWallet }) => {
  return (
    <div 
      style={{
        position: 'relative',
        backgroundColor: '#24272a',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 10px 10px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '40px',
        color: '#fff',
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '25px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <b
              style={{
                alignSelf: 'stretch',
                position: 'relative',
                transform: ' rotate(0.21deg)',
                transformOrigin: '0 0',
              }}
            >
              Welcome!
            </b>
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px',
              fontSize: '20px',
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                position: 'relative',
                fontWeight: '500',
                transform: ' rotate(0.21deg)',
                transformOrigin: '0 0',
              }}
            >
              The decentralized web awaits
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                borderRadius: '77px',
                backgroundColor: '#1098fc',
                height: '50px',
                overflow: 'hidden',
                flexShrink: '0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                style={{ alignSelf: 'stretch', position: 'relative' }}
                sx={{ width: 331 }}
                color="primary"
                variant="contained"
                onClick={connectWallet}
              >
                              Connect To The Wallet
              </Button>
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectingWallet = () => {
  return (
    <div className="relative w-full flex flex-col items-start justify-start text-center text-4xl text-white font-Inter">
      <div className="self-stretch bg-gray-900 flex flex-row items-start justify-center p-10">
        <div className="flex-1 flex flex-col items-center justify-start">
          <div className="self-stretch flex flex-col items-center justify-start space-y-4">
           
           
            <div className="self-stretch flex flex-col items-center justify-center space-y-4 text-left text-base">
              
              
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export {  MainFrame ,NFTMinter, ConnectingWallet };
 
