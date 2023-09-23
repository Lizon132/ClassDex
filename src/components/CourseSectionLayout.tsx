import { CurrentSectionData } from "../App";
import { Section, Time } from "../types"

function timeString(time: Time): string {
    const pm = time[0] >= 12;
    if (time[0] > 12) time[0] -= 12;
    if (time[0] === 0) time[0] = 12;

    return `${time[0]}`.padStart(2, "0") + ":" + `${time[1]}`.padStart(2, "0") + (pm ? "PM" : "AM");
}

const CourseSectionLayout = (section: Section, mySections: CurrentSectionData) => {
    return (
        <div className="course-section">
            { section.times.map(({ start, end }) => timeString(start) + " - " + timeString(end)).join("\n") }
            { mySections.sections.includes(section) ? (
                <button onClick={() => mySections.remove(section)}>-</button>
            ) : (
                <button onClick={() => mySections.add(section)}>+</button>
            )}
        </div>
    );
};

export default CourseSectionLayout;
