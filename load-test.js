import http from 'k6/http';
import { sleep, check } from 'k6';

// Supabase प्रोजेक्ट डिटेल्स
const SUPABASE_URL = 'https://gejrzpflcuvlbpedliwq.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // यहाँ अपनी असली Anon Key डाल देना भाई

export const options = {
  stages: [
    { duration: '5m', target: 5000 },  // 5 मिनट में रैंप-अप होकर 5,000 वर्चुअल यूजर्स तक पहुँचेगा
    { duration: '20m', target: 5000 }, // बीच के 20 मिनट तक लगातार 5,000 यूजर्स का भारी सस्टेंड लोड रहेगा
    { duration: '5m', target: 0 },     // आखिरी 5 मिनट में धीरे-धीरे कूल-डाउन होकर जीरो हो जाएगा
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],    // 5000 के लोड पर 2% से कम फेलियर रेट अलाउड है
    http_req_duration: ['p(95)<3000'], // 95% रिक्वेस्ट 3 सेकंड के अंदर रिस्पॉन्ड करनी चाहिए
  },
};

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export default function () {
  // 1. दुकान सर्च करना (Shop Search API)
  let searchRes = http.get(`${SUPABASE_URL}/rest/v1/shops?select=*&limit=5`, { headers: headers });
  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // 2. रील्स स्क्रॉल करना (Reels Fetch API)
  let reelsRes = http.get(`${SUPABASE_URL}/rest/v1/reels?select=*&limit=3`, { headers: headers });
  check(reelsRes, {
    'reels status is 200': (r) => r.status === 200,
  });
  sleep(2);
}
