import React, { useState } from "react";
import { isAddress } from "ethers";
import "./App.css";

import gitImage from "./images/github-mark-white.png";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkEligibility = async () => {
    if (!isAddress(walletAddress)) {
      setError("Please enter a valid wallet address.");
      setEligibility(null);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=https://arbitrum.foundation/_next/data/ULZ5NXwcgBc1X177INPCb/eligibility.json?address=${walletAddress}`
      );
      const text = await response.text();

      if (!text) {
        throw new Error("Empty response from API");
      }

      const data = JSON.parse(text);
      setEligibility(data.pageProps);
    } catch (error) {
      console.error("Error fetching eligibility data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setWalletAddress(newAddress);
    if (isAddress(newAddress)) {
      setError(null);
    }
  };

  return (
    <div className="Main">
      <div className="App">
        <div className="Form">
          <h1>Arbitrum Airdrop Eligibility Checker</h1>
          <input
            type="text"
            placeholder="Enter any Arbitrum wallet address"
            value={walletAddress}
            onChange={handleAddressChange}
          />
          <button
            onClick={checkEligibility}
            disabled={!walletAddress || loading}
          >
            Check eligibility
          </button>
          {error && <p className="Error">{error}</p>}

          {loading && <p>Loading...</p>}

          {eligibility && (
            <>
              {"eligibility" in eligibility ? (
                eligibility.hasClaimed ? (
                  <p>This wallet has already claimed {eligibility.eligibility.tokens} $ARB.</p>
                ) : eligibility.eligibility.tokens === 0 ? (
                  <p>Wallet is not eligible.</p>
                ) : (
                  <p>Amount claimable: {eligibility.eligibility.tokens} $ARB. <a href="https://arbitrum.foundation" target="blank">Claim now.</a></p>
                )
              ) : (
                <p>Unexpected response from API. Please try again later.</p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="Credits">
        <a href="https://github.com/transmental/" target="blank">
          <img className="git" src={gitImage} alt="GitHub Logo" />
        </a>
        <p>
          Provided by{" "}
          <a
            href="https://xeenon.xyz/0x5473580406D12E1cBD4c00B77e158FfF0CE9424e"
            target="blank"
          >
            @transmental
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
