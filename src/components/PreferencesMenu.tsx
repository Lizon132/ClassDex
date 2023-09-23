const PreferencesMenu = () => {
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
                    <select id="time-preference-select">
                        <option value="">No preference</option>
                        <option value="early">Early</option>
                        <option value="late">Late</option>
                        <option value="middle">Mid-day</option>
                    </select>
                </div>
                <div className="preference">
                    Min Credit Hours:
                    <input id="min-chs-input" type="text"></input>
                </div>
                <div className="preference">
                    Max Credit Hours:
                    <input id="max-chs-input" type="text"></input>
                </div>
            </div>
        </div>
    )
}

export default PreferencesMenu;
