import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

export let options = {
  vus: 100,           
  duration: "30s",   // will loop through pages until time is up
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// custom counters
let errorCount = new Counter("errors_total");
let error4xx = new Counter("errors_4xx");
let error5xx = new Counter("errors_5xx");

export default function () {
  const pageSize = 100;
  const totalPages = 100;

  for (let page = 1; page <= totalPages; page++) {
    // 1. Call API with pagination params ------------------
    const url = `${BASE_URL}/api/events?pagination=true&page=${page}&size=${pageSize}`;
    let res = http.get(url);

    // 2. Check status and response ------------------------
    const ok = check(res, {
      "status is 200": (r) => r.status === 200,
      "response has body": (r) => r.body && r.body.length > 2,
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

    // 3. Log response size (for debugging) ----------------
    console.log(
      `Page ${page} → Response size: ${(res.body.length / 1024).toFixed(2)} KB`
    );

    // sleep(1); // avoid hammering the server too fast
  }
}
