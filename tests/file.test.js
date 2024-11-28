const request = require('supertest');
const app = require('../app');
const File = require('../src/models/File');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('File Management', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Create a test user and generate a token
    const user = await User.create({
      username: 'filetestuser',
      email: 'filetest@example.com',
      password: 'password123',
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  });

  afterAll(async () => {
    await User.deleteMany();
    await File.deleteMany();
  });

  it('should upload a file', async () => {
    const response = await request(app)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('Test File Content'), 'testfile.txt');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'testfile.txt');
  });

  it('should list files for the user', async () => {
    const response = await request(app)
      .get('/api/files')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should delete a file', async () => {
    const file = await File.create({
      name: 'testfile.txt',
      path: 'uploads/testfile.txt',
      size: 1234,
      user: userId,
    });

    const response = await request(app)
      .delete(`/api/files/${file.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'File deleted successfully');
  });
});
