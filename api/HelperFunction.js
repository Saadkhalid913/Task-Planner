const GetCurrentDate = function() {
  // returns the current day as the number of days passed since january 1, 1970 
  const MillisecondsInDay = 86400000;
  const offset = 14400000 
  return Math.floor((Date.now() - offset) / MillisecondsInDay)
  //18758 at 8PM 
}

module.exports.GetCurrentDate = GetCurrentDate
