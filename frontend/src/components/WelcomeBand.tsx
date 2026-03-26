// Simple presentational component — no state, no props; just static markup at the top of BooksPage
// The class "welcome-bar" can be styled in App.css or index.css if you want a colored banner
function WelcomeBand() {
    return (
        <div className="welcome-bar">
            <h1>Welcome to the Book List</h1>
        </div>
    )
}

export default WelcomeBand;
