// src/web3.js
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // Use Metamask or other injected provider
  web3 = new Web3(window.ethereum);
  window.ethereum.enable(); // Enable Metamask
} else {
  // Fallback to a local Ganache instance or other provider
  const provider = new Web3.providers.HttpProvider('https://rpc-mainnet.maticvigil.com');
  web3 = new Web3(provider);
}

export default web3;
