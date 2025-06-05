import { describe, it, expect } from 'vitest';
import { modificationsRegex } from './diff';

// Utility function mirroring the sanitize logic used in UserMessage.tsx
function sanitize(content: string) {
  return content.replace(modificationsRegex, '');
}

describe('modificationsRegex', () => {
  it('removes modification block even when not at start', () => {
    const input = [
      '[Model: test]\n\n',
      '[Provider: foo]\n\n',
      '<bolt_file_modifications><diff path="/foo">hi</diff></bolt_file_modifications>\n\n',
      'User message',
    ].join('');

    const output = sanitize(input);

    expect(output).not.toContain('bolt_file_modifications');
    expect(output.trim().endsWith('User message')).toBe(true);
  });
});
