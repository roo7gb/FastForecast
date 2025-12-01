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
                    A Time Series is a collection of data points over a period of time. For example, we can represent
                    the GDP of the United States as a Time Series, as every fiscal quarter the GDP is released. This
                    data can be taken and plotted as a series with a yearly frequency of 4. Time Series data typically
                    has 3 components, which we discuss below under the Decomposition guide.
                </p>
                <h4>
                    What is an ACF?
                </h4>
                <p>
                        The Autocorrelation Function of a Time Series is a way of viewing if a series is correlated with itself.
                        Time Series that are not self-correlated can be considered random, and we cannot derive information like 
                        seasonal patterns or trends from them. The plot for an ACF is called a correlogram, and each bar represents
                        the time series being correlated with itself at different lags, or time offsets. The two horizontal lines 
                        represent the 95% confidence interval, which means that if the ACF bar goes above the upper one or below the 
                        lower one, we are 95% sure that the ACF at that lag is statistically significant.
                    <br/>
                    <br/>
                        When reading an ACF, patterns in the shape of the ACFs across lags indicate seasonal patterns.
                        If there is a repeating hill in the bars, there is a seasonal pattern. This does not include the decrease
                        of an ACF over lags, as the first ACF will always be 1 and the values will decrease as lags increase.
                    <br/>
                    <br/>
                        You can use the ACF page to generate one of these correlograms for a series in our database. Just enter the 
                        name of the series and the number of lags you want to see, and a correlogram will be generated for you.
                </p>
                <h4>
                    What do the 4 graphs in Decomposition mean?
                </h4>
                <p>
                        There are 3 components to a time series - Trend, Seasonality, and Randomness. The 4 graphs are the 
                        original series, its trend, its seasonal component, and the random variation. Decomposition algorithms
                        try to separate these as best as possible, but they aren't always perfect, and you need to estimate the 
                        seasonal cycle for your data. You can figure out the number of points per cycle by knowing the nature of the 
                        data (monthly and quarterly economic data, for example, typically has yearly seasonality) and also by looking
                        at the data and determining the seasonal cycle's duration by eyeballing it.
                    <br/>
                    <br/>
                        In order to use our tool, just input the name of the series in our database and the number of points per year.
                        After that, just submit and you'll see all 4 graphs be generated for you.
                </p>
                <h4>
                    How do I forecast?
                </h4>
                <p>
                        Forecasting is arguably one of the more important parts of this tool, being used to predict the future
                        based on what we know about the data. We give you the option of 2 different forecasting models-
                        the Holt-Winters model and the Autoregressive Integrated Moving Average model; also known as ARIMA.
                        We also give the option of using the seasonal version of ARIMA, known as SARIMA.
                    <br/>
                    <br/>
                        The Holt-Winters model seeks to reduce randomness in the series to better model the trend and seasonality. 
                        This allows us to make predictions based off of the trend and seasonality observed in the series previously. 
                        This makes it a better forecasting tool for heavily seasonal data, but outliers can skew forecasts, leading to 
                        some inaccuracy. Due to the volatility of AQI data, we believe it is a good predictor, but it can be somewhat unreliable.
                    <br/>
                    <br/>
                        The ARIMA model is a very adaptable tool, best used for non-seasonal data. It is extremely robust, not being influenced
                        by outliers as much as Holt-Winters. It's very flexible and transparent, due to it being a combination of 2 components- 
                        an Autoregressive term and a Moving Average term. SARIMA does work well for seasonal data, but only for short-term
                        forecasting. Holt-Winters is much better for long-term seasonal forecasting.
                    <br/>
                    <br/>
                        Overall, what forecasting method you choose to use should be based off the data. Look at the decomposition and ACF
                        we can generate to determine what method you want to use. For using Holt-Winters, select multiplicative for trend and
                        seasonality if the seasonal variation appears to increase in magnitude in the raw time series. Select additive for both
                        if it appears to be roughly the same magnitude. Seasonal periods is the same as for decomposition, and the forecast steps 
                        refers to the number of data points you want to forecast into the future. This is based off of your data's frequency, so 
                        a year is 4 steps for quarterly data, 12 steps for monthly data, or 365 steps for daily data.
                </p>
            </div>
        </div>
    );
}
