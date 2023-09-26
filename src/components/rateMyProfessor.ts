import ratings from '@mtucourses/rate-my-professors';
import { allCourses } from '../App';
import { CourseSection } from '../types';

// CourseSection[] if still waiting for results
// number if the fetch returned a rating
// null if the fetch didn't return a rating
// This means we only need 1 api call per professor, even if they teach many sections
const professorRatings: {[s: string]: CourseSection[] | number | null} = {};

// Rices ID for rate my professor
const riceRmpId = "U2Nob29sLTc5OQ==";

// Pull rate my professor data
export function fetchRmpData() {
    // Loop through all sections, but only poll each professor once
    for (let course of allCourses) {
        for (let section of course.sections) {
            const existingField = professorRatings[section.instructor];

            if (typeof existingField === "number") {
                section.instructorRating = existingField;

            } else if (existingField instanceof Array) {
                // If waiting on the rating, then add this field to the list of queued sections
                existingField.push(section);

            } else if (existingField === undefined) {
                // Fetch rate my professor data
                const instructorsSections = [section]
                professorRatings[section.instructor] = instructorsSections;

                (async function() {
                    try {
                        const teachers = await ratings.searchTeacher(section.instructor, riceRmpId);
                        if (teachers.length === 0) {
                            // If no teacher was found, set the rating to null
                            professorRatings[section.instructor] = null;
                            return;
                        }

                        const ratingInfo = await ratings.getTeacher(teachers[0].id);

                        // Add the rating to all of the queued sections
                        for (let section of instructorsSections) {
                            section.instructorRating = ratingInfo.avgRating;
                        }
                    } catch {}
                })();
            }
        }
    }
}
