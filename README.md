Tailored README.md section for your **[https://github.com/winstonjthinker/cupcake-magic-garden.git](https://github.com/winstonjthinker/cupcake-magic-garden.git)** project, with the actual repo and config details filled in:



# 🚀 Getting Started

## Cloning a Specific Branch from This Repository

You have two options to clone a specific branch:

### **Option 1: Clone the Whole Repository and Switch Branch**

```bash
git clone https://github.com/winstonjthinker/cupcake-magic-garden.git
cd cupcake-magic-garden
git fetch --all            # optional, ensures all branches are available
git checkout branch-name   # replace 'branch-name' with the branch you want
```

### **Option 2: Clone Only a Single Branch**

```bash
git clone --branch branch-name --single-branch https://github.com/winstonjthinker/cupcake-magic-garden.git
# replace 'branch-name' with the branch you want
```

#### **Verify Your Current Branch**

```bash
git branch
```
> The branch name with an asterisk `*` is your current branch.

**Tip:**  
Option 1 is best if you plan to switch branches. Option 2 is great for focused contributions with a smaller download size.

***

## Using Your Preferred IDE

You can work locally with your editor of choice. Pushed changes will reflect in Lovable as well.

**Requirements:**  
- Node.js and npm  
  [Install with nvm (recommended)](https://github.com/nvm-sh/nvm#installing-and-updating)

**Steps:**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/winstonjthinker/cupcake-magic-garden.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd cupcake-magic-garden
   ```
3. **Install dependencies:**
   ```bash
   npm i
   ```
4. **Start the development server with hot-reloading:**
   ```bash
   npm run dev
   ```

***

## Editing Files Directly on GitHub

1. Navigate to the desired file in your repo (e.g., [cupcake-magic-garden](https://github.com/winstonjthinker/cupcake-magic-garden)).
2. Click the **Edit** button (pencil icon) at the top right.
3. Make your changes and commit directly from the GitHub interface.

***

## Using GitHub Codespaces

1. Go to the main page of your repository ([cupcake-magic-garden](https://github.com/winstonjthinker/cupcake-magic-garden)).
2. Click the **Code** button (green).
3. Select the **Codespaces** tab.
4. Click **New codespace** to launch an instant cloud development environment.
5. Edit and commit/push your changes from inside Codespaces.

***

## What Technologies Are Used For This Project?

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

***

## How Can I Deploy This Project?


- Click on **Share → Publish**.

***

## I Want to Use a Custom Domain—Is That Possible?


***
**README.md section** showing both the GitHub UI and Git command-line methods for merging your `tavonga` branch into `main`:

***

## 🔀 Merging the `tavonga` Branch into `main`

### **If you have changes on your `tavonga` branch that you want to apply to the `main` branch, you can do this either using GitHub’s UI (pull request) or via command-line.**

***

### **Method 1: GitHub UI (Recommended for Collaboration)**

1. **Push Your Local Changes** (if not already pushed):
    ```bash
    git add .
    git commit -m "Description of your changes"
    git push origin tavonga
    ```
2. **Create a Pull Request (PR) on GitHub**:
    - Go to your repo: [https://github.com/winstonjthinker/cupcake-magic-garden](https://github.com/winstonjthinker/cupcake-magic-garden)
    - On the homepage, you may see a "Compare & pull request" button — click it.
    - If not, go to the **Pull requests** tab and click **New pull request**.
    - Set the **base** branch to `main` and **compare** branch to `tavonga`.
    - Add a title and description for your PR, and click **Create pull request**.

3. **Review & Merge the Pull Request**:
    - Collaborators can comment or review.
    - Once ready, click **Merge pull request** (choose standard "Merge," "Squash and merge," or "Rebase and merge" as needed).
    - Changes from `tavonga` are now in `main`.

***

### **Method 2: Command-Line Git Merge**

1. **Ensure all changes on the branch are committed and pushed.**
2. **Switch to the main branch**:
    ```bash
    git checkout main
    ```
3. **Pull the latest changes from remote**:
    ```bash
    git pull origin main
    ```
4. **Merge the tavonga branch**:
    ```bash
    git merge tavonga
    ```
5. **Push the merged changes to GitHub**:
    ```bash
    git push origin main
    ```

***

### **Summary Table**

| Action                   | What It’s Called                |
|--------------------------|----------------------------------|
| Apply `tavonga` to `main`| Pull request (UI) or Git merge   |

***

**Note:**  

**Tip:**  
Pull requests in the UI are best for teams, discussion, and audit history. Direct merging with Git is useful for fast local work or smaller teams.

***

Replace branch names with those relevant to your workflow.
**Happy Coding! 🚀**
