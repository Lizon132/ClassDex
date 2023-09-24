import { CoursePreferences } from "../types";

export const getPreferences = (): CoursePreferences => {
    const minChs = +((document.getElementById("min-chs-input") as HTMLInputElement).value || NaN);
    const maxChs = +((document.getElementById("max-chs-input") as HTMLInputElement).value || NaN);
    const time = (document.getElementById("time-preference-select") as HTMLSelectElement).value;

    return {
        time: (time as any) || undefined,
        minCreditHours: isFinite(minChs) ? minChs : undefined,
        maxCreditHours: isFinite(maxChs) ? maxChs : undefined,
    };
}

const PreferencesMenu = (update: () => void) => {
    return (
        <div id="preferences-menu">
            <label htmlFor="preferences-checkbox">
                <div className="preferences-heading">
                    Preferences
                    <div className="preferences-fold-indicator">⌄</div>
                </div>
            </label>
            <input type="checkbox" id="preferences-checkbox"></input>
            <div id="preferences-container">
                <div className="preference">
                    Time of Day:
                    <select id="time-preference-select" onChange={update}>
                        <option value="">No Preference</option>
                        <option value="early">Early</option>
                        <option value="late">Late</option>
                        <option value="middle">Mid-day</option>
                    </select>
                </div>
                <div className="preference">
                    Min Credit Hours:
                    <input id="min-chs-input" type="text" onChange={update}></input>
                </div>
                <div className="preference">
                    Max Credit Hours:
                    <input id="max-chs-input" type="text" onChange={update}></input>
                </div>
            </div>
        </div>
    )
}

export default PreferencesMenu;
