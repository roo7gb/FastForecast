/*

    Help.js

    Defines the webpage "Help" as a React DOM
    node for rendering through Routes in App.js

    author: Jo Richmond

*/

export default function Help() {
    return (
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>How To Use This App</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
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
            </div>
        </div>
    );
}
