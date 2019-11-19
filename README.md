# HolidayPlanner
The project can be found on the following link: https://holidayplannerapp.azurewebsites.net


The point of the application is for users to be able to make a list of their upcoming vacations, and find out the weather at their choice of destination at the time of their vacation. However the use of Openweathermap's all year round API costs money, so instead it just displays the weather for today and the upcoming 4 days. The user can register an account and their information is stored in a database. The user can "deactive" a planned holiday, thus removing it from the list, but it can be still viewed in the History tab of 'User Information'

The data used is provided by Openweathermaps and by an MS SQL database with API calls.

The database contains user information, list of vacations created by the users and location information. 
All locations found in the application is stored in the DB instead of getting a list from a Google API for example, since every place needs to have data regarding its longitude, latitude, Tripadvisor id, picture locations to be used by the displayed cards.
