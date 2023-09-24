import {CourseSection, CourseTimeRange} from "../types";

export function overlapBetweenSessionTime(lhs: CourseTimeRange, rhs: CourseTimeRange): boolean {
    if (lhs.dayOfWeek !== rhs.dayOfWeek) {
        return false;
    }

    let lhsStartTimestamp = lhs.startHour * 60 + lhs.startMinute;
    let lhsEndTimestamp = lhs.endHour * 60 + lhs.endMinute;
    let rhsStartTimestamp = rhs.startHour * 60 + rhs.startMinute;
    let rhsEndTimestamp = rhs.endHour * 60 + rhs.endMinute;

    if (rhsEndTimestamp < lhsStartTimestamp || lhsEndTimestamp < rhsStartTimestamp) {
        return false
    }
    return true;
}

function overlapBetweenSessionTimes(lhs: CourseSection, rhs: CourseSection): boolean {
    if (lhs.timeRanges == undefined || rhs.timeRanges == undefined) {
        return false
    }
    for (let i = 0; i < lhs.timeRanges.length; i += 1) {
        for (let j = i; j < rhs.timeRanges.length; j += 1) {
            if (overlapBetweenSessionTime(lhs.timeRanges[i], rhs.timeRanges[j])) {
                return true;
            }
        }
    }

    return false;
}

async function computeOptimalSessionScheduling(for_sessions, minimum_credits, maximum_credits) {
    try {
        const response = await fetch('http://localhost:3000/computeOptimalScheduling', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ for_sessions, minimum_credits, maximum_credits }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error during the computation:', error);
        throw error;
    }
}