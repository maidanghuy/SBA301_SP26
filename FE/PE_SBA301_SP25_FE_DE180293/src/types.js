/**
 * @typedef {Object} Room
 * @property {number} roomId
 * @property {string} roomNumber
 * @property {string} roomTypeName
 * @property {number} roomMaxCapacity
 * @property {number} roomPricePerDay
 * @property {boolean} roomStatus
 * @property {string} [roomDetailDescription]
 */

/**
 * @typedef {Object} Customer
 * @property {number} id
 * @property {string} email
 * @property {string} fullName
 * @property {string} role
 * @property {boolean} [active]
 */

/**
 * @typedef {Object} BookingDetail
 * @property {number} roomId
 * @property {string} roomNumber
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} actualPrice
 */

/**
 * @typedef {Object} Booking
 * @property {number} bookingReservationId
 * @property {number} customerId
 * @property {string} bookingDate
 * @property {string} bookingStatus
 * @property {number} totalPrice
 * @property {BookingDetail[]} details
 */

// when imported, the file is treated as an ES module; types are available via JSDoc only
export { };