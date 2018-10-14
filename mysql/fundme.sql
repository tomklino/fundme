SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `github_id` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `github_login` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `github_access_token` varchar(512) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  UNIQUE KEY `user_id` (`user_id`(64)),
  UNIQUE (`github_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Projects` (
  `project_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `online_repo` varchar(512) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `description` varchar(2048) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  UNIQUE KEY `project_id` (`project_id`(64)),
  FOREIGN KEY (`user_id`) REFERENCES Users(`user_id`) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Challenges` (
  `challenge_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `challenge_name` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `project_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `challenge_type` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `challenge_description` varchar(4096) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `assignee` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `creator` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  UNIQUE KEY `challenge_id` (`challenge_id`(64)),
  FOREIGN KEY (`project_id`) REFERENCES Projects(`project_id`) ON DELETE CASCADE,
  FOREIGN KEY (`assignee`) REFERENCES Users(`user_id`) ON DELETE SET NULL,
  FOREIGN KEY (`creator`) REFERENCES Users(`user_id`) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;
