There are some endpoints that will be hit more frequently than others
In order of decreasing frequency:
1. Get events list api/events
2. Get info of particular event api/events/:id
3. RSVP api/rsvp this is the endpoint where concurrency spikes hardest because many people race to book.
4. Login api/login
