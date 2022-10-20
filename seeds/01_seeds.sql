INSERT INTO users (name, email, password) 
VALUES ('Barry Bright', 'barry@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Ready Fox', 'ready@readyfox.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Candy Conner', 'candy@cconner.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Hobbit Hole','description', 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 10000, 0, 1, 1, 'Canada', '45 Hobbiton Cresc.', 'Vancouver', 'BC', 'V5Y 0N9', true),
(3, 'High Mansion','description', 'https://images.unsplash.com/photo-1566908829550-e6551b00979b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80', 'https://images.unsplash.com/photo-1566908829550-e6551b00979b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80', 50000, 0, 3, 15, 'Canada', '63 High Rd', 'Ottawa', 'ON', 'K7H 1E5', false),
(2, 'Barry Farm','description', 'https://images.unsplash.com/photo-1602768320125-da082311da92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybWhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1602768320125-da082311da92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybWhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60', 1000, 0, 2, 4, 'Canada', '1034 Low Lane', 'Harris', 'SK', 'S4T 5T9', true);



INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2002-12-16', '2003-02-28', 1, 1),
('2008-03-17', '2008-08-23', 2, 3),
('2009-12-16', '2010-06-03', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 4, 'message'),
(3, 2, 2, 3, 'message'),
(2, 3, 3, 5, 'message');