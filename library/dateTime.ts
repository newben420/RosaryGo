export const getDateTime = (ts: number | string = Date.now()): string => {
    if (typeof ts === "string") {
        ts = parseInt(ts || "0", 10);
    }

    const date = new Date(ts);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dd = date.getDate().toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = date.getHours();
    const mm = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");

    const period = hh >= 12 ? "PM" : "AM";
    const hour12 = hh % 12 || 12;

    return `${month} ${dd}, ${yyyy} ${hour12.toString().padStart(2, "0")}:${mm}:${ss} ${period}`;
};

export const getTimeElapsed = (epochTimestamp: number, currentTimestamp: number): string => {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;

    const elapsedTime = currentTimestamp - epochTimestamp;

    if (elapsedTime < 0) {
        return "0s";
    }

    const weeks = Math.floor(elapsedTime / WEEK);
    const days = Math.floor((elapsedTime % WEEK) / DAY);
    const hours = Math.floor((elapsedTime % DAY) / HOUR);
    const minutes = Math.floor((elapsedTime % HOUR) / MINUTE);
    const seconds = Math.floor((elapsedTime % MINUTE) / SECOND);

    const parts: string[] = [];

    if (weeks > 0) parts.push(`${weeks}w`);
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.slice(0, 2).join(" ");

};