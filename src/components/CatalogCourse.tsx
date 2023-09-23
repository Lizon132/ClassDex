import { ReactNode, useState } from "react";
import { CurrentSectionData } from "../App";
import { Course, Section } from "../types";


// Show an individual course in the course catalog
export default function CatalogCourse(course: Course, mySections: CurrentSectionData, grabber?: ReactNode) {
    const [folded, setFolded] = useState(true);
    return (
        <div className="course">
            { grabber }
            <span>{ course.name } </span>
            <button onClick={() => setFolded(!folded)}>{ folded ? ">" : "v" }</button>

            {/* If all sections are already added, have a button to remove all. Otherwise, have a button to add all. */}
            {
                course.sections.every(s => mySections.sections.includes(s)) ? (
                    <button onClick={() => course.sections.forEach(s => mySections.remove(s))}>-</button>
                ) : (
                    <button onClick={() => course.sections.forEach(s => mySections.add(s))}>+</button>
                )
            }

            {/* Everything below will be hidden when the course is folded */}
            <div hidden={folded}>
                <div>Some more info</div>
                {/* For each section, have a button to individually add/remove that section. */}
                {course.sections.map((section, sectionNum) => (
                    mySections.sections.includes(section) ? (
                        <div>
                            {sectionNum+1} { JSON.stringify(section.times) }
                            <button onClick={() => mySections.remove(section)}>-</button>
                        </div>
                    ) : (
                        <div>
                            {sectionNum+1} { JSON.stringify(section.times) }
                            <button onClick={() => mySections.add(section)}>+</button>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}
