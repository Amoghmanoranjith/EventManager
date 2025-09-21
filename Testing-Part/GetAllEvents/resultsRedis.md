# locally:
## 10000 events - 2577 KB
    - 100 concurrent users
    - aggregated across 3 runs
    TOTAL RESULTS

    checks_total: 7768 (sum) → 100% succeeded (no failures)
    http_reqs: 3884 (sum) → ~40.6 req/s (avg across runs)
    http_req_failed: 0%

    HTTP
    http_req_duration (avg across runs):
    avg ≈ 1.41s
    min ≈ 0.12s (from run2 low outlier)
    med ≈ 1.34s
    max ≈ 3.63s (averaged from run1/2/3 maxes)
    p(90) ≈ 1.57s
    p(95) ≈ 2.04s

    EXECUTION
    iteration_duration:
    avg ≈ 2.42s
    min ≈ 1.13s
    med ≈ 2.34s
    max ≈ 4.63s
    p(90) ≈ 2.58s
    p(95) ≈ 3.71s
    iterations: 3884 (sum)
    VUs active: ranged 14–21 during test, max 100

    NETWORK
    data_received: ~10.3 GB total → ~106 MB/s avg
    data_sent: ~310 kB total → ~3.2 kB/s avg