/*
	init script for the bot
	runs every startup, and ensures the database is up to spec
	
	other database operations can be managed independently by plugins
	however, some basic statistics and information are logged by the base code
*/

-- serverdata table
CREATE TABLE IF NOT EXISTS `servers` (
	`id` VARCHAR(25) NOT NULL,
	`chatprefixes` TEXT,	-- serialized JSON
	`disabled` TINYINT DEFAULT '0',	-- bool; server disallowed from using bot
	PRIMARY KEY (`id`)
);

-- users table
CREATE TABLE IF NOT EXISTS `users` (
	`id` VARCHAR(25) NOT NULL,
	`lastseen` BIGINT,	-- last time seen online
	`lasttalked` BIGINT,	-- last time sent a message visible to the bot
	`disabled` TINYINT DEFAULT '0',	-- bool; user disallowed from using bot
	PRIMARY KEY (`id`)
);

-- moderators table
CREATE TABLE IF NOT EXISTS `moderators` (
	`serverid` VARCHAR(25) NOT NULL,
	`userid` VARCHAR(25) NOT NULL,
	PRIMARY KEY (`serverid`)
);

-- stats table
CREATE TABLE IF NOT EXISTS `stats` (
	`id` VARCHAR(25) NOT NULL,	-- snowflake of item being recorded (user, server, channel, etc.)
	`messages` INT,	-- messages sent
	`commands` INT,	-- commands run
	`errors` INT,	-- number of exceptions generated
	PRIMARY KEY (`id`)
);

-- tags
CREATE TABLE IF NOT EXISTS `tags` (
	`id` INT NOT NULL AUTO_INCREMENT,	-- unique id for each tag
	`server` VARCHAR(25) NOT NULL, -- server snowflake that created the tag
	`channel` VARCHAR(25) NOT NULL,	-- same as above; both used to delete the tag if it's orphaned
	`title` VARCHAR(50),	-- title of tag
	`text` TEXT,	-- tag content
	PRIMARY KEY (`id`),
	INDEX (`title`)
);
