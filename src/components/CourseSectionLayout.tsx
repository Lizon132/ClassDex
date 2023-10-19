import { CurrentSectionData } from "../App";
import { Section } from "../types"

export function timeString(hour: number, minute: number): string {
    const pm = hour >= 12;
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    const str = `${hour}`.padStart(2, "0") + ":" + `${minute}`.padStart(2, "0") + (pm ? "PM" : "AM");
    return str;
}

const CourseSectionLayout = (ps: { section: Section, mySections: CurrentSectionData }) => {
    // Group time ranges by same start and end times on different days
    const ranges: { start: string, end: string, days: number[] }[] = [];
    for (let time of ps.section.section.timeRanges) {
        const startStr = timeString(time.startHour, time.startMinute);
        const endStr = timeString(time.endHour, time.endMinute);

        // Figure out if there are other days with this same time range
        const existing = ranges.find(({ start, end }) => start===startStr && end===endStr);
        if (existing) {
            existing.days.push(time.dayOfWeek);
        } else {
            ranges.push({ start: startStr, end: endStr, days: [time.dayOfWeek] });
        }
    }

    const sectionIsAdded = ps.mySections.sections.includes(ps.section);


    return (
        <div className={ sectionIsAdded ? "course-section course-section-added" : "course-section" }>
            <div className="course-section-info">
                <div className="course-info-body">CRN: { ps.section.section.crn }</div>
                { ranges.map(({ start, end, days }, i) => (
                    <div key={i} className="course-section-time">
                        {
                            [6,0,1,2,3,4,5].map(day => {
                                const dayClass = days.includes(day) ? "weekday weekday-active" : "weekday";
                                return <div className={ dayClass }>{ "MTWRFSS"[day] }</div>;
                            })
                        }
                        <div className="time-range">{ start + " - " + end }</div>
                    </div>
                )) }
                <div>
                    <span className="course-info-header">Instructor:</span>
                    <span className="course-info-body">{ ps.section.section.instructor }</span>
                    { ps.section.section.instructorRating ? (
                        <div className="rmp">
                            Rate My Professor Rating = 
                            <div className="rmp-rating">{ ps.section.section.instructorRating }</div>
                        </div>
                    ) : null }
                </div>
            </div>
            { sectionIsAdded ? (
                <button className="remove-button"
                        onClick={() => ps.mySections.remove(ps.section)}>
                    —
                </button>
            ) : (
                <button className="add-button"
                        onClick={() => ps.mySections.add(ps.section)}>
                    +
                </button>
            )}
        </div>
    );
};

export default CourseSectionLayout;
