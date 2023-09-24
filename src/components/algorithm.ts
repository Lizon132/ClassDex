import { CourseSection, Section, CoursePreferences, CourseTimeRange, SessionWithMetadata } from "../types";

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

export async function computeOptimalSessionScheduling(
    for_sessions: SessionWithMetadata[], minimum_credits: number, maximum_credits: number,
): Promise<SessionWithMetadata[]> {
    try {
        const response = await fetch('http://localhost:3001/computeOptimalScheduling', {
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


export async function callAlgorithmAndUpdate(
    sections: Section[], numRequired: number, prefs: CoursePreferences,
    update: (s: Section[]) => void,
) {
    console.log(prefs, sections);
    const withMetadata = sections.map(s => ({
        session: s.section,
        weight: 1,
        credit: s.course.creditHours ?? 0,
        courseId: s.course.id,
    }));

    // const scheduleWithMetadata = withMetadata;
    const scheduleWithMetadata = await computeOptimalSessionScheduling(
        withMetadata,
        prefs.minCreditHours ?? 12,
        prefs.maxCreditHours ?? 18,
    );

    // Find the correct courses based on the crns returned from the optimization function
    const schedule = scheduleWithMetadata.map(metadata => (
        sections.find(sec => sec.section.crn === metadata.session.crn)
    ));

    update(schedule);
}
