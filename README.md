
# Secure Student Attendance Tracking System(SSATS) backend

This project was created for the assignment of CMSE353 - Security Of Software systems term project.

## Documentation

[Online](https://ahmadabbas02.github.io/cmse353-term-project-docs/)\
[Locally](TODO)

## Environment Variables

To run this project, you need to have a file created with the name `.env.development.local` in the parent directory.

You will need to add the following environment variables to your .env file

`PORT` - The port that the server will be running in.

`DATABASE_URL` - The path where you want the database to be in.

`ENCRYPTION_KEY` - DES Encryption/Description key

`SECRET_KEY` - Related to session creation

### Example

```env
# PORT
PORT = 3000

# DATABASE
DATABASE_URL = file:./dev.db
ENCRYPTION_KEY = DES_KEY

# TOKEN
SECRET_KEY = SESSION_CREATION_KEY

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true
```
