import CurrentSections from './components/CurrentSections';
import TwoColumns from './components/TwoColumns';
import { Course, Section } from './types';
import { useState } from 'react';
import SearchCourses from './components/SearchCourses';
import COURSES from "./courses";
import SearchBox from './components/SearchBox';
import PreferencesMenu from './components/PreferencesMenu';
import ScheduleLayout from './components/ScheduleLayout';
import { fetchRmpData } from './components/rateMyProfessor';
import { callAlgorithmAndUpdate } from "./components/algorithm"
import { getPreferences } from "./components/PreferencesMenu"

import './App.css';
import "./index";

// Initialize images
export const clockImage = require("./icons/clock.jpg") as any;
export const personImage = require("./icons/person.jpg") as any;
export const worldImage = require("./icons/world.jpg") as any;
export const aImage = require("./icons/a.jpg") as any;


type AppState = "current" | "browse";

export const allCourses = (COURSES as any as Course[]);
// Remove sections that don't have a time
for (let c of allCourses) {
    c.sections = c.sections.filter(s => s.timeRanges?.length > 0);
}

// Add full section objects to each course
for (let course of allCourses) {
    course.fullSections = [];
    course.sections.forEach(section => {
        const fullSection = { course, section };
        course.fullSections.push(fullSection);
        return fullSection;
    });
}


// Pull rate my professor data
fetchRmpData();


// Props passed down to children in order to access the currently added sections
export type CurrentSectionData = {
    sections: Section[],
    add: (...s: Section[]) => void,
    remove: (...s: Section[]) => void,
}

export type CourseOrder = (Course | "Optional")[];


function orderSections(sections: Section[], order: CourseOrder): Section[] {
    return order.flatMap(course => {
        if (course === "Optional") return [];
        return course.fullSections.filter(section => sections.includes(section));
    });
}

function requiredSectionCount(order: CourseOrder): number {
    return order.indexOf("Optional");
}


const App = () => {
    // The current tab of the left side bar
    const [appState, setAppState] = useState("current" as AppState);
    // Which sections you have selected
    const [mySections, setMySections] = useState([] as Section[]);
    // The priority of your courses
    const [courseOrder, setCourseOrder] = useState(["Optional" as const, ...allCourses]);
    // The current search term
    const [search, setSearch] = useState("");
    // The schedule results from the algorithm
    const [sectionResults, setSectionResults] = useState([] as Section[]);


    const update = () => {
        callAlgorithmAndUpdate(
            orderSections(mySections, courseOrder),
            requiredSectionCount(courseOrder),
            getPreferences(),
            setSectionResults,
        );
    }

    const setMySectionsAndUpdate: ((s: Section[]) => void) = (sections) => {
        setMySections(sections);
        update();
    }

    const setCourseOrderAndUpdate: ((s: CourseOrder) => void) = (order) => {
        setCourseOrder(order);
        update();
    }


    // Create an object that allows child components to modify the user's selected sections
    const sectionData = {
        sections: mySections,
        add: (...newSections: Section[]) => {
            for (let newSection of newSections) {
                if (!mySections.includes(newSection)) {
                    mySections.push(newSection);
                }
            }
            setMySectionsAndUpdate([...mySections]);
        },
        remove: (...removeSections: Section[]) => {
            setMySectionsAndUpdate(mySections.filter(s => !removeSections.includes(s)));
        },
    }

    return TwoColumns(
        <div>
            <div className="left-column-header">
                {(appState === "current") ? null
                 : <button onClick={() => {
                               setAppState("current");
                               // Clear the search box
                               (document.getElementById("search-box-input") as HTMLInputElement).value = "";
                           }}>←</button>
                }
                {
                    SearchBox((newSearch) => {
                        setSearch(newSearch);
                        if (appState === "current") setAppState("browse");
                    })
                }
            </div>

            {/* Display the current sections */}
            <div hidden={appState !== "current"}>
                {PreferencesMenu(update)}
                { CurrentSections(courseOrder, setCourseOrderAndUpdate, sectionData) }
            </div>

            {/* Display searched for sections */}
            <div hidden={appState !== "browse"}>
                <div>{ SearchCourses(search, allCourses, sectionData) }</div>
            </div>
        </div>,
        ScheduleLayout(mySections),
    );
};

export default App;
