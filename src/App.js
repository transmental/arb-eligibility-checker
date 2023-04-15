import React, { useState } from 'react';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=https://arbitrum.foundation/_next/data/ULZ5NXwcgBc1X177INPCb/eligibility.json?address=${walletAddress}`);
      const text = await response.text();
      
      if (!text) {
        throw new Error('Empty response from API');
      }
  
      const data = JSON.parse(text);
      setEligibility(data.pageProps);
    } catch (error) {
      console.error('Error fetching eligibility data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Arbitrum Airdrop Eligibility Checker</h1>
      <input
        type="text"
        placeholder="Enter wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={checkEligibility}>Check eligibility</button>

      {loading && <p>Loading...</p>}

      {
        eligibility && (
          <>
            {
              'eligibility' in eligibility ? (
                eligibility.hasClaimed ? (
                  <p>This wallet has already claimed.</p>
                ) : eligibility.eligibility.tokens === 0 ? (
                  <p>Wallet is not eligible.</p>
                ) : (
                  <p>Amount claimable: {eligibility.eligibility.tokens}</p>
                )
              ) : (
                <p>Unexpected response from API. Please try again later.</p>
              )
            }
          </>
        )
      }
    </div>
  );
}

export default App;
