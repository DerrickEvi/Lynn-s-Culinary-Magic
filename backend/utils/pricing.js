function calculateEventPrice(duration, attendees) {
    const basePrice = 100; // Base price per hour
    const attendeePrice = 10; // Price per attendee
  
    const totalPrice = (basePrice * duration) + (attendeePrice * attendees);
    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
  }
  
  module.exports = calculateEventPrice;
  
 