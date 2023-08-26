// @flow
import type { VenueType, VenueUpsertType } from '../types';

const fetch = require('node-fetch');

async function upsertVenue(venue: VenueType): Promise<VenueUpsertType> {
  try {
    const { street, city, state, zip } = venue;
    let { timeZone } = venue;
    if (!timeZone) {
      if (!process.env.GOOGLE_MAPS_API_KEY) throw new Error('Google API Key Missing');
      const googleApiURL = 'https://maps.googleapis.com/maps/api/';
      const googleApiKey = `&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const currentTimeStamp = Math.floor(Date.now() / 1000);

      const googleGeocodingURL = `${googleApiURL}geocode/json?address=${street}+${city}+${state}+${zip}${googleApiKey}`;
      const googleGeocodingResponse = await fetch(googleGeocodingURL);
      const googleGeoCodingResults = await googleGeocodingResponse.json();
      const { lat, lng } = googleGeoCodingResults.results[0].geometry.location;

      const googleTimeZoneURL = `${googleApiURL}timezone/json?location=${lat},${lng}&timestamp=${currentTimeStamp}${googleApiKey}`;
      const googleTimeZoneResponse = await fetch(googleTimeZoneURL);
      const googleTimeZoneResults = await googleTimeZoneResponse.json();
      timeZone = googleTimeZoneResults.timezoneId;
    }

    const payload = { ...venue, timeZone };

    const [newVenue] = await this.upsert(payload, { returning: true });

    return {
      venue: newVenue,
      success: true,
      error: null
    };
  } catch (error) {
    return {
      venue: null,
      success: false,
      error: `There was a problem upserting the venue ${error}`
    };
  }
}

export default upsertVenue;
