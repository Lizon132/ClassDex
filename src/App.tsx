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


type AppState = "current" | "browse" | "saved";

type SavedSchedule = {
    sections: Section[],
    time: Date,
    name?: string,
};

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
    const [courseOrder, setCourseOrder] = useState(["Optional"] as CourseOrder);
    // The current search term
    const [search, setSearch] = useState("");
    // The schedule results from the algorithm
    const [sectionResults, setSectionResults] = useState([] as Section[]);
    // List of saved schedules
    const [savedSchedules, setSavedSchedules] = useState([] as SavedSchedule[]);


    const updateSchedule = (sections: Section[] = mySections) => {
        setTimeout(
            () => {
                callAlgorithmAndUpdate(
                    orderSections(sections, courseOrder),
                    requiredSectionCount(courseOrder),
                    getPreferences(),
                    setSectionResults,
                );
            },
            100,
        );
    }

    const setMySectionsAndUpdate = (sections: Section[]) => {
        console.log("Setting", sections)
        setMySections(sections);
        updateSchedule(sections);
    };

    const setCourseOrderAndUpdate = (order: CourseOrder) => {
        setCourseOrder(order);
        updateSchedule();
    };


    // Create an object that allows child components to modify the user's selected sections
    const sectionData = {
        sections: mySections,
        add: (...newSections: Section[]) => {
            for (let newSection of newSections) {
                if (!mySections.includes(newSection)) {
                    mySections.push(newSection);
                }
                if (!courseOrder.includes(newSection.course)) {
                    courseOrder.push(newSection.course);
                }
            }
            setCourseOrder([...courseOrder]);
            setMySectionsAndUpdate([...mySections]);
        },
        remove: (...removeSections: Section[]) => {
            const newSections = mySections.filter(s => !removeSections.includes(s));
            setCourseOrder(courseOrder.filter(course => (
                newSections.find(section => section.course === course)
            )));
            setMySectionsAndUpdate(newSections);
        },
    }

    const courseSearchBox = SearchBox((newSearch) => {
        setSearch(newSearch);
        if (appState === "current") setAppState("browse");
    })

    const leftColumnHeader = (
        <div className="left-column-header">{
            appState === "current" ? (
                <>
                    { courseSearchBox }
                    <button className="saved-schedules-button"
                            onClick={ () => setAppState("saved") }>
                        Saved Schedules
                    </button>
                </>

            ) : appState === "browse" ? (
                <>
                    {courseSearchBox}
                    <button className="exit-button"
                            onClick={() => {
                                setAppState("current");
                                // Clear the search box
                                (document.getElementById("search-box-input") as HTMLInputElement).value = "";
                            }}>
                        ←
                    </button>
                </>

            ) : appState === "saved" ? (
                <div>
                    <button className="exit-button" onClick={() => {setAppState("current");}}>←</button>
                    {
                        savedSchedules.map((saved, idx) => (
                            <div className="saved-schedule-list-item">
                                <button onClick={ () => setSavedSchedules(savedSchedules.filter((_, i) => i !== idx)) }>
                                    x
                                </button>
                                <button onClick={ () => setSectionResults(saved.sections) }>
                                    <div>{ saved.name ?? "Unnamed" }</div>
                                    <div>{ saved.time.toLocaleString() }</div>
                                </button>
                            </div>
                        ))
                    }
                </div>
            ) : (<></>)
        }</div>
    );

    return (
        <>
            <button hidden={ sectionResults.length === 0 }
                    onClick={ () => {
                        const newSchedule: SavedSchedule = {
                            time: new Date(),
                            sections: sectionResults,
                        };
                        setSavedSchedules([newSchedule, ...savedSchedules]);
                    }}
            >
                Star
            </button>
            <TwoColumns
                left={ [
                    leftColumnHeader,
                    <div hidden={appState !=="current"}>
                        <PreferencesMenu update={updateSchedule} />
                        <CurrentSections order={courseOrder} setOrder={setCourseOrderAndUpdate}
                                         mySections={sectionData} />
                    </div>,
                    appState !== "browse" ? null : (
                        <SearchCourses search={search}
                                       allCourses={allCourses}
                                       mySections={sectionData} />
                    )
                ] }
                right={ <ScheduleLayout sections={ sectionResults } /> }
            />
        </>
    );
};

export default App;
