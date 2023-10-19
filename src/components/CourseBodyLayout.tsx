import { aImage, clockImage, CurrentSectionData, personImage, worldImage } from "../App";
import { Course } from "../types";
import CourseSectionLayout from "./CourseSectionLayout";


const CourseBodyLayout = (ps: {
    course: Course,
    mySections: CurrentSectionData,
}) => (
    <div className="course-body-inner">
        <div className="course-info-body">{ ps.course.description }</div>
        {/* <div style={{ margin: "15px 0px 0px" }}> */}
        {/*     <span className="course-info-header">Prereqs:</span> */}
        {/*     <span className="course-info-body">{ ps.course.prerequisites ?? "None" }</span> */}
        {/* </div> */}
        <table className="course-info-table">
            <tr>
                <td><img className="course-info-icon" src={clockImage}/>
                    { ps.course.creditHours ?? "?" } Credit Hours
                </td>
                <td><img className="course-info-icon" src={personImage}/>{ ps.course.courseType }</td>
            </tr>
            <tr>
                <td><img className="course-info-icon" src={worldImage}/> ENG</td>
                <td><img className="course-info-icon" src={aImage}/> Letter Grading</td>
            </tr>
        </table>
        {
            ps.course.fullSections.map((section) => (
                <CourseSectionLayout key={section.section.crn}
                                     section={section}
                                     mySections={ps.mySections} />
            ))
        }
    </div>
);

export default CourseBodyLayout;
