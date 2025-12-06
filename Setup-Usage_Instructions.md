# FastForecast Documentation

## Setup Instructions

### Prerequisites

- Operating System:

    - This project was written on a WSL2 Ubuntu instance, specifically Ubuntu 24.04.3 LTS. There should not be any compatibility issues.

    - Docker is run through WSL2, so there may be build differences if this is run on a non-windows or a different architecture. I don't know, haven't tested it.

- Required Technologies:

    - Docker Desktop

        - You need this to run Docker Compose

    - Git
    
        - You need this to clone the repository

Other than that, there are no prerequisites. This project uses Docker, so the required libraries will be installed into the containers, not your computer.

### Startup

1. Find a suitible space in your file system for the repository

2. Copy the repository's link under the HTTPS section of the code tab
    
![Link location in the repository](https://i.imgur.com/qM0ZNA2.png)

3. Run the command 
    
```bash
    git clone repositoryurlhere
```

4.  Go to the new project directory

```bash
    cd FastForecast/
```

5. Run Docker Desktop

6. Once Docker is started, build and launch the site

```bash
    docker-compose up --build
```

7. Once everything has started, go to localhost:3000/ in your browser and the main page will be there

## Usage Documentation

### Admin Features

#### Admin Panel

Utilizing the server-side exclusive features requires an account registered in the admin panel. You can create an admin account
by going to the Exec page of the backend container and running a command.
    
![Docker Desktop App Container](https://i.imgur.com/ERafAZp.png)

![Docker Desktop Backend Container](https://i.imgur.com/vLCPHNU.png)

![Docker Desktop Backend Container Command Line](https://i.imgur.com/GsetLiP.png)

![Docker Desktop Backend CLI Command](https://i.imgur.com/psWKV8r.png)

![Docker Desktop Backend CLI Createsuperuser Username](https://i.imgur.com/DL5SMfM.png)

![Docker Desktop Backend CLI Createsuperuser Email](https://i.imgur.com/WAAszkm.png)

![Docker Desktop Backend CLI Createsuperuser Password](https://i.imgur.com/QZFFSk8.png)

![Docker Desktop Backend CLI Createsuperuser Done](https://i.imgur.com/K7krar7.png)

From here, you can edit the database by going to the datasets listed on the page and deleting or editing records.
There are also user and group records here.

![Admin Page](https://i.imgur.com/Q4KWCS3.png)

![Logged In Admin Page](https://i.imgur.com/hNaqCzS.png)

#### CLI .csv Uploads

To use this, move whatever .csv you want to upload into the database into the data folder. You can get there from the root folder through
the command:

```bash
    cd backend/data/
```

The .csv file must have this format:

timestamp,value,\
YYYY-MM-DD,value1,\
YYYY-MM-DD,value2,\
...\
...

with the first line being the shown header. Timestamps MUST be in an ISO format.

After the .csv is in that folder, it will be included in the container. Rebuild by just running the earlier compose again, then go into the
backend container's Exec page. If you skipped the Admin Panel section, check there for how to get there.

Once here, run this command in the CLI-

```bash
    python manage.py import_csv SeriesNameHere "Description Here" ./data/CSVFileName.csv
```

and it should be imported into the database.

![Docker Desktop Backend CLI Command](https://i.imgur.com/tdmlz1d.png)

![Docker Desktop Backend CLI .csv Import Complete](https://i.imgur.com/Tq9D115.png)

### Basic Features

- Graphical Display of Time Series Data

- Decomposition of Time Series Data into Seasonal, Trend, and Residual Components

- Correllogram of a Time Series's Autocorrelation Function (ACF)

- User Signup/Login and Route Protection

- Safe SQL Console

- Manual Addition of Series and Points

All these features are explained in the Help page in the front end site (localhost:3000)

### Advanced Features

- Forecasting of Time Series Data with the Holt-Winters Model and the Autoregressive Integrated Moving Average Model

    - This is considered an 'advanced' feature, so it will be explained in that section

- User Uploads of .csv Files into the Database

    - This is considered an 'advanced' feature, so it will be explained in that section

#### Forecasting

This feature is explained in the Help page in the front end site (localhost:3000)

#### Front End .csv Uploads

For this feature, .csv files must be forematted as such:

timestamp,value,\
YYYY-MM-DD,value1,\
YYYY-MM-DD,value2,\
...\
...

The first line of the .csv file will always be treated as a header, and the timestamps MUST be in an ISO format.
The title of the series and its description are defined in the form where you upload the document.

### Schema for the SQL Console

#### Series

Table Name: api_series

| id | name | description |
| --:| ---- | ----------- |
|  # | str  |    string   |

id auto-increments, so it is unique.
id serves as a FOREIGN KEY for api_datapoint, so to DELETE any series from this table you must DELETE all the points associated with it.
CASCADE DELETE is set up, so IDK why it's so tempermentatl about this.

#### Data Point

Table Name: api_datapoint

| id | timestamp | value | series_id |
| --:| --------- | -----:| ---------:|
|  # | timestamp |     # |         # |

id auto-increments, so it is unique for every point.
series_id uses the id attribute from the api_series table to associate points with their series, serving as a FOREIGN KEY.

###### Written by Jo Richmond
