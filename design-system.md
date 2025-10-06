# Design System Documentation

## Business Information
- **Name**: Financial Tracker
- **Type**: Finance Management SaaS
- **Style**: Professional fintech with engaging animations and AI-powered insights

## Unique Color Palette
### Light Mode
- **Primary**: hsl(243 75% 59%)
- **Secondary**: hsl(217 91% 60%)
- **Accent**: hsl(271 81% 56%)
- **Background**: hsl(0 0% 100%)
- **Foreground**: hsl(222 47% 11%)
- **Muted**: hsl(220 14% 96%)
- **Card**: hsl(0 0% 100%)
- **Border**: hsl(220 13% 91%)

### Dark Mode
- **Primary**: hsl(243 75% 59%)
- **Secondary**: hsl(217 91% 60%)
- **Accent**: hsl(271 81% 56%)
- **Background**: hsl(222 47% 11%)
- **Foreground**: hsl(210 40% 98%)

## Typography
- **Headings**: Plus Jakarta Sans
- **Body Text**: Inter
- **Monospace**: JetBrains Mono

## Design Tokens
- **Border Radius**: 0.75rem
- **Spacing Base**: 1rem
- **Spacing Scale**: 1.5x

## Shadows
- **Small**: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **Medium**: 0 4px 6px -1px rgb(79 70 229 / 0.1), 0 2px 4px -2px rgb(79 70 229 / 0.08)
- **Large**: 0 20px 25px -5px rgb(79 70 229 / 0.12), 0 8px 10px -6px rgb(79 70 229 / 0.08)

## Usage Guidelines
- Each design is uniquely crafted for this specific business
- Colors are carefully selected for accessibility and brand alignment
- Typography choices reflect the business personality
- All tokens work together to create a cohesive design system

## Implementation
- Use Tailwind classes with the custom color variables
- The system supports automatic dark mode switching
- All colors use HSL format for easy customization
- Fonts are loaded from Google Fonts automatically
