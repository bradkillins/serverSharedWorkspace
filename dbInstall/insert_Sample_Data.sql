/* 
 *	Please run this script in your MSSQL Server  
 *	to insert sample data into the database.
 */

USE Brad_SharedWorkspace;
GO

INSERT INTO Users
VALUES 
	('brad@killins.com', 'Brad', 'Killins', '555-123-4567', 'Coworker'),
	('john@smith.com', 'John', 'Smith', '780-555-2222', 'Owner'),
	('jen@tan.com', 'Jen', 'Tanverie', '123-456-7890', 'Coworker'),
	('tom@garder.com', 'Tom','Garder','403-111-2222','Coworker'),
	('claire@gill.com', 'Claire','Gilliard','603-888-1111','Owner');

INSERT INTO Login
VALUES
	(1, 'brad@killins.com', '123456789', NULL, NULL),
	(2, 'john@smith.com', '987654321', NULL, NULL),
	(3, 'jen@tan.com', 'cats1234', NULL, NULL),
	(4, 'tom@garder.com', 'abcd1234', NULL, NULL),
	(5, 'claire@gill.com', '4321dcba', NULL, NULL);

INSERT INTO Properties
VALUES
	(2, '123 62 ave NW', 'Thorncliffe', 2280, 1, 1, 1),
	(2, '525 11 ave SW', 'Beltline', 3620, 0, 1, 1),
	(2, '1032 Rocky Trail', 'Stanford', 4200, 1, 0, 0),
	(5, '630 5 ave SW', 'Downtown', 3800, 1, 1, 1),
	(5, '1845 60 ave SE', 'Foothills', 6800, 1, 0, 1);

INSERT INTO Workspaces
VALUES
	(1, 'meet', 12, '2020-04-01', 'week', 250.00, 1, 1),
	(1, 'desk', 1, '2020-04-01', 'day', 25.00, 0, 1),
	(1, 'desk', 1, '2020-05-01', 'month', 200.00, 0, 1),
	(1, 'office', 1, '2020-04-20', 'day', 32.00, 0, 0),
	(1, 'office', 1, '2020-04-01', 'month', 350.00, 1, 1),
	(2, 'meet', 4, '2020-04-15', 'month', 250.00, 0, 1),
	(2, 'desk', 2, '2020-04-15', 'week', 85.00, 0, 1),
	(3, 'desk', 1, '2020-05-01', 'month', 200.00, 1, 1),
	(4, 'office', 1, '2020-04-01', 'month', 550.00, 0, 1),
	(4, 'office', 1, '2020-05-01', 'month', 450.00, 0, 1),
	(4, 'meet', 10, '2020-04-15', 'day', 38.50, 0, 1),
	(4, 'desk', 2, '2020-06-01', 'day', 26.50, 0, 1),
	(5, 'office', 1, '2020-06-01', 'month', 250.00, 1, 1),
	(5, 'office', 2, '2020-09-01', 'month', 300.00, 1, 0),
	(5, 'meet', 12, '2020-05-01', 'week', 90.00, 1, 1),
	(5, 'meet', 12, '2020-04-01', 'day', 14.50, 1, 1);

INSERT INTO CoworkerRating
VALUES
	(2, 1, 5),
	(2, 3, 3),
	(2, 4, 4),
	(5, 1, 4),
	(5, 3, 2),
	(5, 4, 5);

INSERT INTO WorkspaceRating
VALUES
	(1, 1, 5),
	(1, 2, 4),
	(1, 3, 5),
	(1, 11, 5),
	(1, 13, 3),
	(1, 16, 5),
	(3, 9, 5),
	(3, 10, 4),
	(3, 12, 2),
	(3, 13, 4),
	(3, 11, 4),
	(4, 3, 3),
	(4, 2, 3),
	(4, 16, 4),
	(4, 12, 4),
	(4, 13, 5),
	(4, 9, 4);

INSERT INTO WorkspaceReviews
VALUES
	(1, 1, 'Stunning building, very nice workspace! I would recommend. I will rent again.'),
	(1, 13, 'Dissapointing, not much else to say'),
	(3, 9, 'A high class, executive corner office with a stellar view! If you can afford it, its worth it!'),
	(3, 12, 'Stay away, this place is messy and noisy. Its hard to get work done.'),
	(4, 2, 'Average place, nothing special.'),
	(4, 13, 'Great experience, I will be back!'),
	(4, 12, 'Decent atmosphere, I would return');

INSERT INTO PropertyImages
VALUES
	(1, '/img/prop/U3h98C8r9v3gE4z8.jpg'),
	(2, '/img/prop/Xc3f1vBr9v2fEozm.jpg'),
	(2, '/img/prop/nM32fA1kuZ1k9ub6.jpg'),
	(4, '/img/prop/R8vhalq92u90HIOF.jpg'),
	(4, '/img/prop/Pu9v8bjkaq8eujvp.jpg'),
	(5, '/img/prop/09jiqf93i312HIvu.jpg');

INSERT INTO WorkspaceImages
VALUES
	(1, '/img/work/wqhCBIOhiovVOPja.jpg'),
	(2, '/img/work/pif8iaIOHydyg3aC.jpg'),
	(2, '/img/work/F38Jnsjs8hG9dslp.jpg'),
	(5, '/img/work/1vCIOdh9iyrlamr3.jpg'),
	(8, '/img/work/bjfh983y8ry80BKH.jpg'),
	(12, '/img/work/N9fhBOoif9ab37Ob.jpg'),
	(15, '/img/work/90HUOivh39vHO903.jpg'),
	(10, '/img/work/a88yfpHIO92cnklS.jpg');