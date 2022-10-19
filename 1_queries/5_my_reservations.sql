SELECT reservations.id, title, cost_per_night, start_date, AVG(property_reviews.rating) AS average_rating
FROM properties
JOIN reservations ON properties.id = property_id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY title, reservations.id, cost_per_night
ORDER BY start_date
LIMIT 10;