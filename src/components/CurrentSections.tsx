import { useEffect } from 'react';
import { CourseOrder, CurrentSectionData } from '../App';
import CourseLayout from './CourseLayout';
import * as DragAndDrop from "./DragAndDrop";


function moveArrayItem<T>(array: T[], idx: number, to: number) {
    if (idx >= array.length) throw new Error("Move Array Item: From index out of range");
    if (to >= array.length) throw new Error("Move Array Item: To index out of range");
    if (idx === to) return;

    const elem = array[idx];
    array.splice(idx, 1);
    array.splice(to, 0, elem);
}


const CurrentSections = (order: CourseOrder, setOrder: (o: CourseOrder) => void, mySections: CurrentSectionData) => {
    useEffect(() => {
        for (let div of Array.from(document.getElementsByClassName("grabber-container"))) {
            const grabber = DragAndDrop.createGrabber((start, end) => {
                moveArrayItem(order, start, end);
                setOrder([...order]);
            });
            div.replaceChildren(grabber);
        }
    });

    // Keep track of whether any courses are required and optional
    let anyRequiredCourses = false;
    let anyOptionalCourses = false;
    let passedOptionalFlag = false;

    const draggableElements = order.map(course => {
        if (course === "Optional") {
            passedOptionalFlag = true;
            const optionalCoursesLabel = <div className="courses-heading">Optional Courses:</div>;
            if (anyRequiredCourses) {
                return optionalCoursesLabel;
            } else {
                return (
                    <div>
                        <div className="warning-label">No required courses</div>
                        {optionalCoursesLabel}
                    </div>
                )
            }
        }

        // Check if the user has added any of the course sections
        const numSectionsAdded = course.fullSections.filter(s => mySections.sections.includes(s)).length;
        if (numSectionsAdded > 0) {
            if (passedOptionalFlag) anyOptionalCourses = true;
            else anyRequiredCourses = true;
        }

        // Width is set manually because otherwise the first row gets stuck at 200px
        return (
            <div style={{ display: numSectionsAdded ? "block" : "none" }}>
                { CourseLayout(course, mySections, <span className="grabber-container"></span>) }
            </div>
        );
    });

    return (
        <div>
            <div className="courses-heading">Required Courses:</div>
            <div className="drag-container"> {draggableElements} </div>
            {<div hidden={anyOptionalCourses} className="warning-label">No optional courses</div>}
        </div>
    );
};

export default CurrentSections;

