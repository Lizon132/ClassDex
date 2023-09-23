import { CurrentSectionData } from "../App";
import { Course } from "../types";
import CourseLayout from "./CourseLayout";


// Return whether a course matches the given search term
function matchesSearch(search: string, course: Course): boolean {
    const searchTerms = search.split(" ");
    for (let term of searchTerms) {
        const lowerTerm = term.toLowerCase()
        if (!(course.name.toLowerCase().includes(lowerTerm)
              || course.title.toLowerCase().includes(lowerTerm))) {
            return false;
        }
    }
    return true;
}


function SearchCourses(search: string, allCourses: Course[], mySections: CurrentSectionData) {
    // Hide any courses which don't match the search term
    // Keep track of whether any match the search term
    let anyMatchesFound = false;
    const filteredCourses = allCourses.map((course) => {
        const matched = matchesSearch(search, course);
        if (matched) anyMatchesFound = true;
        return (
            <div hidden={!matched}>
                {CourseLayout(course, mySections)}
            </div>
        );
    });

    // Even courses which don't match must be returned (just hidden) since they contain state
    return (
        <div>
            { anyMatchesFound ? null : <div className="gray-label">No matches found</div> }
            {filteredCourses}
        </div>
    )

}

export default SearchCourses;

