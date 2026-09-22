// Unit tests for generate-milestones.js's handler (FR06, FR08)
// Arrange, Act, Assert - external services are mocked

process.env.JWT_SECRET = 'test-only-key-do-not-use-in-prod';

// Explicit mock factories - avoids loading the real files
jest.mock('../infrastructure/DatabaseRepository.js', () => ({ DatabaseRepository: jest.fn() }));
jest.mock('../infrastructure/ClaudeProvider.js', () => ({ ClaudeProvider: jest.fn() }));
jest.mock('../application/llm/PlanningService.js', () => ({ PlanningService: jest.fn() }));

const { DatabaseRepository } = require('../infrastructure/DatabaseRepository.js');
const { PlanningService } = require('../application/llm/PlanningService.js');
const { sign, SESSION_COOKIE_NAME } = require('../infrastructure/sessionToken.js');
const { handler } = require('../generate-milestones.js');

const token = sign('a@b.com');


// Token travels as a cookie now, not the body
function makeEvent(body, { authenticated = true } = {}) {
  return {
    httpMethod: 'POST',
    headers: authenticated ? { cookie: `${SESSION_COOKIE_NAME}=${token}` } : {},
    body: JSON.stringify(body)
  };
}


// Shared mock instances
const databaseMock = {
  findOrCreateUserByEmail: jest.fn(),
  findConversationSession: jest.fn()
};

const planningMock = {
  complete: jest.fn()
};


beforeEach(() => {
  // Reset mocks so values from one test cannot leak into another
  jest.resetAllMocks();

  DatabaseRepository.mockImplementation(() => databaseMock);
  PlanningService.mockImplementation(() => planningMock);

  databaseMock.findOrCreateUserByEmail.mockResolvedValue({ id: 'user-1' });
});


test('should return 401 when the request has no valid session token', async () => {
  // ACT
  const response = await handler(makeEvent({}, { authenticated: false }));

  // ASSERT
  expect(response.statusCode).toBe(401);
});


test('should return 400 when sessionId is missing from the request', async () => {
  // ACT
  const response = await handler(makeEvent({}));

  // ASSERT
  expect(response.statusCode).toBe(400);
});


test('should return 400 when there is no conversation yet to build a goal from', async () => {
  // ARRANGE
  databaseMock.findConversationSession.mockResolvedValue(null);

  // ACT
  const response = await handler(makeEvent({ sessionId: 's1' }));
  const body = JSON.parse(response.body);

  // ASSERT
  expect(response.statusCode).toBe(400);
  expect(body.error).toMatch(/goal/i);
});


test('should return 200 with a goal and milestones when the whole pipeline succeeds', async () => {
  // ARRANGE
  const goal = JSON.stringify({
    title: 'Run a marathon',
    description: '',
    targetDate: ''
  });

  const milestones = JSON.stringify([
    { title: 'Build a running base', description: '' }
  ]);

  databaseMock.findConversationSession.mockResolvedValue({
    conversation_history: [
      { role: 'user', content: 'I want to run a marathon' }
    ]
  });

  planningMock.complete.mockResolvedValueOnce(goal);
  planningMock.complete.mockResolvedValueOnce(milestones);

  // ACT
  const response = await handler(makeEvent({ sessionId: 's1' }));
  const body = JSON.parse(response.body);

  // ASSERT
  expect(response.statusCode).toBe(200);
  expect(body.goal.title).toBe('Run a marathon');
  expect(body.milestones).toHaveLength(1);
  expect(body.milestones[0].title).toBe('Build a running base');
});


test('should return 502 when the model returns an empty milestone list', async () => {
  // ARRANGE
  const goal = JSON.stringify({
    title: 'Run a marathon',
    description: '',
    targetDate: ''
  });

  databaseMock.findConversationSession.mockResolvedValue({
    conversation_history: [
      { role: 'user', content: 'I want to run a marathon' }
    ]
  });

  planningMock.complete.mockResolvedValueOnce(goal);
  planningMock.complete.mockResolvedValueOnce(JSON.stringify([]));

  // ACT
  const response = await handler(makeEvent({ sessionId: 's1' }));

  // ASSERT
  expect(response.statusCode).toBe(502);
});
