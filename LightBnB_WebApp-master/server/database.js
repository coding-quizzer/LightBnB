const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');


const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`
    SELECT * FROM users
    WHERE email = $1`, [email])
    .then(data => { 
      if(!data.rows[0]) return null;
      return data.rows[0];
    })
    .catch(err => console.error(err.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(
    `SELECT * FROM users 
     WHERE id = $1`, [id])
  .then(data => {
    if(!data.rows[0]) return null;
    return data.rows[0];
  })
  .catch(err => console.error(err.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [user.name, user.email, user.password])
  .then(data => {
    console.log(data.rows[0])
    return data.rows[0];
  })
  .catch(err => console.error(err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(
    `SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN reservations ON properties.id = property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY title, reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;`, [guest_id, limit])
  .then(result => {return result.rows})
  .catch (err => console.error(err.stack));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{
 *  city,
 *  owner_id,
 *  minimum_price_per_night,
 *  maximum_price_per_night,
 *  minimum_rating
 * }} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  const queryParams = [limit];

  const optionEntries = Object.entries(options);
  const optionSetEntries = optionEntries.filter(entry => {return entry[1] && entry[0] !== 'minimum_rating'});
  const validOptions = Object.fromEntries(optionSetEntries);
  // I am not interested in minimum rating because it is used in a different part of the query.
  // delete validOptions.minimum_rating;
  console.log('keys', Object.keys(validOptions), 'length', Object.keys(validOptions).length);
  
  const validOptionsKeys = Object.keys(validOptions);
  let queryString = 
  `
    SELECT DISTINCT properties.*,  AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  if (validOptionsKeys.length > 0) {


    for (let index in validOptionsKeys){

      const intIndex = parseInt(index);

      const keyName = validOptionsKeys[index];

      let optionQueryString = "";

      if (intIndex === 0) {

        optionQueryString += `WHERE `;

      } else optionQueryString += `AND `;
      
      switch(keyName) {
        // Add one to index for difference in array indexes and another one because the first index will always bbe used for the limit
        case 'city': 
        optionQueryString += `LOWER(city) LIKE concat('%', $${intIndex + 2}::text, '%')
        `; 
        queryParams.push(options.city.toLowerCase());
        break;

        case 'minimum_price_per_night': 
        optionQueryString += `cost_per_night > $${intIndex + 2}
        `;
        queryParams.push(options.minimum_price_per_night * 100);
        break;

        case 'owner_id':
          optionQueryString += `owner_id = $${intIndex + 2}
          `;
          queryParams.push(options.owner_id);       
          break;

        case `maximum_price_per_night`:
        optionQueryString += `cost_per_night < $${intIndex + 2}
        `;
        queryParams.push(options.maximum_price_per_night * 100);
      }

      queryString += optionQueryString;

      
      }
     
  }


  queryString += `
    GROUP BY properties.id
    `;
    if (options.minimum_rating) {
      queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.push(options.minimum_rating)}::integer`;
    }

    queryString += `
    ORDER BY cost_per_night
    LIMIT $1;
  `;

  console.log(queryString);
  console.log(queryParams);
  return pool
  .query(
    queryString, queryParams)
    
  .then(result => {return result.rows})
  .catch (err => console.error(err.stack));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 * 
 * {
  owner_id: int,
  title: string,
  description: string,
  thumbnail_photo_url: string,
  cover_photo_url: string,
  cost_per_night: string,
  street: string,
  city: string,
  province: string,
  post_code: string,
  country: string,
  parking_spaces: int,
  number_of_bathrooms: int,
  number_of_bedrooms: int
}
 */
const addProperty = function(property) {

  return pool
  .query (`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code]);

}
exports.addProperty = addProperty;
