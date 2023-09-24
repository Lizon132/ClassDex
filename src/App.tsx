import CurrentSections from './components/CurrentSections';
import TwoColumns from './components/TwoColumns';
import { Course, Section } from './types';
import { useState } from 'react';
import SearchCourses from './components/SearchCourses';
import COURSES from "./courses";
import SearchBox from './components/SearchBox';
import PreferencesMenu from './components/PreferencesMenu';
import ScheduleLayout from './components/ScheduleLayout';

import './App.css';


type AppState = "current" | "browse";

const allCourses = (COURSES as any as Course[]);
allCourses.forEach(c => {
    c.sections = c.sections.filter(s => s.timeRanges?.length > 0);
});

const allSections: Section[] = allCourses.flatMap(course => {
    course.fullSections = [];
    return course.sections.map(section => {
        const fullSection = { course, section };
        course.fullSections.push(fullSection);
        return fullSection;
    });
});


// Props passed down to children in order to access the currently added sections
export type CurrentSectionData = {
    sections: Section[],
    add: (...s: Section[]) => void,
    remove: (...s: Section[]) => void,
}

export type CourseOrder = (Course | "Optional")[];


const App = () => {
    const [appState, setAppState] = useState("current" as AppState);
    const [mySections, setMySections] = useState([] as Section[]);
    const [courseOrder, setCourseOrder] = useState(["Optional" as const, ...allCourses]);
    const [search, setSearch] = useState("");


    // Create an object that allows child components to modify the user's selected sections
    const sectionData = {
        sections: mySections,
        add: (...newSections: Section[]) => {
            for (let newSection of newSections) {
                if (!mySections.includes(newSection)) {
                    mySections.push(newSection);
                }
            }
            setMySections([...mySections]);
        },
        remove: (...removeSections: Section[]) => {
            setMySections(mySections.filter(s => !removeSections.includes(s)));
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
                {PreferencesMenu()}
                { CurrentSections(courseOrder, setCourseOrder, sectionData) }
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
