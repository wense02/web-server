const express = require('express');
const axios = require('axios');
const punycode = require('punycode/');
const app = express();
const port = 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Use an external API to get location based on IP address
    const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const { city } = locationResponse.data;

    // Use an external API to get weather data
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${locationResponse.data.latitude}&longitude=${locationResponse.data.longitude}&current_weather=true`);
    const temperature = weatherResponse.data.current_weather.temperature;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
