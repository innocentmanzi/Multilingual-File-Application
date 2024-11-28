const { fileQueue } = require('../src/config/redis');

describe('Redis Queue', () => {
  it('should add a task to the queue', async () => {
    const job = await fileQueue.add({ fileName: 'testfile.txt', userId: '12345' });
    expect(job.id).toBeDefined();
  });

  it('should process a task from the queue', async () => {
    const mockProcessor = jest.fn();
    fileQueue.process(mockProcessor);

    await fileQueue.add({ fileName: 'anotherfile.txt', userId: '12345' });

    // Wait for the job to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(mockProcessor).toHaveBeenCalledTimes(1);
  });
});
