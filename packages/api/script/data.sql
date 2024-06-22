PRAGMA foreign_keys = OFF;

CREATE TABLE
	IF NOT EXISTS "w_user" (
		"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		"create_time" datetime NOT NULL DEFAULT (datetime ('now', 'localtime')),
		"update_time" datetime NOT NULL DEFAULT (datetime ('now', 'localtime')),
		"delete_time" datetime,
		"username" varchar(30) NOT NULL,
		"nickname" varchar(30),
		"mobile" varchar,
		"gender" tinyint,
		"major" integer,
		"address" varchar(30),
		"avatar" varchar(100),
		"password" varchar(100) NOT NULL
	);

INSERT INTO
	w_user (
		username,
		nickname,
		major,
		'password',
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

CREATE TABLE
	IF NOT EXISTS "w_role" (
		"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		"create_time" datetime NOT NULL DEFAULT (datetime ('now', 'localtime')),
		"update_time" datetime NOT NULL DEFAULT (datetime ('now', 'localtime')),
		"delete_time" datetime,
		"title" varchar(30) NOT NULL,
		"description" varchar(200)
	);

INSERT INTO
	w_role (title, "description")
VALUES
	('管理员', '拥有基础权限信息，处理后台管理系统基础设置');

CREATE TABLE
	IF NOT EXISTS "w_permission" (
		"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		"create_time" datetime NOT NULL DEFAULT (datetime ('now', 'localtime')),
		"update_time" datetime NOT NULL DEFAULT (datetime ('now', 'localtime')),
		"delete_time" datetime,
		"title" varchar(100) NOT NULL,
		"key" varchar(100),
		"description" varchar(200),
		"pid" integer,
		CONSTRAINT "FK_040b9f7aa1f54aee18be64214f6" FOREIGN KEY ("pid") REFERENCES "w_permission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
	);

INSERT INTO
	w_permission (title, "key", "description")
VALUES
	('系统管理', '#super_admin', '系统管理权限');

INSERT INTO
	w_permission (title, "key", "description", "pid")
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

CREATE TABLE
	IF NOT EXISTS "w_user_role" (
		"uid" integer NOT NULL,
		"rid" integer NOT NULL,
		CONSTRAINT "FK_b14f6fc0fd76ed8b7a8ce1c1fc3" FOREIGN KEY ("uid") REFERENCES "w_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
		CONSTRAINT "FK_9c1e9079883873cbcf3e39265b8" FOREIGN KEY ("rid") REFERENCES "w_role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
		PRIMARY KEY ("uid", "rid")
	);

INSERT INTO
	w_user_role ("uid", rid)
VALUES
	(1, 1);

CREATE TABLE
	IF NOT EXISTS "w_role_permission" (
		"rid" integer NOT NULL,
		"pid" integer NOT NULL,
		CONSTRAINT "FK_d5bd5b298da22b24c1bf71e828b" FOREIGN KEY ("rid") REFERENCES "w_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
		CONSTRAINT "FK_9be999aeb38c4212b2f28465c07" FOREIGN KEY ("pid") REFERENCES "w_permission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
		PRIMARY KEY ("rid", "pid")
	);

INSERT INTO
	w_role_permission (rid, pid)
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