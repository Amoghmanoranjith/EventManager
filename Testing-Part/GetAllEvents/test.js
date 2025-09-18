import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

export let options = {
  vus: 100,
  duration: "30s",
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// custom counters
let errorCount = new Counter("errors_total");
let error4xx = new Counter("errors_4xx");
let error5xx = new Counter("errors_5xx");

export default function () {
  let res = http.get(`${BASE_URL}/api/events`);

  // check status
  const ok = check(res, {
    "status is 200": (r) => r.status === 200,
    "response has data": (r) => r.body && r.body.length > 2,
  });

  if (!ok) {
    errorCount.add(1);

    if (res.status >= 400 && res.status < 500) {
      error4xx.add(1);
    } else if (res.status >= 500) {
      error5xx.add(1);
    }

    console.error(`❌ Error ${res.status}: ${res.body.substring(0, 200)}`);
  }

  // log response size (in KB) for debugging
  console.log(`Response size: ${(res.body.length / 1024).toFixed(2)} KB`);

  sleep(1);
}
