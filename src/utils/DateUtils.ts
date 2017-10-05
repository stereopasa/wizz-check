export const daysBetween = (date1: Date, date2: Date) => {
    // adjust diff for for daylight savings
    var hoursToAdjust = Math.abs(date1.getTimezoneOffset() / 60) - Math.abs(date2.getTimezoneOffset() / 60);
    // apply the tz offset
    date2.setHours(hoursToAdjust);

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms / ONE_DAY)
}

export const toWizzTime = (date: Date) => {
    if (!date) {
        console.warn("date can not be null");
        return null;
    }

    let ISOString = date.toISOString();
    return ISOString.substring(0, ISOString.indexOf("T"));
}    