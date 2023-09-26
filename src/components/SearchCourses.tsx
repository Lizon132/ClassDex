import { CurrentSectionData } from "../App";
import { Course } from "../types";
import CourseLayout from "./CourseLayout";


// Return whether a course matches the given search term
const matchesSearch = (search: string, course: Course): boolean => {
    // Check if the id or name contains the term
    const searchTerms = search.split(" ");
    for (let term of searchTerms) {
        if (!JSON.stringify([
            course.name, course.id, ...course.sections.map(s => s.instructor)
        ]).toLowerCase().includes(term.toLowerCase())) {
            return false;
        }
    }
    return true;
}


const SearchCourses = (ps: { search: string, allCourses: Course[], mySections: CurrentSectionData }) => {
    const filteredCourses = ps.allCourses
          .filter(course => matchesSearch(ps.search, course))
          .map(course => <CourseLayout course={course} mySections={ps.mySections} />);

    // Even courses which don't match must be returned (just hidden) since they contain state
    return (
        <div> {
            filteredCourses.length > 0 ? filteredCourses
                : <div className="gray-label">No matches found</div>
        } </div>
    )

}

export default SearchCourses;
