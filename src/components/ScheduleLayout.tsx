import React from "react";
import { Section } from "../types";
import { timeString } from "./CourseSectionLayout";


const events = [
    { name: 'Event 1', startHour: 9, startMin: 0, endHour: 10, endMin: 30, dayOfWeek: 1 },
    { name: 'Event 2', startHour: 13, startMin: 0, endHour: 14, endMin: 30, dayOfWeek: 3 },
    // Add more events as needed
];


function percentHeight(mins: number, totalMins: number): string {
    return `${100*(mins / totalMins)}%`;
}

function hourString(hour: number): string {
    const pm = hour >= 12;
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return hour + (pm ? "PM" : "AM");
}

const ScheduleLayout = (sections: Section[]) => {
    let [minHour, maxHour] = [8, 16];
    for (let section of sections) {
        for (let time of section.section.timeRanges) {
            if (time.startHour < minHour) minHour = time.startHour;
            const endHour = time.endHour + (time.endMinute>0 ? 1 : 0);
            if (endHour > maxHour) maxHour = endHour;
        }
    }

    const minMinute = minHour*60;
    // Add 15 to add some buffer space at the end so the calendar isn't cramped
    const totalMinutes = (maxHour - minHour) * 60 + 15;
    // Check if any times are 5 or 6 (sunday or saturday)
    const weekendClasses = sections.find(s => s.section.timeRanges.find(t => t.dayOfWeek >= 5));
    const numberOfDays = weekendClasses ? 7 : 5;

    const days: { start: number, end: number, text: string[] }[][]
          = Array.from(new Array(numberOfDays), () => []);

    for (let section of sections) {
        for (let time of section.section.timeRanges) {
            days[time.dayOfWeek].push({
                start: time.startHour*60 + time.startMinute,
                end: time.endHour*60 + time.endMinute,
                text: [
                    timeString(time.startHour, time.startMinute) + " - "
                        + timeString(time.endHour, time.endMinute),
                        section.course.name
                ],
            });
        }
    }

    // Sort each day chronologically
    for (let dayArray of days) {
        dayArray.sort((a, b) => a.start - b.start);
    }

    days.unshift(Array.from(new Array(maxHour - minHour), (_, i) => ({
        start: (minHour+i)*60,
        end: (minHour+i)*60+60,
        text: [hourString(minHour+i)],
    })));

    console.log(minMinute, totalMinutes, maxHour);

    return (
        <div className="calendar"> {
            days.map((day, dayIdx) => {
                let prevMinute = 0;
                const events = day.flatMap(({ start, end, text }, rowIdx) => {
                    const vertSpace = (start-minMinute) - prevMinute;
                    prevMinute = end-minMinute;
                    return [
                        <div className="calendar-spacer" style={{ height: percentHeight(vertSpace, totalMinutes) }}></div>,
                        <div className={ dayIdx===0 ? "calendar-time" : "calendar-event" }
                             id={ dayIdx===0 ? `calendar-time-${rowIdx}` : null }
                             style={{ height: percentHeight(end-start, totalMinutes) }}
                        >
                            { <div>{ text.flatMap((line, i) => (i==0) ? line : [<br/>, line]) }</div> }
                        </div>
                    ];
                });
                return (
                    <div className={ dayIdx===0 ? "calendar-time-column" : "calendar-column" }>
                        { <div className="calendar-day-label">
                              {/* Use an invisible character to provide space without anything there */}
                              { ["\u{2064}","Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayIdx] }
                          </div> }
                        { events }
                    </div>
                );
            })
        } </div>
    )
}

export default ScheduleLayout;
