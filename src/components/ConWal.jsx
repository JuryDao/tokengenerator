import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import YOUR_CONTRACT_ABI from '../contracts/JuryDAO.json';

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

        // Fetch the total number of tokens (tokenIdCounter)
        const tokenIdCounter = await contract.methods.tokenIdCounter().call();

        // The minted token ID is the total number of tokens generated so far
        const tokenId = tokenIdCounter;

        // The minted token URI is set to the contract address
        const tokenURI = contract.options.address;

        setMintedToken({ tokenId, tokenURI });
      } catch (error) {
        console.error('Error minting NFT:', error);
        alert('Error minting NFT. Check the console for details.');
      }
    }
  };

  return (
    <div>
      <h1>NFT Minter</h1>
      {web3 && accounts.length > 0 ? (
        <div>
          <p>Connected Wallet: {accounts[0]}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <br />
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br />
          <label>
            Age:
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
          <br />
          <button onClick={mintNFT}>Mint NFT</button>
          {mintedToken && (
            <div>
              <p>Minted Token ID: {mintedToken.tokenId}</p>
              <p>Minted Token Address: {mintedToken.tokenURI}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Wallet Disconnected</p>
          <button onClick={connectWallet}>Connect to Wallet</button>
        </div>
      )}
    </div>
  );
};

export default NFTMinter;
