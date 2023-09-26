const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const dbUrl = 'postgres://webadmin:AIIhrh85376@node50264-pitchayanin.proen.app.ruk-com.cloud:11546'

const sequelize = new Sequelize(dbUrl);