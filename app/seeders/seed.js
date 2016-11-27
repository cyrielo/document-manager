class Seeder {
  constructor() {
    this.models = require('../models/index');
    const PasswordHelper = require('./../helpers/password');
    this.pass = new PasswordHelper();
  }

  init() {
    this.models.sequelize.sync({ logging: false })
      .then(() => {
        this.setUpRoles()
          .then(() => {
            this.setUpUsers()
              .then(() => {
                this.setUpDocuments()
                  .catch(() => {
                    console.log('Unable to seed documents');
                  });
              })
              .catch(() => {
                console.log('Unable to seed users');
              });
          })
          .catch(() => {
            console.log('Unable to seed roles');
          });
      });
  }

  setUpUsers() {
    const users = [{
      firstname: 'Kate',
      lastname: 'Andy',
      email: 'ketty@mail.com',
      password: this.pass.generate('kate'),
      role: 'admin',
    },
      {
        firstname: 'Mike',
        lastname: 'Rumble',
        email: 'mike@mail.com',
        password: this.pass.generate('mike'),
        role: 'regular',
      },
      {
        firstname: 'King',
        lastname: 'Obi',
        email: 'king@mail.com',
        password: this.pass.generate('king'),
        role: 'regular',
      },
    ];
    return this.models.users.bulkCreate(users);
  }

  setUpRoles() {
    const roles = [{
      title: 'admin',
    },
      {
        title: 'regular',
      },
    ];
    return this.models.roles.bulkCreate(roles);
  }

  setUpDocuments() {
    const docs = [
      {
        title: 'The parable of perry',
        content: 'Perry is an imaginary figure, fantasied by little kids of this generation',
        ownerId: 1,
        access: 'private',
        role: 'admin',
      },
      {
        title: 'Honey I shrunk the kids',
        content: 'This was the title of an american movie produced a couple years ago',
        ownerId: 2,
        access: 'public',
        role: 'regular',
      },
      {
        title: 'A warmonger',
        content: 'A person who encourages or advocates ' +
        'aggression or warfare towards other nations or groups',
        ownerId: 3,
        access: 'private',
        role: 'regular',
      },
      {
        title: 'Alice in Wonderland',
        content: 'Alice falls into a rabbit hole and enters a world full of imagination.',
        ownerId: 2,
        access: 'private',
        role: 'regular',

      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring.',
        content: 'An unusual alliance of man, elf, dwarf, ' +
        'wizard and hobbit seek to destroy a powerful ring.',
        ownerId: 1,
        access: 'public',
        role: 'admin',
      },
    ];
    return this.models.documents.bulkCreate(docs);
  }
}

module.exports = new Seeder().init();
