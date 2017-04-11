/*
	init script for the bot
	runs every startup, and ensures the database is up to spec
*/

-- serverdata table
CREATE TABLE IF NOT EXISTS `servers` (
	`id` VARCHAR(25) NOT NULL,
	`name` TEXT,
	`chatprefixes` BLOB,	-- serialized JSON
	PRIMARY KEY (`id`)
);

-- users table
CREATE TABLE IF NOT EXISTS `users` (
	`id` VARCHAR(25) NOT NULL,
	`lastseen` BIGINT,	-- last time seen online
	`lasttalked` BIGINT,	-- last time sent a message visible to the bot
	`commands` INT,	-- commands run
	`messages` INT,	-- messages seen
	`errors` INT,	-- number of exceptions they've generated
	`apicalls` INT	-- number of api calls they've caused to happen
	
);
