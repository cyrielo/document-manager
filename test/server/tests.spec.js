/**
 * Created by cyrielo on 11/6/16.
 */
'use strict';
process.env.NODE_ENV = 'test';
const app = require('./../../server'),
  supertest = require('supertest'),
  expect = require('chai').expect,
  config = require('./../../app/config/config'),
  requestHandler = supertest(app);
let test_user = {
    firstname: 'Alice',
    lastname: 'Trump',
    email: 'alice@gmail.com',
    password: '123456',
    role: 'regular'
  },
  admin_user = {
    firstname: 'Steve',
    lastname: 'Jobs',
    email: 'steve@gmail.com',
    password: '123456',
    role: 'admin'
  },
  token = '',
  admin_token = '';

describe('User', ()=>{


  it('should create a user', (done)=>{
    // Create regular user
    requestHandler.post('/api/users')
      .set('Accept', 'application/json')
      .send(test_user)
      .expect(201)
      .end((err, res)=>{
        expect(res.body.status).to.equal('success');
        expect(res.body.data.user.email).to.equal(test_user.email);
        token = res.body.data.token;

        // Create admin user
        requestHandler.post('/api/users')
          .send(admin_user)
          .expect(201)
          .end((err, res)=>{
            expect(res.body.status).to.equal('success');
            expect(res.body.data.user.email).to.equal(admin_user.email);
            admin_token = res.body.data.token;
            done();
          });
      });
  });

  it('should not create same user twice', (done)=>{
    requestHandler.post('/api/users')
      .set('Accept', 'application/json')
      .send(test_user)
      .expect(417) //TODO change the http status code
      .end((err, res)=>{
        expect(res.body.status).to.equal('fail');
        expect(res.body.data).to.equal('User already exists!');
        done();
      });
  });

  it('should not create a user with incomplete details', (done)=>{
    requestHandler.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        firstname: 'Gregory',
        lastname: 'George',
        password: '123456'
      })
      .expect(422)
      .end((err, res)=>{
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal('Unable to create user account!');
        done();
      });
  });


  it('should not create a user with invalid role', (done)=>{
    requestHandler.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        firstname: 'Gregory',
        lastname: 'George',
        email: 'gregory@gmail.com',
        password: '123456',
        role: 'invalid-role'
      })
      .expect(422)
      .end((err, res)=>{
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal('Unable to create user account!');
        done();
      });
  });


  it('should ensure the new user has role defined', (done)=>{
    requestHandler.get('/api/users/email/'+encodeURIComponent(test_user.email))
      .set('authorization', token)
      .expect(200)
      .end((err, res)=>{

        expect(res.body.data.role).to.not.be.undefined;
        done();
      });
  });

  it('should expect that new user has both first and last names defined', (done)=>{
    requestHandler.get('/api/users/email/'+encodeURIComponent(test_user.email))
      .set('authorization', token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.data.firstname).to.not.be.undefined;
        expect(res.body.data.lastname).to.not.be.undefined;
        done();
      });
  });

  it('should return all users requested by admin', (done)=>{
    requestHandler.get('/api/users')
      .set('authorization', token)
      .expect(401)
      .end((err, res)=>{
        expect(res.body.message).to.equal('Access denied! You don\'t have admin rights!');
        requestHandler.get('/api/users')
          .set('authorization', admin_token)
          .expect(200)
          .end((req, res)=>{
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Users listed!');
            expect(typeof res.body.data).to.not.be.undefined;
          });
        done();
      });
  });

  /**/

  it('should login', (done) => {
    requestHandler.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        email: 'alice@gmail.com',
        password: '123456'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Successful login');
        expect(typeof res.body.data.user).to.not.be.undefined;
        token = res.body.data.token;
        done();
      });
  });

  it('should not login with invalid credentials', (done) => {
    requestHandler.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        email: 'non-existent-user@gmail.com',
        password: '654321'
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.be.equal('Invalid email and password combination');
        done();
      });
  });


  it('should be able to get a user', (done) => {
    requestHandler.get('/api/users/1')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(typeof res.body.data.firstname).to.not.be.undefined;
        expect(typeof res.body.data.lastname).to.not.be.undefined;
        expect(typeof res.body.data.email).to.not.be.undefined;
        done();
      });
  });


  it('should be able to delete a user', (done) => {
    requestHandler.post('/api/users/login')
      .set('Accept', 'application/json')
      .expect(200)
      .send({
        email: 'ketty@mail.com',
        password: 'kate'
      }).end((err, res)=>{
      requestHandler.delete('/api/users/1')
        .set('authorization', res.body.data.token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.be.equal('success');
          expect(res.body.message).to.be.equal('Operation successful');
          done();
        });
    });

  });

  it('should not be able to delete another user', (done) => {
    requestHandler.delete('/api/users/2')
      .set('authorization', token)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.data).to.be.equal('You don\'t have permission to delete this account');
        done();
      });
  });

  it('should be able to update user details', (done) => {
    requestHandler.put('/api/users/5')
      .set('Accept', 'application/json')
      .set('authorization', admin_token)
      .expect(200)
      .send({
        lastname: 'wozniak'
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('User updated');
        done();
      });
  });

  it('should not be able to update other users details', (done) => {
    requestHandler.put('/api/users/3')
      .set('Accept', 'application/json')
      .set('authorization', admin_token)
      .expect(401)
      .send({
        lastname: 'wozniak'
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Update failed');
        done();
      });
  });

});

describe('Role', ()=>{
  let newRole = {
    title: 'moderator'
  };

  it('should ensure only an admin can create role', (done)=>{
    requestHandler.post('/api/roles')
      .set('authorization', admin_token)
      .send(newRole)
      .expect(201)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Role created');
        requestHandler.post('/api/roles')
          .set('Accept', 'application/json')
          .set('authorization', token)
          .send({title: 'gibberish'})
          .expect(401)
          .end((err, res)=>{
            expect(res.body.status).to.be.equal('fail');
            expect(res.body.message).to.be.equal('Access denied! You don\'t have admin rights!');
            done();
          });

      });
  });

  it('should not create same role twice', (done)=>{
    requestHandler.post('/api/roles')
      .set('authorization', admin_token)
      .send(newRole)
      .expect(403)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Role already exists');
        done();
      });
  });

  it('should return all roles', (done)=>{
    requestHandler.get('/api/roles')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should not return all roles if not admin', (done)=>{
    requestHandler.get('/api/roles')
      .set('authorization', token)
      .expect(401)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Access denied! You don\'t have admin rights!');
        done();
      });
  });

  it('should be able to update a role', (done)=>{
    requestHandler.put('/api/roles/3')
      .set('authorization', admin_token)
      .send({title: 'document-moderator'})
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        //expect(res.body.message).to.be.equal('Access denied! You don\'t have admin rights!');
        done();
      });
  });

  it('should be able to delete role', (done)=>{
    requestHandler.delete('/api/roles/3')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        //expect(res.body.message).to.be.equal('Access denied! You don\'t have admin rights!');
        done();
      });
  });

  //Write a test to validate that at least, “admin” and “regular” roles exist

  it('should ensure admin role exists', (done)=>{
    requestHandler.get('/api/roles/1')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.data.title).to.be.equal('admin');
        done();
      });
  });

  it('should ensure regular role exists', (done)=>{
    requestHandler.get('/api/roles/2')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.data.title).to.be.equal('regular');
        done();
      });
  });



});

describe('Document', ()=>{
  let document_created;

  it('should be able to create document', (done)=>{
    requestHandler.post('/api/documents/')
      .set('Accept', 'application/json')
      .set('authorization', admin_token)
      .send({
        title: 'My document',
        content: 'This is a cool document'
      })
      .expect(201)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Document created successfully');
        document_created = res.body.data;
        done();
      });
  });

  it('should ensure document has property set to public by default', ()=>{
    expect(document_created.access).to.be.equal('public');
  });

  it('should ensure only the creator can access private document', (done)=>{
    requestHandler.post('/api/users/login')
      .accept('Accept', 'application/json')
      .send({
        email: 'mike@mail.com',
        password: 'mike'
      })
      .expect(200)
      .end((err, res)=>{
        let token = res.body.data.token;
        requestHandler.get('/api/documents/3')
          .set('authorization', token)
          .expect(403)
          .end((err, res)=>{
            expect(res.body.status).to.be.equal('fail');
            expect(res.body.message).to.be.equal('You do not have permissions to view this document');

            requestHandler.get('/api/documents/4')
              .set('authorization', token)
              .expect(200)
              .end((err, res)=>{
                expect(res.body.status).to.be.equal('success');
                expect(res.body.message).to.be.equal('Document info loaded');
                done();
              });
          });
      });
  });

  it('should ensure document created has published date defined', ()=>{
    expect(typeof document_created.createdAt).to.not.be.undefined;
  });

  it('should get all documents', (done)=>{
    requestHandler.get('/api/documents')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        done();
      });
  });


  it('should get limited documents', (done)=>{
    requestHandler.get('/api/documents?limit=2')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(2);
        done();
      });
  });

  it('should ensure documents are arranged in order of published date', (done)=>{
    requestHandler.get('/api/documents')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data[0].createdAt).to.be.above(res.body.data[1].createdAt);
        done();
      });
  });


  it('should be able to set offset and limit', (done)=>{
    requestHandler.get('/api/documents?limit=1&offset=3')
      .set('authorization', admin_token)
      .expect(200)
      .end((err, res)=>{
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(1);
        expect(res.body.data[0].id).to.be.equal(3);
        done();
      });
  });

});
