import { useState } from "react";
import { CurrentSectionData } from "../App";
import { Course, Section } from "../types";
import CatalogCourse from "./CatalogCourse";

function SearchCourses(allCourses: Course[], mySections: CurrentSectionData) {
    const [search, setSearch] = useState("");

    return (
        <div>
            {allCourses.map((course) => CatalogCourse(course, mySections))}
        </div>
    )

}

export default SearchCourses;
