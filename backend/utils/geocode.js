const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

async function geocodeAddress(address) {
  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error("Error with Geocoding API:", error);
    throw error;
  }
}

module.exports = geocodeAddress;