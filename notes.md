## create the app using npx

npx create-react-app <name-of-app>

## start the project

- login to the directory
- npm start

## convert jsx file into component

- first intall the vscode extension: ES7+ React/Redux/React-Native/JS snippets
- then run: rafc
- for example, this logic was used in LoginSignup.jsx file

## to start the database

- create the superuser with the command: python manage.py createsuperuser
- complete the forms

## implemente RBAC

### user roles:

- Doctor: Can view, create, edit, and delete all patients
- **Nurse**: Can view and create patients, limited edit access
- **Admin**: Full access to all patients and user management

### access rules:

- Admins: Full access to everything
- Doctors: Full access to all patient records
- Nurses: Can view all patients, create new ones
- Others: Only see their own created records

### Testing Roles:

1. Create users with different roles during registration
2. Login with different roles to test access levels
3. Use Django admin to change user roles if needed
