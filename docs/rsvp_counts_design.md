## 1. create a column in events table
➕ one query will get me the event info as well as number of rsvps to that event
➕ this means faster reads
➕ i have all the info related to event at one place so simple schema
➖ whenever there is a new rsvp i would need to update this table as well
➖ there will be write contention for this table
➖ not ideal to have a constantly changing column in a table which stores relatively stable data
➖ cause lets say i am performing an update on this column im ideally in a transaction this means reads/writes cannot take place for that row
(but in postgresql we have MVCC-multi-version concurrency control so not a real issue as reads can take place from same record)
➖ also not a good normalization practice

## 2. create a new table which stores the rsvp counts for a given event id
➕ separation of concerns and cleaner design
➕ scalable 
➕ makes sure that events table is more available for reads 
➕ i can have a separate api which will call events table to get info on event then another for fetching the info from this table
➕ thus i wont have to worry about a single api needing to get hit db twice and take more time to return a response (increase in perceived responsiveness)
➕ or i can perform a join operation and get info in one db query
➖ write contention if one person rsvps for an event then others cannot read or write until this is done
➖ make sure that rsvps on update should also update this table to avoid data drift in db level

## 3. perform a count query in real time
➕ i save memory
➕ always consistent values returned
➖ takes more time if there are a lot of records in rsvps table


