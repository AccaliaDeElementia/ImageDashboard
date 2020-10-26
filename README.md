# ImageDashboard
This is an image dashboard for running on a raspberry pi or similar

Env Variables:
- `DATABASE` - The database client to use. Can be `sqlite3` or `postgres`, defaults to `sqlite3`
- `POSTGRES_HOST` - The postgres db host to use, defaults to `postgres`
- `POSTGRES_DATABASE` - The postgres database name to use, defaults to `postgres`
- `POSTGRES_USER` - The postgres username to use, defaults to `postgres`
- `POSTGRES_PASSWORD` - The postgres password to use, defaults to `postgres`
- `OPENWEATHER_APPID` - The OpenWeather API Key to use to query data from, if not provided no weather data will be queried.
- `OPENWEATHER_LOCATION` - The OpenWeather Location to query data from, Defaults to `London`