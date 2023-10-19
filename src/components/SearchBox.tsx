const SearchBox = (setSearchTerm: (s: string) => void) => {
    return (
        <form
            id="search-box-form"
            onSubmit={(e) => {
                e.preventDefault(); // <-- prevent the default form action
                setSearchTerm((document.getElementById("search-box-input") as HTMLInputElement).value);
            }}
        >
            <input
                id="search-box-input"
                key="searchBox"
                type="text"
                placeholder="Find Courses 🔎"
                onChange={(e) => {}}
            />
        </form>
    );
}

export default SearchBox;
