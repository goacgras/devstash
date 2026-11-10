# Complete Action

1. Stage all changes and commit with a descriptive message
2. Switch to main and merge the feature branch (no push yet)
3. Delete the local feature branch
4. Reset current-feature.md:
   - Change H1 back to `# Current Feature`
   - Reset Status to the placeholder comment `<!-- Not Started | In Progress | Completed -->` (do not leave "Completed" as plain text)
   - Clear Goals and Notes sections back to their placeholder comments (`<!-- Goals and requirements -->`, `<!-- Any extra notes -->`)
   - Add feature summary to the END of History
5. Commit the reset: `chore: reset current-feature.md after completing [feature]`
6. Push main to origin ONCE (single push with all changes)
7. If feature branch was previously pushed, delete it from origin