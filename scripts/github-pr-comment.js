/**
 * Script to comment coverage results on PR
 * Used by GitHub Actions workflow
 */

module.exports = async ({ github, context, fs }) => {
    const coveragePath = 'coverage/coverage-summary.json';
    let coverageMessage = '';

    try {
        if (fs.existsSync(coveragePath)) {
            const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
            const { lines, branches, functions, statements } = coverage.total;

            coverageMessage = `
      📊 **Rapport de Couverture**
      - Lignes: ${lines.pct}%
      - Branches: ${branches.pct}%
      - Fonctions: ${functions.pct}%
      - Instructions: ${statements.pct}%
      `;
        } else {
            coverageMessage = '\n⚠️ Pas de rapport de couverture trouvé.';
        }

        const body = `✅ **Résultats Pipeline CI/CD**

    Toutes les vérifications sont terminées ! ${coverageMessage}

    📦 [Rapport détaillé disponible dans les artefacts](${context.payload.repository.html_url}/actions/runs/${context.runId})
    `;

        // Create comment
        await github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: body
        });

        console.log('Comment created successfully');
        return body; // Return body for testing
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};
