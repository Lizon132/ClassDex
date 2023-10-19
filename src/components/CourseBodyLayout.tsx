import { aImage, clockImage, CurrentSectionData, personImage, worldImage } from "../App";
import { Course } from "../types";
import CourseSectionLayout from "./CourseSectionLayout";


const CourseBodyLayout = (hidden: boolean, course: Course, mySections: CurrentSectionData) => hidden ? [] : [
    <div className="course-info-body">{ course.description }</div>,
    // <div style={{ margin: "15px 0px 0px" }}>
    //     <span className="course-info-header">Prereqs:</span>
    //     <span className="course-info-body">{ course.prerequisites ?? "None" }</span>
    // </div>,
    <table className="course-info-table">
        <tr>
            <td><img className="course-info-icon" src={clockImage}/>
                { course.creditHours ?? "?" } Credit Hours
            </td>
            <td><img className="course-info-icon" src={personImage}/>{ course.courseType }</td>
        </tr>
        <tr>
            <td><img className="course-info-icon" src={worldImage}/> ENG</td>
            <td><img className="course-info-icon" src={aImage}/> Letter Grading</td>
        </tr>
    </table>,
    ...course.fullSections.map(section => CourseSectionLayout(section, mySections))
]

export default CourseBodyLayout;
