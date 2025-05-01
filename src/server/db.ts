import mysql from 'mysql2';

export const pool = mysql.createPool({
  host: process.env['DB_HOST']!,
  user: process.env['DB_USER']!,
  password: process.env['DB_PASSWORD']!,
  database: process.env['DB_DATABASE']!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// export const pool = mysql.createPool({
//   host: '192.168.1.13',
//   user: 'miamdv',
//   password: 'Acamar70700!',
//   database: 'miam_dv',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
