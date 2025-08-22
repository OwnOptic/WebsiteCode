# Website Style Guide

This document outlines the comprehensive style guide, including color palettes, typography, components, and assets used across the website.

## Color Palette

| Usage                   | Color Name              | Hex Code  |
| ----------------------- | ----------------------- | --------- |
| Primary Background      | White                   | `#FFFFFF` |
| Surface Background      | Light Gray              | `#F4F5F7` |
| Primary Text/Headings   | Almost Black            | `#171A1C` |
| Secondary Text          | Gray                    | `#5E6C76` |
| Interactive Elements    | Interactive Blue        | `#0052CC` |
| Interactive Hover       | Interactive Blue Hover  | `#0041A3` |
| Footer Background       | Dark Blue-Grey          | `#2c3e50` |
| Footer Text             | White                   | `#FFFFFF` |
| Footer Copyright        | Lighter Grey            | `#bdc3c7` |

## Typography

**Primary Font:** Inter

| Element                   | Weight          | Size       | Line Height |
| ------------------------- | --------------- | ---------- | ----------- |
| `<h1>` (Main Page Title)  | Bold (700)      | `3.052rem` | `1.1`       |
| `<h2>` (Section Titles)   | Bold (700)      | `2.441rem` | `1.2`       |
| `<h3>` (Job Titles)       | Semi-bold (600) | `1.953rem` | `1.3`       |
| `<h4>` (Card Titles)      | Semi-bold (600) | `1.563rem` | `1.4`       |
| `<p>`, `<li>`               | Regular (400)   | `1rem`     | `1.5 - 1.7` |
| `.p-lead` (Lead Paragraph)| Regular (400)   | `1.25rem`  | `1.6`       |
| Header Navigation Links   | Semi-bold (600) | `0.875rem` | -           |
| Footer Name               | Bold (700)      | `1.8em`    | -           |
| Footer Copyright          | Regular (400)   | `0.8em`    | -           |

## Components

### Buttons

**Base Style**
- **Font:** Header Navigation Links style (Semi-bold, 0.875rem)
- **Padding:** 12px 24px
- **Border-radius:** 4px
- **Transition:** background-color 0.2s ease-in-out, color 0.2s ease-in-out

**Primary Button**
- **Background:** `var(--interactive-blue)`
- **Text Color:** `var(--white)`
- **Border:** None
- **Hover State:** Background changes to `var(--interactive-blue-hover)`

**Secondary Button**
- **Background:** `var(--primary-background)`
- **Text Color:** `var(--interactive-blue)`
- **Border:** 1px solid `var(--interactive-blue)`
- **Hover State:** Background changes to `var(--surface-background)`

### Card

- **Background:** `var(--surface-background)`
- **Padding:** 24px
- **Border-radius:** 8px
- **Box-shadow:** `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **Structure:**
  - Image placeholder at the top
  - `<h4>` for the project title

### Footer

- **Container (`.custom-footer`)**
  - **Background:** `#2c3e50` (Dark Blue-Grey)
  - **Text Color:** `#FFFFFF` (White)
  - **Padding:** 25px 50px
- **Name (`.footer-name`)**
  - **Font Size:** 1.8em
  - **Font Weight:** bold
- **Copyright (`.footer-copyright`)**
  - **Font Size:** 0.8em
  - **Color:** `#bdc3c7` (Lighter Grey)
- **Logo (`.footer-logo`)**
  - **Height:** 45px
  - **Hover State:** `transform: scale(1.1)`

## Asset Library

### Logos

| Name                      | URL                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Microsoft Power Automate  | `https://upload.wikimedia.org/wikipedia/commons/4/4d/Microsoft_Power_Automate.svg`                         |
| K2 Software               | `https://media.trustradius.com/product-logos/rh/K2/PHZJJTUZ5CSO-180x180.PNG`                                |
| Witivio                   | `https://www.salon-intranet.com/logo/7efb633c8de1d45logo-hd_witivio.png`                                      |
| LinkedIn                  | `https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png` |
