// Function to validate time format (HH:mm:ss)
function isValid24HoursTime(time) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time);
}

// Function to check if startTime is lesser than endTime
function isStartTimeLessThanEndTime(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return start < end;
}

module.exports = {
    isValid24HoursTime,
    isStartTimeLessThanEndTime
}