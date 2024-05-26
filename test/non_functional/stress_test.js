import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 0 },  
    { duration: '10s', target: 1000 },  
    { duration: '10s', target: 1000 }, 
    { duration: '10s', target: 0 }, 
    { duration: '10s', target: 10000 },  
    { duration: '10s', target: 10000 }, 
    { duration: '10s', target: 0 }, 
    { duration: '10s', target: 100000 },   
    { duration: '10s', target: 100000 }, 
    { duration: '10s', target: 0 },   
  ],
};

export default function () {
  http.get('http://localhost:3000');
  sleep(1);
}
