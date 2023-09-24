export type CoursePreferences = Partial<{
    time: "early" | "late" | "middle",
    freeFridays: boolean,
    minCreditHours: number,
    maxCreditHours: number,
}>;


export type CourseTimeRange = {
    dayOfWeek: number,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
};

export type CourseSection = {
    id: string,
    crn: string,
    timeRanges: CourseTimeRange[],
    location: string,
    instructor: string,
    instructorRating?: number,
};

export type Course = {
    id: string,
    name: string,
    creditHours: number,
    courseType: string,
    languageOfInstruction: string,
    department: string,
    gradingMode?: string,
    prerequisites: string,
    description: string,
    satisfiesDistribution?: string,
    methodOfInstruction: string,
    finalExam: string,
    gradeMode: string,
    analyzingDiversity: boolean,
    sections: CourseSection[],
    fullSections: Section[],
};

export type Section = {
    course: Course,
    section: CourseSection,
};



export type SessionWithMetadata = {
    session: CourseSection;
    weight: number;
    credit: number;
    courseId: string;
}

