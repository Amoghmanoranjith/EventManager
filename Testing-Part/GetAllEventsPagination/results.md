
# locally
## 10000 events 
- 100 concurrent users
- page size = 100
- aggregated across 3 runs
    TOTAL RESULTS                     

    checks_total.......: 2298   ~12.77/s
    checks_succeeded...: 100.00% 2298 out of 2298
    checks_failed......: 0.00%   0 out of 2298

    ✓ status is 200
    ✓ response has body


    HTTP
    http_req_duration..............: avg=14.18s  min=8.15s  med=14.44s  max=19.91s  
                                 p(90)=15.79s  p(95)=16.38s
    { expected_response:true }...: avg=14.18s  min=8.15s  med=14.44s  max=19.91s  
                                    p(90)=15.79s  p(95)=16.38s
    http_req_failed................: 0.00% 0 out of 1149
    http_reqs......................: 1149   ~6.38/s


    EXECUTION
    vus............................: 100   min=100   max=100
    vus_max........................: 100


    NETWORK
    data_received..................: ~31.5 MB  ~171 kB/s
    data_sent......................: 162 kB    ~902 B/s

