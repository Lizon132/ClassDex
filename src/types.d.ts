export type Time = [number, number];
export type Meeting = { start: Time, end: Time, days: Day[] };

export type Section = {
    times: Meeting[];
    title: string;
    name: string;
    max: string | null;
    enrolled: string | null;
};

export type Course = {
    title: string,
    name: string,
    sections: Section[],
}

export type Preferences = Partial<{
    time: "early" | "late" | "middle",
    freeFridays: boolean,
    minCreditHours: number,
    maxCreditHours: number,
}>
