import { CurrentSectionData } from "../App";
import { Course } from "../types";


const CourseHeaderLayout = (course: Course, mySections: CurrentSectionData, numSectionsAdded: number) => {
    return (
        <div className="course-header">
            <div className="course-header-left">
                <span className="course-title">{ course.id } </span>
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
                            onClick={() => mySections.remove(...course.fullSections)}
                    >
                        -
                    </button>
                ) : (
                    <button className="course-add-all-button"
                            onClick={() => mySections.add(...course.fullSections)}
                    >
                        +
                    </button>
                )}
            </div>
        </div>
    );
}

export default CourseHeaderLayout;
