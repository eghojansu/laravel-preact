-- Db root
INSERT INTO `csmenu` (`grp`, `parent`, `menuid`, `label`, `icon`, `url`, `attrs`, `grade`) VALUES
('db', null, 'db', 'Dashboard', 'house', '/', null, 1),
('db', null, 'ad', 'Administration', 'gear', null, null, 2);

INSERT INTO `csmenu` (`grp`, `parent`, `menuid`, `label`, `icon`, `url`, `perm`, `grade`) VALUES
('db', 'ad', 'aduser', 'Users', 'people', 'adm/user', 'adm.user', 1),
('db', 'ad', 'adpref', 'Preference', 'bookmark-heart', 'adm/pref', 'adm.pref', 2);

-- Ac root
INSERT INTO `csmenu` (`grp`, `parent`, `menuid`, `label`, `icon`, `url`, `attrs`, `grade`) VALUES
('ac', null, 'ac', 'Account', 'person-circle', null, null, 1);

INSERT INTO `csmenu` (`grp`, `parent`, `menuid`, `label`, `icon`, `url`, `attrs`, `grade`) VALUES
('ac', 'ac', 'acprof', 'Profile', 'person', 'ac/profile', null, 1),
('ac', 'ac', 'acsep1', '--sep', null, null, null, 2),
('ac', 'ac', 'acout', 'Logout', 'box-arrow-right', null, '{"data-confirm":"logout","class":"text-danger"}', 3);
