import CurrentSections from './components/CurrentSections';
import TwoColumns from './components/TwoColumns';
import './App.css';
import { Course, Section } from './types';
import { useMemo, useState } from 'react';
import SearchCourses from './components/SearchCourses';
import SESSIONS from "./courses";


type AppState = "current" | "browse";

const allSections = SESSIONS as any as Section[];

// Generate a list of all courses grouped by name
const allCourses: Course[] = [];
for (let section of allSections) {
    if (section.times.length === 0) continue;

    const existing = allCourses.find(c => c.name == section.name);
    if (existing) {
        if (existing.sections.every(s => JSON.stringify(s.times) !== JSON.stringify(section.times))) {
            existing.sections.push(section);
        }
    } else {
        allCourses.push({ name: section.name, title: section.title, sections: [section] });
    }
}


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
            <div hidden={appState !== "current"}>
                <button onClick={() => setAppState("browse")}>+</button>
                { CurrentSections(courseOrder, setCourseOrder, sectionData) }
            </div>
            <div hidden={appState !== "browse"}>
                <button onClick={() => setAppState("current")}>Back</button>
                <div>{ SearchCourses(allCourses, sectionData) }</div>
            </div>
        </div>,
        "Right",
    );
};

export default App;
