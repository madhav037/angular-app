import { CustomPipe } from './customPipe';

describe('dashPipe', () => {
  let pipe: CustomPipe;

  beforeEach(() => {
    pipe = new CustomPipe();
  });

  it('should add dashes between words', () => {
    const result = pipe.transform('Hello World');
    expect(result).toBe('Hello-World');
  });

  it('should return the same string if there are no spaces', () => {
    const result = pipe.transform('HelloWorld');
    expect(result).toBe('HelloWorld');
  });

  it('should handle empty strings', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });
});
