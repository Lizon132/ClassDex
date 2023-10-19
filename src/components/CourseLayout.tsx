import { ReactNode, useEffect, useState } from "react";
import { CurrentSectionData } from "../App";
import { Course } from "../types";
import CourseBodyLayout from "./CourseBodyLayout";


// Show an individual course in the course catalog
const CourseLayout = (ps: {
    course: Course,
    mySections: CurrentSectionData,
    grabber?: ReactNode
}) => {
    // Null menas it has never been opened
    // True means it is expanded
    // False means it has been opened, but is currently hidden
    // This is to enable a closing animation
    const [expanded, setExpanded] = useState(null as null | boolean);

    const numSectionsAdded = ps.course.fullSections.filter(s => ps.mySections.sections.includes(s)).length;

    console.log(ps.course.id, expanded);

    // console.log("Course = ", ps.course.id);
    const elementId = "course-body-" + ps.course.id.split(" ").join("-");
    useEffect(() => {
        if (expanded) {
            // React sometimes is glitchy and keeps old versions of the
            // elements hidden, so then getElementById selects the
            // previous, hidden element
            const elems = document.querySelectorAll("#" + elementId);
            for (let elem of Array.from(elems)) {
                if (elem instanceof HTMLElement) {
                    elem.style.maxHeight = expanded ? `${elem.scrollHeight}px` : "0px";
                }
            }
        }
    }, [expanded, elementId]);

    return (
        <div className="course">
            <div className="course-header">
                <div className="course-header-left">
                    { ps.grabber }
                    <span className="course-title">{ ps.course.id } </span>
                    <span className="course-name">{ ps.course.name } </span>
                </div>

                <div className="course-header-right">
                    {/* Display how many sections are added */}
                    { numSectionsAdded > 0 &&
                      <span style={{ color: numSectionsAdded === ps.course.sections.length ? "green" : "orange" }}
                            className="course-number-added">
                          ({ numSectionsAdded }/{ ps.course.sections.length })
                      </span>
                    }

                    {/* If any sections are already added, have a remove button. Otherwise, have an add button. */}
                    {(numSectionsAdded > 0) ? (
                        <button className="course-remove-all-button"
                                onClick={() => ps.mySections.remove(...ps.course.fullSections)}>
                            —
                        </button>
                    ) : (
                        <button className="course-add-all-button"
                                onClick={() => ps.mySections.add(...ps.course.fullSections)}>
                            +
                        </button>
                    )}

                    <button className="course-fold-button"
                            onClick={() => { setExpanded(!expanded); }}>
                        { expanded ? "◢" : "◥" }
                    </button>
                </div>
            </div>

            {/* Everything below will be hidden when the course is folded */}
            <div className="course-body" id={elementId}
                 style={{ maxHeight: expanded ? `50px` : "0px" }}
            > {
                expanded === null ? null : <CourseBodyLayout course={ps.course} mySections={ps.mySections} />
            } </div>
        </div>
);
}

export default CourseLayout;
