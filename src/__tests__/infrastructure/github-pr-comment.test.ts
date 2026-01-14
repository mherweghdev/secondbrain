/**
 * Unit tests for github-pr-comment.js
 * 
 * Related to CR-MED-4: Validate PR comment feature
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const prCommentScript = require('../../../scripts/github-pr-comment.js');
/* eslint-enable @typescript-eslint/no-require-imports */

interface MockContext {
    issue: { number: number };
    repo: { owner: string; repo: string };
    runId: string;
    payload: {
        repository: { html_url: string };
    };
}

describe('GitHub PR Comment Script', () => {
    let mockGithub: { rest: { issues: { createComment: jest.Mock } } };
    let mockContext: MockContext;
    let mockFs: { existsSync: jest.Mock; readFileSync: jest.Mock };

    beforeEach(() => {
        // Reset mocks
        mockGithub = {
            rest: {
                issues: {
                    createComment: jest.fn().mockResolvedValue({})
                }
            }
        };

        mockContext = {
            issue: { number: 123 },
            repo: { owner: 'test-owner', repo: 'test-repo' },
            runId: '456',
            payload: {
                repository: { html_url: 'https://github.com/test-owner/test-repo' }
            }
        };

        mockFs = {
            existsSync: jest.fn(),
            readFileSync: jest.fn()
        };
    });

    it('should create a comment with coverage data when coverage file exists', async () => {
        // Mock coverage file existence and content
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue(JSON.stringify({
            total: {
                lines: { pct: 80 },
                branches: { pct: 70 },
                functions: { pct: 90 },
                statements: { pct: 85 }
            }
        }));

        await prCommentScript({ github: mockGithub, context: mockContext, fs: mockFs });

        // Verify comment created
        expect(mockGithub.rest.issues.createComment).toHaveBeenCalledTimes(1);
        const callArg = mockGithub.rest.issues.createComment.mock.calls[0][0];

        expect(callArg.issue_number).toBe(123);
        expect(callArg.owner).toBe('test-owner');
        expect(callArg.body).toContain('📊 **Rapport de Couverture**');
        expect(callArg.body).toContain('Lignes: 80%');
        expect(callArg.body).toContain('✅ **Résultats Pipeline CI/CD**');
    });

    it('should create a comment without coverage data when coverage file is missing', async () => {
        // Mock coverage file missing
        mockFs.existsSync.mockReturnValue(false);

        await prCommentScript({ github: mockGithub, context: mockContext, fs: mockFs });

        // Verify comment created
        expect(mockGithub.rest.issues.createComment).toHaveBeenCalledTimes(1);
        const callArg = mockGithub.rest.issues.createComment.mock.calls[0][0];

        expect(callArg.body).toContain('⚠️ Pas de rapport de couverture trouvé');
        expect(callArg.body).not.toContain('📊 **Rapport de Couverture**');
    });

    it('should throw error if GitHub API fails', async () => {
        mockFs.existsSync.mockReturnValue(false);
        mockGithub.rest.issues.createComment.mockRejectedValue(new Error('API Error'));

        await expect(prCommentScript({ github: mockGithub, context: mockContext, fs: mockFs }))
            .rejects.toThrow('API Error');
    });
});
