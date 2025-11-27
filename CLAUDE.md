# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site repository for AutomationREX, hosted on GitHub Pages (AutomationREX.github.io).

## Prerequisites

Hugo static site generator must be installed. Install via:
- macOS: `brew install hugo`
- Linux: `sudo apt-get install hugo`
- Windows: `choco install hugo-extended`

## Development Commands

### Development Server
```bash
hugo server -D
```
Starts the development server with draft content enabled. Available as VSCode task "Serve Drafts" (default test task).

### Build
```bash
hugo
```
Builds the static site to the `public/` directory. Available as VSCode task "Build" (default build task).

### Common Hugo Commands
```bash
hugo new posts/my-post.md          # Create a new post
hugo new site                       # Initialize new Hugo site (if needed)
hugo --buildDrafts                  # Build including drafts
hugo --minify                       # Build with minified output
```

## Project Structure

This is a standard Hugo site structure:
- `content/` - Markdown content files
- `themes/` - Hugo themes
- `static/` - Static assets (images, CSS, JS)
- `layouts/` - Custom HTML templates
- `config.toml` or `config.yaml` - Site configuration
- `public/` - Generated static site (git-ignored)

## GitHub Pages Deployment

This repository is configured for GitHub Pages deployment at AutomationREX.github.io. The built site should be pushed to the appropriate branch (typically `main` or `gh-pages`) depending on GitHub Pages configuration.
