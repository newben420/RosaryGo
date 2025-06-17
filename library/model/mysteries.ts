const mysteryDayMap = [
    [1, 6],
    [4],
    [2, 5],
    [3, 0],
]

export const getMysteryIndex = (timestamp: number = Date.now()) => {
    // return 3;
    const day = (new Date(timestamp)).getDay();
    return mysteryDayMap.findIndex(m => m.indexOf(day) != -1);
}