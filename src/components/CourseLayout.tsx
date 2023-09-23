import { ReactNode, useState } from "react";
import { CurrentSectionData } from "../App";
import { Course, Section } from "../types";
import CourseSectionLayout from "./CourseSectionLayout";


// Show an individual course in the course catalog
const CourseLayout = (course: Course, mySections: CurrentSectionData, grabber?: ReactNode) => {
    const [folded, setFolded] = useState(true);
    const numSectionsAdded = course.sections.filter(s => mySections.sections.includes(s)).length;
    return (
        <div className="course">
            <div className="course-header">
                <div className="course-header-left">
                    { grabber }
                    <span className="course-title">{ course.title } </span>
                    <span className="course-name">{ course.name } </span>
                </div>

                <div className="course-header-right">
                    {/* Display how many sections are added */}
                    { numSectionsAdded > 0 &&
                      <span style={{ color: numSectionsAdded === course.sections.length ? "green" : "orange" }}
                            className="course-number-added"
                            >
                          ({ numSectionsAdded }/{ course.sections.length })
                      </span>
                    }

                    {/* If any sections are already added, have a remove button. Otherwise, have an add button. */}
                    {(numSectionsAdded > 0) ? (
                        <button className="course-remove-all-button"
                                onClick={() => mySections.remove(...course.sections)}
                                >
                            -
                        </button>
                    ) : (
                        <button className="course-add-all-button"
                                onClick={() => mySections.add(...course.sections)}
                                >
                            +
                        </button>
                    )}

                    <button className="course-fold-button"
                            onClick={() => setFolded(!folded)}
                            >
                        { folded ? ">" : "v" }
                    </button>
                </div>
            </div>

            {/* Everything below will be hidden when the course is folded */}
            <div className="course-body" hidden={folded}>
                <div>Some more info</div>
                {/* For each section, have a button to individually add/remove that section. */}
                {course.sections.map(section => CourseSectionLayout(section, mySections))}
            </div>
        </div>
    )
}

export default CourseLayout;

