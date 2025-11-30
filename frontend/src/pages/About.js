/*

    About.js

    Defines the webpage "About" as a React DOM
    node for rendering through Routes in App.js

    author: Jo Richmond

*/

export default function About() {
return (
    <>
        <h1>About This App</h1>
        <br/>
        <p>
            This application is designed to help users visualize and analyze time series data. It provides features such as time series decomposition and autocorreleograms to assist in understanding the underlying patterns in the data.
            It is built primarily for the analysis of air quality data, but can be adapted for other types of time series data as well.
        </p>
        <br/>

        <h2>How To Use</h2>
        <br/>
        <p>
            Most of the tools in this site require some fundamental knowledge of statistical concepts. We'll give a crash course
            on what you need to know to use this app right here!
        </p>
        <h4>
            What is a Time Series?
        </h4>
        <p>
            ...
        </p>
        <h4>
            What is an ACF?
        </h4>
        <p>
            ...
        </p>
        <h4>
            What do the 4 graphs in Decomposition mean?
        </h4>
        <p>
            ...
        </p>
        <h4>
            How does the forecasting method used here work?
        </h4>
        <br/>

        <h2>Developers:</h2>
            <ul>
                <li>Jo Richmond <a href="mailto:jr362@uakron.edu">Send Email</a></li>
                <li>Connor Jewell <a href="mailto:cj128@uakron.edu">Send Email</a></li>
                <li>Raymond Jindra <a href="mailto:rj103@uakron.edu">Send Email</a></li>
            </ul>
    </>
);
}
