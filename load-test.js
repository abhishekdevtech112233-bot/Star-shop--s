import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 5000 },   // पहले 5 मिनट में 0 से बढ़कर 5,000 वर्चुअल यूजर्स तक पहुँचेगा
    { duration: '20m', target: 5000 },  // अगले 20 मिनट तक लगातार पूरे 5,000 यूजर्स का लोड बना रहेगा
    { duration: '5m', target: 0 },      // आखिरी 5 मिनट में लोड धीरे-धीरे शून्य पर आ जाएगा
  ],
};

export default function () {
  const url = 'https://gejrzpflcuvlbpedliwq.supabase.co/rest/v1/';
  
  const params = {
    headers: {
      'apikey': 'YOUR_SUPABASE_ANON_KEY',
      'Content-Type': 'application/json',
    },
  };

  let res = http.get(url, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
