-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE Events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1500) NOT NULL, -- made mandatory
    date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_by UUID NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE
);

-- RSVPs Table
CREATE TABLE RSVPs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_id UUID NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Yes', 'No', 'Maybe')),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE,
    UNIQUE (user_id, event_id) -- prevents duplicate RSVPs
);

-- User insertions
INSERT INTO Users (name, email) VALUES
('Alice', 'alice@gmail.com'),
('Bob', 'bob@yahoo.com'),
('Carol', 'carol@hotmail.com'),
('David', 'david@gmail.com'),
('Eve', 'eve@outlook.com'),
('Frank', 'frank@gmail.com'),
('Grace', 'grace@yahoo.com'),
('Heidi', 'heidi@hotmail.com'),
('Ivan', 'ivan@gmail.com'),
('Judy', 'judy@protonmail.com');

-- Event insertions
INSERT INTO Events (title, description, date, city, created_by) VALUES
('Hackathon', '24-hour coding marathon for developers and problem solvers.', '2025-09-01', 'Bangalore', '7507da33-0f3b-4c76-bcb7-8f4e4cec334b'), -- Alice
('AI Workshop', 'Hands-on session exploring AI concepts and building models.', '2025-09-05', 'Delhi', 'a3dbfbeb-5d93-4c96-a4cd-a02f8cf91b9b'), -- Bob
('Music Fest', 'Live music performances by popular indie and local bands.', '2025-09-10', 'Mumbai', '379c5c20-07eb-4206-8eec-7b25f7d751b2'), -- Carol
('Startup Meetup', 'Networking event for entrepreneurs, investors, and techies.', '2025-09-15', 'Hyderabad', '6eba9259-b0ca-40e8-b90e-76241b2731b2'), -- David
('Art Expo', 'Exhibition showcasing modern and contemporary artworks.', '2025-09-20', 'Chennai', '9ed809aa-99f9-4130-8617-3ad8d7c473ef'); -- Eve

-- RSVP insertion
INSERT INTO RSVPs (id, user_id, event_id, status) VALUES
-- Hackathon (5 RSVPs)
('1b9e3c87-baf2-4f92-94ea-62b246db1d4d', '7507da33-0f3b-4c76-bcb7-8f4e4cec334b', 'abe09f60-dccd-44dd-a2b7-cd0b6c5bf4e9', 'Yes'),
('2e6c7d4a-7e6b-45cc-a8c2-0cbfd532f3d5', '09c33eb1-b2de-4d18-a851-b30581cd8e79', 'abe09f60-dccd-44dd-a2b7-cd0b6c5bf4e9', 'Maybe'),
('3fa8f87f-22ab-4b63-9fc5-8cf0ff11a3c6', '44bfd94c-b547-4800-a4e8-c20582098475', 'abe09f60-dccd-44dd-a2b7-cd0b6c5bf4e9', 'No'),
('4aa1cc3a-f9c1-4926-962f-df57f4f04e77', '6eba9259-b0ca-40e8-b90e-76241b2731b2', 'abe09f60-dccd-44dd-a2b7-cd0b6c5bf4e9', 'Yes'),
('5bb8dc3c-6f71-4a34-a9fd-3855cf6f0e9a', '379c5c20-07eb-4206-8eec-7b25f7d751b2', 'abe09f60-dccd-44dd-a2b7-cd0b6c5bf4e9', 'Yes'),

-- AI Workshop (4 RSVPs)
('5dc24a3f-289c-41e5-a1a0-3bafc36420fd', 'a3dbfbeb-5d93-4c96-a4cd-a02f8cf91b9b', '8653f4a3-e6af-4ef0-b35d-be43bb0074f9', 'Yes'),
('6eb77f4a-f48d-4688-bc88-c9d65eafdd2c', '9ed809aa-99f9-4130-8617-3ad8d7c473ef', '8653f4a3-e6af-4ef0-b35d-be43bb0074f9', 'No'),
('7b28e193-7e4e-4054-892d-76c312c2af68', 'af8d8b19-251d-4348-974e-57cbcabef2a6', '8653f4a3-e6af-4ef0-b35d-be43bb0074f9', 'Maybe'),
('8c69a3f7-3d1d-4e6c-bc3a-bbb9a91c9b0d', '15e19e67-0783-4c43-8c42-b62aa1403a83', '8653f4a3-e6af-4ef0-b35d-be43bb0074f9', 'Yes'),

-- Music Fest (4 RSVPs)
('9fdd4c6f-d153-48e4-a1d1-38e212cfcb7a', '379c5c20-07eb-4206-8eec-7b25f7d751b2', 'd44f20e3-729f-4099-8d99-926917348c20', 'Yes'),
('a2bc6d07-50f8-4d9d-92cb-f18e850d8e09', '09c33eb1-b2de-4d18-a851-b30581cd8e79', 'd44f20e3-729f-4099-8d99-926917348c20', 'No'),
('b14d9d70-5e27-4afc-96f7-227dc963c14a', '754dcdfb-803b-4942-8433-aa3804a0e5d0', 'd44f20e3-729f-4099-8d99-926917348c20', 'Maybe'),
('c3f12b27-bbda-4d8d-96f0-70de91cb2780', 'a3dbfbeb-5d93-4c96-a4cd-a02f8cf91b9b', 'd44f20e3-729f-4099-8d99-926917348c20', 'Yes'),

-- Startup Meetup (4 RSVPs)
('d47a6d9b-09d1-44a6-a514-5caa23d1a14c', '6eba9259-b0ca-40e8-b90e-76241b2731b2', '29545e10-fbf5-4083-80a5-b553875a595b', 'Yes'),
('e55db17e-7bb9-4af2-bfb6-07d463509b9e', '44bfd94c-b547-4800-a4e8-c20582098475', '29545e10-fbf5-4083-80a5-b553875a595b', 'Maybe'),
('f6c37e99-c0f0-45aa-b914-9f55a650f1ad', '9ed809aa-99f9-4130-8617-3ad8d7c473ef', '29545e10-fbf5-4083-80a5-b553875a595b', 'Yes'),
('0a83ef21-ec11-4df7-92de-545b61f18a4d', '7507da33-0f3b-4c76-bcb7-8f4e4cec334b', '29545e10-fbf5-4083-80a5-b553875a595b', 'No'),

-- Art Expo (4 RSVPs)
('1f24c65a-1e67-45af-9b02-1733b55a7c8d', '9ed809aa-99f9-4130-8617-3ad8d7c473ef', '170b9193-a5ac-4ccd-9eac-e2800e403809', 'Yes'),
('2b52de6a-18c6-4e2c-bc74-927ffb9c43ff', 'af8d8b19-251d-4348-974e-57cbcabef2a6', '170b9193-a5ac-4ccd-9eac-e2800e403809', 'Maybe'),
('3c8d4b04-1fd6-40a7-9198-c6b6cf924db5', '15e19e67-0783-4c43-8c42-b62aa1403a83', '170b9193-a5ac-4ccd-9eac-e2800e403809', 'Yes'),
('4d7bce07-3d4c-49e7-a3fb-38dd0b7a9c20', '754dcdfb-803b-4942-8433-aa3804a0e5d0', '170b9193-a5ac-4ccd-9eac-e2800e403809', 'No');
