/*

    Home.js

    Defines the home page for the FastForecast
    dashboard as a React DOM node for rendering
    in App.js through Routes.

    author: Jo Richmond

*/

export default function Home() {
    return (
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>Welcome!</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
                <p style={{ textAlign: "center" }}>
                    You can navigate to any of our tools using the bar above. If there are no tools, please sign in or sign up.
                </p>
            </div>
        </div>
    );
}
