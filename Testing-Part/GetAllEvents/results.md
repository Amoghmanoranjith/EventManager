## Get events list
- generate 100 events done in 1.6s
- test get 
- generate 1000 events done in 2.96s
- test
- generate 10000 events
- test

### what to test
- latency
- is there error in fetching what sort of error
- size of each response


## 100 events:
- 100 concurrent users
    Run1:
    TOTAL RESULTS

    checks_total.......: 744     18.688684/s
    checks_succeeded...: 100.00% 744 out of 744
    checks_failed......: 0.00%   0 out of 744

    ✓ status is 200
    ✓ response has data

    HTTP
    http_req_duration..............: avg=8.32s min=4.07s med=8.12s max=13.17s p(90)=9.61s  p(95)=11.52s
    { expected_response:true }.....: avg=8.32s min=4.07s med=8.12s max=13.17s p(90)=9.61s  p(95)=11.52s
    http_req_failed................: 0.00%  0 out of 372
    http_reqs......................: 372    9.344342/s

    EXECUTION
    iteration_duration.............: avg=9.32s min=5.07s med=9.12s max=14.17s p(90)=10.61s p(95)=12.53s
    iterations.....................: 372    9.344342/s
    vus............................: 4      min=4        max=100
    vus_max........................: 100    min=100      max=100

    NETWORK
    data_received..................: 8.3 MB 208 kB/s
    data_sent......................: 30 kB  748 B/s

    Run2:
    TOTAL RESULTS

    checks_total.......: 760    18.934729/s
    checks_succeeded...: 98.94% 752 out of 760
    checks_failed......: 1.05%  8 out of 760

    ✗ status is 200
      ↳  97% — ✓ 372 / ✗ 8
    ✓ response has data

    HTTP
    http_req_duration..............: avg=8.18s min=4.17s med=8.08s max=12.05s p(90)=9.94s  p(95)=11.23s
      { expected_response:true }...: avg=8.12s min=4.17s med=8.07s max=12.05s p(90)=9.57s  p(95)=11.23s
    http_req_failed................: 2.10%  8 out of 380
    http_reqs......................: 380    9.467364/s

    EXECUTION
    iteration_duration.............: avg=9.18s min=5.18s med=9.09s max=13.05s p(90)=10.95s p(95)=12.23s
    iterations.....................: 380    9.467364/s
    vus............................: 4      min=4        max=100
    vus_max........................: 100    min=100      max=100

    NETWORK
    data_received..................: 8.3 MB 206 kB/s
    data_sent......................: 30 kB  757 B/s

    Run3:
    TOTAL RESULTS

    checks_total.......: 772     19.033559/s
    checks_succeeded...: 100.00% 772 out of 772
    checks_failed......: 0.00%   0 out of 772

    ✓ status is 200
    ✓ response has data

    HTTP
    http_req_duration..............: avg=7.99s min=2.39s med=8.24s max=11.53s p(90)=9.42s  p(95)=9.89s
      { expected_response:true }...: avg=7.99s min=2.39s med=8.24s max=11.53s p(90)=9.42s  p(95)=9.89s
    http_req_failed................: 0.00%  0 out of 386
    http_reqs......................: 386    9.516779/s

    EXECUTION
    iteration_duration.............: avg=8.99s min=3.39s med=9.24s max=12.54s p(90)=10.43s p(95)=10.89s
    iterations.....................: 386    9.516779/s
    vus............................: 1      min=1        max=100
    vus_max........................: 100    min=100      max=100

    NETWORK
    data_received..................: 8.6 MB 212 kB/s
    data_sent......................: 31 kB  761 B/s

## 1000 events
- 100 concurrent users
    Run1:
    TOTAL RESULTS

    checks_total.......: 686    16.20615/s
    checks_succeeded...: 98.54% 676 out of 686
    checks_failed......: 1.45%  10 out of 686

    ✗ status is 200
      ↳  97% — ✓ 333 / ✗ 10
    ✓ response has data

    CUSTOM
    errors_5xx.....................: 10    0.236241/s
    errors_total...................: 10    0.236241/s

    HTTP
    http_req_duration..............: avg=9.55s  min=2.87s med=9.97s  max=12.83s p(90)=11.7s  p(95)=11.79s
      { expected_response:true }...: avg=9.5s   min=2.87s med=9.94s  max=12.83s p(90)=11.7s  p(95)=11.79s
    http_req_failed................: 2.91% 10 out of 343
    http_reqs......................: 343   8.103075/s

    EXECUTION
    iteration_duration.............: avg=10.56s min=3.88s med=10.97s max=13.83s p(90)=12.71s p(95)=12.8s
    iterations.....................: 343   8.103075/s
    vus............................: 2     min=2         max=100
    vus_max........................: 100   min=100       max=100

    NETWORK
    data_received..................: 74 MB 1.7 MB/s
    data_sent......................: 27 kB 648 B/s

    Run2:
    TOTAL RESULTS

    checks_total.......: 674    16.353294/s
    checks_succeeded...: 96.29% 649 out of 674
    checks_failed......: 3.70%  25 out of 674

    ✗ status is 200
      ↳  92% — ✓ 312 / ✗ 25
    ✓ response has data

    CUSTOM
    errors_5xx.....................: 25    0.606576/s
    errors_total...................: 25    0.606576/s

    HTTP
    http_req_duration..............: avg=9.64s  min=2.85s med=10.23s max=13.49s p(90)=12.33s p(95)=13.39s
      { expected_response:true }...: avg=9.46s  min=2.85s med=10.06s max=13.49s p(90)=11.5s  p(95)=13.4s
    http_req_failed................: 7.41% 25 out of 337
    http_reqs......................: 337   8.176647/s

    EXECUTION
    iteration_duration.............: avg=10.64s min=3.86s med=11.23s max=14.5s  p(90)=13.33s p(95)=14.4s
    iterations.....................: 337   8.176647/s
    vus............................: 5     min=5         max=100
    vus_max........................: 100   min=100       max=100

    NETWORK
    data_received..................: 69 MB 1.7 MB/s
    data_sent......................: 27 kB 654 B/s
    
    Run3:
    checks_total.......: 668    16.303953/s
    checks_succeeded...: 98.20% 656 out of 668
    checks_failed......: 1.79%  12 out of 668

    ✗ status is 200
      ↳  96% — ✓ 322 / ✗ 12
    ✓ response has data

    CUSTOM
    errors_5xx.....................: 12    0.292885/s
    errors_total...................: 12    0.292885/s

    HTTP
    http_req_duration..............: avg=9.55s  min=2.82s med=10.05s max=13.15s p(90)=11.53s p(95)=11.83s
      { expected_response:true }...: avg=9.49s  min=2.82s med=10s    max=13.15s p(90)=11.51s p(95)=11.83s
    http_req_failed................: 3.59% 12 out of 334
    http_reqs......................: 334   8.151976/s

    EXECUTION
    iteration_duration.............: avg=10.55s min=3.83s med=11.05s max=14.15s p(90)=12.53s p(95)=12.84s
    iterations.....................: 334   8.151976/s
    vus............................: 8     min=8         max=100
    vus_max........................: 100   min=100       max=100

    NETWORK
    data_received..................: 72 MB 1.7 MB/s
    data_sent......................: 27 kB 652 B/s
