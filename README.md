SharedWorkspace - Server <br/>
A web-app that lets work-space renters connect with work-space owners <br/>
by Bradley Killins <br/>
b.killins499@mybvc.ca <br/>
SODV1201: Final Project - Phase 2 <br/>

Using Node.js, Express & MMSQL <br/>

Installation:

This application requires Node.js and Microsoft SQL Server <br/>

---- The database scripts have recently been updated!! ----

Please run the SQL scripts in the 'dbInstall' folder on your MSSQL server. <br/>
Configure application setting in 'config.js' in the root folder. <br/>
Run app.js in the root folder <br/>

You should now be able to navigate to: localhost:port in your browser. <br/>

There are two user types: <br/>

Owners

- Can view all workspaces that have been listed
- Can view their own properties/workspaces
- Can create new properties/workspaces
- Can edit or delete their own properties/workspaces

Coworkers

- Can view all workspaces that have been listed
- Can sort or filter by various options
- Can view owner details for any listed workspace

The following logins can be used for testing:

- Owner: john@smith.com - Pass: 987654321
- Coworker: jen@tan.com - Pass: cats1234
