/* 
 *	Please run this script in your MSSQL Server to 
 *	create the database required to run this application.
 */

USE master;
GO
DROP DATABASE IF EXISTS Brad_SharedWorkspace;
GO
CREATE DATABASE Brad_SharedWorkspace;
GO
USE Brad_SharedWorkspace;
GO

CREATE TABLE Users
(userId			INT				PRIMARY KEY		IDENTITY,
email			VARCHAR(50)		NOT NULL		UNIQUE,
firstName		VARCHAR(40)		NOT NULL,
lastName		VARCHAR(40)		NOT NULL,
phone			VARCHAR(30)		NOT NULL,		
type			VARCHAR(8)		NOT NULL);

CREATE TABLE Login	
(loginId		INT				PRIMARY	KEY		IDENTITY,
userId			INT				NOT NULL		REFERENCES Users (userId),
email			VARCHAR(50)		NOT NULL		UNIQUE			REFERENCES Users (email),
password		VARCHAR(50)		NOT NULL,
sessId			VARCHAR(64)		NULL,
lastSessTime	DATETIME		NULL)

CREATE TABLE Properties
(propId			INT				PRIMARY KEY		IDENTITY,
userId			INT				NOT NULL		REFERENCES	Users (userId),
address			VARCHAR(50)		NOT NULL,
neighbor		VARCHAR(40)		NOT NULL,
sqFeet			INT				NOT NULL,
parking			BIT				NOT NULL,
transit			BIT				NOT NULL,
listed			BIT				NOT NULL);

--On delete action set to cascade, when associated Property is deleted Workspace will also be deleted 
CREATE TABLE Workspaces
(workId			INT				PRIMARY KEY		IDENTITY,
propId			INT				NOT NULL		REFERENCES Properties (propId)	ON DELETE CASCADE,
type			VARCHAR(10)		NOT NULL,
occ				INT				NOT NULL,
availDate		DATE			NOT NULL,
term			VARCHAR(8)		NOT NULL,
price			MONEY			NOT NULL,
smoke			BIT				NOT NULL,
listed			BIT				NOT NULL);

CREATE TABLE PropertyImages
(imageId		INT				PRIMARY KEY		IDENTITY,
propId			INT				NOT NULL		REFERENCES Properties (propId)	ON DELETE CASCADE,
imagePath		VARCHAR(150)	NOT NULL);

CREATE TABLE WorkspaceImages
(imageId		INT				PRIMARY KEY		IDENTITY,
workId			INT				NOT NULL		REFERENCES Workspaces (workId)	ON DELETE CASCADE,
imagePath		VARCHAR(150)	NOT NULL);

--A rating cannot be left by the same Rater for the same RatedId - Unique constraint
CREATE TABLE WorkspaceRating
(ratingId		INT				PRIMARY KEY		IDENTITY,
raterId			INT				NOT NULL		REFERENCES Users (userId),
ratedId			INT				NOT NULL		REFERENCES Workspaces (workId)	ON DELETE CASCADE,
rating			TINYINT			NOT NULL		CHECK(rating <= 5),
UNIQUE(raterId, ratedId));

--As Users cannot be deleted, no need for On Delete action
--A rating cannot be left by the same Rater for the same RatedId - Unique constraint
CREATE TABLE CoworkerRating
(ratingId		INT				PRIMARY KEY		IDENTITY,
raterId			INT				NOT NULL		REFERENCES Users (userId),
ratedId			INT				NOT NULL		REFERENCES Users (userId),
rating			TINYINT			NOT NULL		CHECK(rating <= 5),
UNIQUE(raterId, ratedId));

--A rating cannot be left by the same Rater for the same RatedId - Unique constraint
CREATE TABLE WorkspaceReviews

(reviewId		INT				PRIMARY KEY		IDENTITY,
reviewBy		INT				NOT NULL		REFERENCES Users (userId),
reviewFor		INT				NOT NULL		REFERENCES Workspaces (workId)	ON DELETE CASCADE,
review			VARCHAR(500)	NOT NULL,
UNIQUE(reviewBy, reviewFor));

GO

--A view that shows all available workspaces and key details for a Coworker search
CREATE VIEW AvailWorkspaces
AS
SELECT workId, w.propId, address, neighbor, sqFeet, parking, transit, occ, smoke, availDate, term, price
FROM Workspaces AS w JOIN Properties AS p
	ON w.propId = p.propId
WHERE w.listed = 1 AND p.listed = 1;