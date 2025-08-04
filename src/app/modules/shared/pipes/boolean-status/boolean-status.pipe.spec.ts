import { BooleanStatusPipe } from './boolean-status.pipe';

describe('BooleanStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new BooleanStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
