import {CourseSection} from "../types";

export type SessionWithMetadata = {
    session: CourseSection;
    weight: number;
    credit: number;
    courseId: string;
}