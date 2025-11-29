# FastForecast

This web-based application will allow for several statistical processes on time series data. The base data sets will be based around pollutants
and the Air Quality Index. Due to the fact that these data sets are somewhat difficult to forecast, there will be the option to add more
'forecastable' time series data.

This project is made as the group term project for CPSC475-020 Database Management at the University of Akron, Fall 2025.

## Planned Features[^1]

1. ~~Forecasting (Advanced Feature)~~ 
2. ~~Admin DB manipulation~~
3. ~~Graphical display of time series~~
4. ~~CLI csv uploads~~
5. ~~Time series decomposition graph~~
6. ~~Autocorreleogram~~
7. ~~FE login (to protect the DB from FE features)~~
8. FE user csv uploads (Advanced Feature)
9. Manual addition of time series and points in FE
10. *Time series comparison (multiple series on one graph)*
11. *Cross-correlogram*

[^1]: Lines with strikethrough are completed.
    Italicized lines may not be completed, are optional

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
    - Server: Built-in dev server[^2]
* Database - MySQL
* OS used for containers: Ubuntu
* Other tools - Docker for containerization, Git for version control.
    - Bash component is a script for backend startup that auto-seeds the database with provided .csv files if the db is empty.

[^2]: This will change for production, but we don't know what to swap to so we'll cross that bridge when we get to it.

###### This is the development README, usage docs will be added to this document upon release 1.0.
