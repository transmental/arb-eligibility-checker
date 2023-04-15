const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/eligibility/:address', async (req, res) => {
  try {
    const response = await axios.get(
      `https://arbitrum.foundation/_next/data/ULZ5NXwcgBc1X177INPCb/eligibility.json?address=0x${req.params.address}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching eligibility data:', error);
    res.status(500).json({ error: 'Failed to fetch eligibility data' });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
