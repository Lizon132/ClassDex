import { useState } from "react";
import { CurrentSectionData } from "../App";
import { Course, Section } from "../types";
import CatalogCourse from "./CatalogCourse";

function SearchClasses(allCourses: Course[], mySections: CurrentSectionData) {
    const [search, setSearch] = useState("");

    console.log("Searching")
    return (
        <div>
            {allCourses.map((course) => CatalogCourse(course, mySections))}
        </div>
    )

}

export default SearchClasses;
