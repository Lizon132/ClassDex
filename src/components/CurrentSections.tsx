import { useEffect } from 'react';
import { CourseOrder, CurrentSectionData } from '../App';
import CatalogCourse from './CatalogCourse';
import * as DragAndDrop from "./DragAndDrop";

function moveArrayItem<T>(array: T[], idx: number, to: number) {
    if (idx >= array.length) throw new Error("Move Array Item: From index out of range");
    if (to >= array.length) throw new Error("Move Array Item: To index out of range");
    if (idx === to) return;

    const elem = array[idx];
    array.splice(idx, 1);
    array.splice(to, 0, elem);
}


function CurrentSections(order: CourseOrder, setOrder: (o: CourseOrder) => void, mySections: CurrentSectionData) {
    useEffect(() => {
        for (let div of Array.from(document.getElementsByClassName("grabber-container"))) {
            const grabber = DragAndDrop.createGrabber((start, end) => {
                moveArrayItem(order, start, end);
                setOrder([...order]);
            });
            div.replaceChildren(grabber);
        }
    });

    // Keep track of whether any courses are required
    let anyRequiredCourses = false;
    return (
        <div>
            <div>Required Courses:</div>
            <div className="drag-container">
                {order.map(course => {
                    if (course == "Optional") {
                        const optionalDiv = <div>Optional Courses:</div>;
                        if (anyRequiredCourses) {
                            return optionalDiv;
                        } else {
                            return (
                                <div>
                                    <div style={{ color: "darkgray" }}>No required courses</div>
                                    <br/>
                                    {optionalDiv}
                                </div>
                            )
                        }
                    }

                    // Check if the user has added any of the course sections
                    const numSectionsAdded = course.sections.filter(s => mySections.sections.includes(s)).length;
                    if (numSectionsAdded > 0) {
                        anyRequiredCourses = true;
                    }

                    // Width is set manually because otherwise the first row gets stuck at 200px
                    return (
                        <div style={{ display: numSectionsAdded ? "block" : "none" }}>
                            { CatalogCourse(course, mySections, <span className="grabber-container"></span>) }
                        </div>
                    )
                })}
            </div>
        </div>
    )

}


export default CurrentSections;