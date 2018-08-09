SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE IF NOT EXISTS `Projects` (
  `project_id` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `online_repo` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `project_id` (`project_id`(255))
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `github_id` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `github_login` varchar(256) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `github_access_token` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `user_id` (`user_id`(64)),
  UNIQUE (`github_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
