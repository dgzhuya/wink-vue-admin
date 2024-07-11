SET
	FOREIGN_KEY_CHECKS = 0;

-- 创建 w_user 表
CREATE TABLE
	IF NOT EXISTS `w_user` (
		`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`delete_time` DATETIME,
		`username` VARCHAR(30) NOT NULL,
		`nickname` VARCHAR(30),
		`mobile` VARCHAR(255),
		`gender` TINYINT,
		`major` INT,
		`address` VARCHAR(30),
		`avatar` VARCHAR(100),
		`password` VARCHAR(100) NOT NULL
	);

-- 向 w_user 表插入数据
INSERT INTO
	w_user (
		username,
		nickname,
		major,
		password,
		mobile,
		gender
	)
VALUES
	(
		'super-admin',
		'超级管理员',
		1,
		'$2a$10$aSRwOHnesbDdHoeExUy9hOo.vqAdfzspvE9/U4lCX9lI7tbdDIugG',
		'400-823823',
		1
	);

-- 创建 w_role 表
CREATE TABLE
	IF NOT EXISTS `w_role` (
		`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`delete_time` DATETIME,
		`title` VARCHAR(30) NOT NULL,
		`description` VARCHAR(200)
	);

-- 向 w_role 表插入数据
INSERT INTO
	w_role (title, `description`)
VALUES
	('管理员', '拥有基础权限信息，处理后台管理系统基础设置');

-- 创建 w_permission 表
CREATE TABLE
	IF NOT EXISTS `w_permission` (
		`id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
		`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`delete_time` DATETIME,
		`title` VARCHAR(100) NOT NULL,
		`key` VARCHAR(100),
		`description` VARCHAR(200),
		`pid` INT,
		FOREIGN KEY (`pid`) REFERENCES `w_permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
	);

-- 向 w_permission 表插入数据
INSERT INTO
	w_permission (title, `key`, `description`)
VALUES
	('系统管理', '#super_admin', '系统管理权限');

INSERT INTO
	w_permission (title, `key`, `description`, `pid`)
VALUES
	('用户管理', '#super_admin_user', '用户信息查看', 1),
	('角色管理', '#super_admin_role', '角色信息查看', 1),
	('权限管理', '#super_admin_permission', '权限信息查看', 1),
	('添加用户', '#super_admin_user@add', '添加用户信息', 2),
	('编辑用户', '#super_admin_user@update', '编辑用户信息', 2),
	('删除用户', '#super_admin_user@delete', '删除用户信息', 2),
	('添加角色', '#super_admin_role@add', '添加角色信息', 3),
	('编辑角色', '#super_admin_role@update', '修改角色信息', 3),
	('删除角色', '#super_admin_role@delete', '删除角色信息', 3),
	('设置角色权限', '#super_admin_role@set', '设置角色权限', 3),
	(
		'添加权限',
		'#super_admin_permission@add',
		'添加权限信息',
		4
	),
	(
		'编辑权限',
		'#super_admin_permission@update',
		'更新权限信息',
		4
	),
	(
		'删除权限',
		'#super_admin_permission@delete',
		'删除权限信息',
		4
	);

-- 创建 w_user_role 表
CREATE TABLE
	IF NOT EXISTS `w_user_role` (
		`uid` INT NOT NULL,
		`rid` INT NOT NULL,
		FOREIGN KEY (`uid`) REFERENCES `w_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (`rid`) REFERENCES `w_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
		PRIMARY KEY (`uid`, `rid`)
	);

-- 向 w_user_role 表插入数据
INSERT INTO
	w_user_role (`uid`, `rid`)
VALUES
	(1, 1);

-- 创建 w_role_permission 表
CREATE TABLE
	IF NOT EXISTS `w_role_permission` (
		`rid` INT NOT NULL,
		`pid` INT NOT NULL,
		FOREIGN KEY (`rid`) REFERENCES `w_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (`pid`) REFERENCES `w_permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
		PRIMARY KEY (`rid`, `pid`)
	);

-- 向 w_role_permission 表插入数据
INSERT INTO
	w_role_permission (`rid`, `pid`)
VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(1, 4),
	(1, 5),
	(1, 6),
	(1, 7),
	(1, 8),
	(1, 9),
	(1, 10),
	(1, 11),
	(1, 12),
	(1, 13),
	(1, 14);

SET
	FOREIGN_KEY_CHECKS = 1;