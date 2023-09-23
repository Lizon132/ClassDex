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
                setOrder(order);
            });
            div.replaceChildren(grabber);
        }
    });

    return (
        <div className="drag-container">
            {order.map(course => course == "Optional" ? <div>Optional Courses:</div> : (
                // Width is set manually because otherwise the first row gets stuck at 200px
                <div hidden={!course.sections.find(s => mySections.sections.includes(s))}>
                    { CatalogCourse(course, mySections, <span className="grabber-container"></span>) }
                </div>
            ))}
        </div>
    )

}


export default CurrentSections;
