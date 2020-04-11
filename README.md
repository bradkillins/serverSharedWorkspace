SharedWorkspace - Server/
A web-app that lets work-space renters connect with work-space owners/
by Bradley Killins/
b.killins499@mybvc.ca/
SODV1201: Final Project - Phase 2/
<br/>
Using Node.js, Express & MMSQL

Instillation:
<br/>
This application requires Node.js and Microsoft SQL Server/
<br/>
---- The database scripts have recently been updated!! ----
<br/>
Please run the SQL scripts in the 'dbInstall' folder on your MSSQL server./
Configure application setting in 'config.js' in the root folder./
Run app.js in the root folder/
<br/>
You should now be able to navigate to: localhost:port in your browser.
<br/>
There are two user types:/

Owners

- Can view their own properties/workspaces
- Can create new properties/workspaces
- Can edit or delete their own properties/workspaces

Coworkers

- Can view a table of available workspaces that have been marked listed.
- Can sort or filter by any column in the table.
- Can view owner details for any workspace in table.

The following logins can be used for testing:

- Owner: john@smith.com - Pass: 987654321
- Coworker: jen@tan.com - Pass: cats1234
