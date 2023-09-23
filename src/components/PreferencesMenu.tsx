import { useState } from "react";

type Preferences = Partial<{
    
}>


const PreferencesMenu = () => {
    const [prefs, setPrefs] = useState({});

    return (
        <div id="preferences-menu">
            <label htmlFor="preferences-fold-checkbox">
                <div className="courses-heading">Preferences</div>
            </label>
            <input type="checkbox" id="preferences-fold-checkbox"></input>
            <div id="preferences-container">
                <div>Pref1</div>
                <div>Pref2</div>
                <div>Pref3</div>
            </div>
        </div>
    )
}

export default PreferencesMenu;
