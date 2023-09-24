import { CurrentSectionData } from "../App";
import { Section } from "../types"

export function timeString(hour: number, minute: number): string {
    const pm = hour >= 12;
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    const str = `${hour}`.padStart(2, "0") + ":" + `${minute}`.padStart(2, "0") + (pm ? "PM" : "AM");
    return str;
}

const CourseSectionLayout = (section: Section, mySections: CurrentSectionData) => {
    return (
        <div className="course-section">
            { section.section.timeRanges.map(({ startHour, startMinute, endHour, endMinute }) => (
                timeString(startHour, startMinute) + " - " + timeString(endHour, endMinute)
            )).join("\n") }
            { mySections.sections.includes(section) ? (
                <button onClick={() => mySections.remove(section)}>-</button>
            ) : (
                <button onClick={() => mySections.add(section)}>+</button>
            )}
        </div>
    );
};

export default CourseSectionLayout;
