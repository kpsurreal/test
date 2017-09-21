CREATE TABLE `statistic`.`stat_common` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `real_url` varchar(2500) NOT NULL DEFAULT '',
  `cache_key` varchar(200) NOT NULL DEFAULT '',
  `type` varchar(100) NOT NULL DEFAULT '',
  `group` varchar(100) NOT NULL,
  `count` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `url_key` (`cache_key`),
  KEY `type` (`type`),
  KEY `date` (`date`),
  KEY `group` (`group`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
