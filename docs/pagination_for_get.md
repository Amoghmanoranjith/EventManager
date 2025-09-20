# Adding pagination for get events
events are sorted on the basis of timestamp
input is page number and size 

input:
pagination - true/false
page - int
size - int

calculate:
skip = size * (page - 1)
take = size


i need to handle:
- out of bounds for page number and size
- 

metadata:
"pagination": {
   "total_records": 100,
   "current_page": 1,
   "total_pages": 10,
   "next_page": 2,
   "prev_page": null
 }

testing:
virtual user will have a defined size 
will 