# Deployment Guide

## Option 1 - GitHub Pages

1. Create a public repository named:

```text
anuradha-dolamulla-portfolio
```

2. Push these files to the repository root.

3. Go to:

```text
Settings -> Pages
```

4. Select:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

5. Save and wait for GitHub Pages to publish.

## Option 2 - Netlify

1. Go to Netlify.
2. Add new site from GitHub.
3. Select the portfolio repository.
4. Build command: leave empty.
5. Publish directory: `/`.
6. Deploy.

## Option 3 - Vercel

1. Import the GitHub repository in Vercel.
2. Framework preset: Other.
3. Build command: leave empty.
4. Output directory: `/`.
5. Deploy.

## Important notes

- Keep PDF filenames stable after publishing. Project buttons point to files inside `assets/docs/`.
- Large PDF files can make the repository heavy. If GitHub rejects a push because of file size, compress the PDFs or store them in GitHub Releases and update the links.
- Do not add private documents, `.env` files, passwords, API keys or database credentials.
