// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import YOUR_CONTRACT_ABI from '../contracts/JuryDAO.json';
import { Button } from '@mui/material';

// NFTMinter component
const NFTMinter = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mintedToken, setMintedToken] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState(true);

  useEffect(() => {
    // Initialization logic
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

          setShowConnectButton(false);
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

      setShowConnectButton(false);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccounts([]);
    setContract(null);
    setShowConnectButton(true);
  };

  const mintNFT = async () => {
    if (contract) {
      try {
        if (!name || !age) {
          alert('Please enter name and age');
          return;
        }

        await contract.methods.mintNFT(name, parseInt(age)).send({ from: accounts[0] });

        // Fetch the total number of tokens (tokenIdCounter)
        const tokenIdCounter = await contract.methods.tokenIdCounter().call();

        // The minted token ID is the total number of tokens generated so far
        const tokenId = tokenIdCounter;

        // The minted token URI is set to the contract address
        const tokenURI = contract.options.address;

        setMintedToken({ tokenId, tokenURI });

        // Display contract address and tokenIdCounter
        alert(`Minted Token ID: ${tokenId}\nMinted Token Address (Contract): ${tokenURI}\nTotal Number of Tokens: ${tokenIdCounter}`);
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
    <div className="bg-[#00060A] h-screen">
      <div className="pr-12 py-[13px] left-[136px] top-[16px] absolute justify-start items-center inline-flex">
        <img src="/images/logo.png" alt="JuryDAO Logo" className="h-10 w-auto" />
        <div className="text-white text-2xl font-bold font-['Martel'] leading-loose pl-2 "> JuryDAO </div>
      </div>
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Navigation menu for larger screens */}
      <div className="pr-12 py-[13px] justify-items-end top-[30px] absolute right-[136px] inline-flex">
        <div className={`hidden lg:flex space-x-4 ml-auto ${isMenuOpen ? 'flex-col' : 'flex'}`}>
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

      <div className="flex flex-col items-center justify-center">
        {showConnectButton && (
          <div className='flex flex-col items-center justify-center'>
            <Button
              style={{ alignSelf: 'stretch', position: 'relative' }}
              sx={{ width: 331 }}
              color="primary"
              variant="contained"
              onClick={connectWallet}
            >
              Connect to Wallet
            </Button>
          </div>
        )}

        {web3 && accounts.length > 0 && !showConnectButton ? (
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
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className='border-2 border-gray-300 p-2 rounded-md text-black'
              />
            </label>
            <br />
            <div className='flex flex-col pt-4 items-center justify-center'>
              <Button
                style={{ alignSelf: 'stretch', position: 'relative' }}
                sx={{ width: 331 }}
                color="primary"
                variant="contained"
                onClick={mintNFT}
              >
                Mint NFT
              </Button>
              {mintedToken && (
                <div>
                  <p>Minted Token ID: {mintedToken.tokenId}</p>
                  <p>Minted Token Address: {mintedToken.tokenURI}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// MainFrame component
const MainFrame = ({ connectWallet }) => {
  return (
    <div>
      {/* Your existing code for MainFrame component */}
    </div>
  );
};

// ConnectingWallet component
const ConnectingWallet = () => {
  return (
    <div>
      {/* Your existing code for ConnectingWallet component */}
    </div>
  );
};

// Export the components
export { NFTMinter, ConnectingWallet, MainFrame };
