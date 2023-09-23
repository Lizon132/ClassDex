const SearchBox = (setSearchTerm: (s: string) => void) => {
    return (
        <form
            onSubmit={(e) => {
                {/* console.log("Submitting!", e.currentTarget.value); */} 
                e.preventDefault(); // <-- prevent the default form action
                setSearchTerm((document.getElementById("search-box-input") as HTMLInputElement).value);
            }}
        >
            <input
                id="search-box-input"
                key="searchBox"
                type="text"
                placeholder="🔎 Find Courses"
                onChange={(e) => {}}
            />
        </form>
    );
}

export default SearchBox;
