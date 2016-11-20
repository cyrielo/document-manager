'use strict';
const models = require('../models/index');
const passwordHelper = require('./../helpers/password');
const pass = new passwordHelper();
const users = [
  {
  firstname: 'Kate',
  lastname: 'Andy',
  email: 'ketty@mail.com',
  password: pass.generate('kate'),
  role: 'admin'
},{
  firstname: 'Mike',
  lastname: 'Rumble',
  email: 'mike@mail.com',
  password: pass.generate('mike'),
  role: 'regular'
},{
  firstname: 'King',
  lastname: 'Obi',
  email: 'king@mail.com',
  password: pass.generate('king'),
  role: 'regular'
}
];

const docs = [
  {
  "title": "The parable of perry",
  "content": "Perry is an imaginary figure, fantasied by little kids of this generation",
  "ownerId": 1,
  "access": 'private',
  "role": "admin"
},{
  "title": "Honey I shrunk the kids",
  "content": "This was the title of an american movie produced a couple years ago",
  "ownerId": 2,
  "access": 'public',
    "role": "regular"
}, {
  "title" : "A warmonger",
  "content" : "A person who encourages or advocates aggression or warfare towards other nations or groups",
  "ownerId": 3,
  "access": 'private',
    "role": "regular"
},{
  "title": "Alice in Wonderland",
  "content": "Alice falls into a rabbit hole and enters a world full of imagination.",
  "ownerId": 2,
  "access": 'private',
    "role": "regular"

},{
  "title": "The Lord of the Rings: The Fellowship of the Ring.",
  "content": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.",
  "ownerId": 1,
  "access": 'public',
    "role": "admin"
}
];

const roles = [
  {title: 'admin'},{title: 'regular'}
  ];

models.sequelize.sync({logging: false}).then(()=>{
  models.roles.bulkCreate(roles).then(()=>{
    models.users.bulkCreate(users).then(()=>{
      models.documents.bulkCreate(docs).then(()=>{
      }).catch((error)=>{
        console.log('Error occurred for seeding roles',error);
      });
    }).catch((error)=>{
      console.log('Error occurred for seeding users',error);
    });
  }).catch((error)=>{
    console.log('Error occurred for seeding documents',error);
  });
});
