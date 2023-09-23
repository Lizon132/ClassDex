import { ReactNode, useState } from "react";
import { CurrentSectionData } from "../App";
import { Course, Section } from "../types";


// Show an individual course in the course catalog
export default function CatalogCourse(course: Course, mySections: CurrentSectionData, grabber?: ReactNode) {
    const [folded, setFolded] = useState(true);
    const numSectionsAdded = course.sections.filter(s => mySections.sections.includes(s)).length;
    return (
        <div className="course">
            { grabber }
            <span>{ course.name } </span>

            {/* Display how many sections are added */}
            { numSectionsAdded > 0 &&
              <span style={{ color: numSectionsAdded === course.sections.length ? "green" : "orange" }}>
                  { numSectionsAdded }/{ course.sections.length }
              </span>
            }

            {/* If all sections are already added, have a button to remove all. Otherwise, have a button to add all. */}
            {
                (numSectionsAdded === course.sections.length) ? (
                    <button onClick={() => mySections.remove(...course.sections)}>-</button>
                ) : (
                    <button onClick={() => mySections.add(...course.sections)}>+</button>
                )
            }

            <button onClick={() => setFolded(!folded)}>{ folded ? ">" : "v" }</button>

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
