
/** Returns the destination point 
 * when given a bearing and the distance 
 * travelled from a source point. **/
var toRad = (num) => {
    return num * Math.PI / 180;
}
var toDeg = (num) => {
   return num * 180 / Math.PI;
}
export const caculateDestionationPoint = (coords, bearing, distance) => {
    distance = distance / 6371;
    bearing = toRad(bearing);
    
    var lat1 = toRad(coords.lat),
        lng1 = toRad(coords.lng);
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance) + Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing));
    var lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1), Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2));

    if (isNaN(lat2) || isNaN(lng2)) return null;
    return {
        lat: toDeg(lat2),
        lng: toDeg(lng2)
    }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};