/*

    About.js

    Defines the webpage "About" as a React DOM
    node for rendering through Routes in App.js

    author: Jo Richmond

*/

export default function About() {
    return (
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>About This App</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
                <p>
                    This application is designed to help users visualize and analyze time series data. It provides features such as time series decomposition and autocorreleograms to assist in understanding the underlying patterns in the data.
                    It is built primarily for the analysis of air quality data, but can be adapted for other types of time series data as well.
                </p>
                <br/>
                <h2>Developers:</h2>
                    <ul>
                        <li>Jo Richmond <a href="mailto:jr362@uakron.edu">Send Email</a></li>
                        <li>Connor Jewell <a href="mailto:cj128@uakron.edu">Send Email</a></li>
                        <li>Raymond Jindra <a href="mailto:rj103@uakron.edu">Send Email</a></li>
                    </ul>
            </div>
        </div>
    );
}
