# locally
## 10000 events 
- 100 concurrent users
- page size = 100
- aggregated across 3 runs


### TOTAL RESULTS
- checks_total.......: 31,804   ~176.68/s  
- checks_succeeded...: 100.00% 31,804 out of 31,804  
- checks_failed......: 0.00%   0 out of 31,804  

✓ status is 200  
✓ response has body  

### HTTP
- http_req_duration..............: avg=1.13s  min=50.91ms  med≈1.12s  max=2.38s  
                                   p(90)≈1.31s  p(95)≈1.36s  
- { expected_response:true }....: same as above  
- http_req_failed................: 0.00%  0 out of 15,902  
- http_reqs......................: 15,902   ~88.34/s  

### EXECUTION
- vus............................: 100   min=100   max=100  
- vus_max........................: 100   min=100   max=100  

### NETWORK
- data_received..................: ~426 MB  ~2.37 MB/s  
- data_sent......................: ~1.83 MB  ~10.2 kB/s  
