## Users Table
### Primary key:
- id

### Columns:
- **id**:  
  Primary key uses `UUID` instead of `SERIAL` for better scalability, shard-friendliness, and improved security.  

- **name**:  
  Required field with a maximum length of 100 characters.  

- **email**:  
  Required field with a maximum length of 320 characters (per email standards).  
  Must be **unique** to prevent duplicate accounts under different names.  

- **created_at**:  
  Automatically set to the current timestamp at the time of insertion, recording the exact creation time.  

-----------
## Events Table
### Primary key:
- id
### Foreign keys:
- created_by : references to id in Users table

### Columns:
- **id**:  
  Primary key using `UUID` with default `gen_random_uuid()`.  
  Chosen for global uniqueness, scalability, and security benefits over sequential IDs.  

- **title**:  
  Required field (`NOT NULL`) with a maximum length of 200 characters.  
  Long enough to support descriptive event titles while avoiding excessive storage use.  

- **description**:  
  Required field (`NOT NULL`) with a maximum length of 1500 characters. Not allowing null values cause we intend the user to provide description if they want to host event.
  Length is generous to allow rich descriptions without requiring external storage types.  

- **date**:  
  Required field representing the calendar date of the event (`DATE`). Not allowing null as the event has to have some date of hosting.

- **city**:  
  Required field (`NOT NULL`) with a maximum length of 100 characters. Not allowing null as city of event is important for a event.
  Sufficient for long city names worldwide.  

- **created_by**:  
  Required field storing the `UUID` of the user who created the event.  
  Enforced via a foreign key reference to `Users(id)` with `ON DELETE CASCADE`, ensuring that when a user is deleted, all events created by them are also removed.  

-----------
## RSVPs Table
### Primary key:
- id
### Foreign keys:
- user_id : references to id in Users table
- event_id : references to id in Events table

### Columns:
- **id**:  
  Primary key using `UUID` with default `gen_random_uuid()`.  
  Ensures globally unique identifiers for each RSVP record, avoiding conflicts and making the table shard-friendly.  

- **user_id**:  
  Required field (`NOT NULL`) storing the `UUID` of the user who responded to an event.  
  References `Users(id)` to maintain relational integrity. `ON DELETE CASCADE` ensures that if a user is deleted, their RSVPs are automatically removed.  

- **event_id**:  
  Required field (`NOT NULL`) storing the `UUID` of the event being responded to.  
  References `Events(id)` to enforce valid event linkage. `ON DELETE CASCADE` ensures that when an event is deleted, all associated RSVPs are also cleaned up.  

- **status**:  
  RSVP status stored as `VARCHAR(20)`.  
  A `CHECK` constraint enforces controlled values: `'Yes'`, `'No'`, or `'Maybe'`.  
  To avoid free-form inputs and ensures consistent reporting.  

- **UNIQUE (user_id, event_id)**:  
  Composite unique constraint to prevent duplicate RSVP entries.  
  Ensures that a user can only RSVP once per event.  
