# FastForecast

This web-based application will allow for several statistical processes on time series data. The base data sets will be based around pollutants
and the Air Quality Index. Due to the fact that these data sets are somewhat difficult to forecast, there will be the option to add more
'forecastable' time series data.

This project is made as the group term project for CPSC475-020 Database Management at the University of Akron, Fall 2025.

## User Features[^1]

1. Graphical Display of Time Series Data
2. Forecasting of Time Series Data with the Holt-Winters Model and the Autoregressive Integrated Moving Average Model (Advanced Feature) 
3. Decomposition of Time Series Data into Seasonal, Trend, and Residual Components
4. Correllogram of a Time Series's Autocorrelation Function (ACF)
5. User Signup/Login and Route Protection
6. User Uploads of .csv Files into the Database
7. Safe[^2] SQL Console
8. Manual Addition of Series and Points

[^1]: Tutorials and explanations are in the "Help" page in the site

[^2]: The console is *probably* safe but I can't 100% guarantee it due to my own inexperience with the subject

## Admin Features

1. Admin Panel Database Manipulation
2. CLI .csv Uploads

---

## Project Team

* Jo Richmond <jr362@uakron.edu>
* Connor Jewell <cj128@uakron.edu>
* Raymond Jindra <rj103@uakron.edu>

## Techstack

* Frontend - React.js, created using create-react-app.
    - Language: JavaScript / JSX
    - Server: nginx
* Backend - Django
    - Language: Python
    - Server: Built-in dev server[^3]
* Database - MySQL
* OS used for containers: Ubuntu
* Other tools - Docker for containerization, Git for version control.
    - Bash component is a script for backend startup that auto-seeds the database with provided .csv files if the db is empty.

[^3]: This project is a demo, swapping is just inconvenient.
