# Deployment Workflow

## How it Works

### Automatic Production Deployment

- **Master branch** → Automatically deploys to production
- URL: https://calm-sand-038387710.6.azurestaticapps.net/

### Development Workflow

1. **Create a feature branch** for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them:

   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. **Push your feature branch** to GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub:
   - Go to your repository on GitHub
   - Click "Pull requests" → "New pull request"
   - Select your feature branch to merge into `master`
   - This creates a **preview deployment** for testing

5. **Merge to master** when ready:
   - Once PR is approved/tested, merge it
   - This automatically triggers production deployment
   - Your changes go live in 2-3 minutes

## Quick Commands

### Start new feature:

```bash
git checkout master
git pull
git checkout -b feature/my-new-feature
```

### Finish and deploy:

```bash
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature
# Then create PR on GitHub and merge to master
```

### Direct push to production (use carefully):

```bash
git checkout master
git add .
git commit -m "Urgent fix"
git push
```

## Branch Protection (Recommended)

Consider protecting the master branch:

1. Go to GitHub repo → Settings → Branches
2. Add rule for `master`
3. Require pull request reviews before merging
4. This prevents accidental direct pushes to production
