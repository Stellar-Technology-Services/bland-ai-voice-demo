# Static Assets

This directory contains static files that are served directly by the web server without processing.

## File Structure

```
static/
├── favicon.svg          # Site favicon (scalable)
├── robots.txt           # Search engine crawler instructions
├── llms.txt            # LLM context and understanding file
├── openai.png          # OpenAI logo for technology showcase
├── bland.png           # Bland AI logo for technology showcase
└── stellar-symbol.svg  # Stellar Technology Services logo
```

## Asset Categories

### Branding & Logos
- **stellar-symbol.svg**: Company branding symbol
- **openai.png**: OpenAI service logo (4.3KB)
- **bland.png**: Bland AI service logo (111KB)

### Site Configuration
- **favicon.svg**: Scalable vector favicon for all devices
- **robots.txt**: Search engine optimization and crawler management
- **llms.txt**: AI context file for LLM understanding and indexing

## SEO & AI Optimization

### robots.txt Configuration
```txt
User-agent: *
Allow: /
Allow: /demo

# Disallow API endpoints to reduce server load
Disallow: /api/

# Allow crawling of static assets
Allow: /favicon.svg
Allow: /*.png
Allow: /*.svg
Allow: /*.ico

# Standard crawl delay for politeness
Crawl-delay: 1
```

### llms.txt for AI Understanding
Comprehensive context file that provides:
- Complete project overview and architecture
- Technical implementation details
- API endpoint documentation
- Business applications and use cases
- Integration instructions and examples

## Asset Optimization

### Image Formats
- **SVG**: Used for logos and icons (scalable, small file size)
- **PNG**: Used for complex logos with transparency
- **Optimized**: All images are compressed for web delivery

### Performance Considerations
- **Favicon**: SVG format for crisp display at any size
- **Logo Sizes**: Optimized for both retina and standard displays
- **Compression**: Images compressed without quality loss

## URL Mapping

Static files are served at the root URL:

| File | URL | Purpose |
|------|-----|---------|
| `favicon.svg` | `/favicon.svg` | Browser tab icon |
| `robots.txt` | `/robots.txt` | SEO crawler instructions |
| `llms.txt` | `/llms.txt` | AI context and understanding |
| `openai.png` | `/openai.png` | Technology stack display |
| `bland.png` | `/bland.png` | Technology stack display |
| `stellar-symbol.svg` | `/stellar-symbol.svg` | Company branding |

## Usage in Components

### Logo Integration
```svelte
<!-- Technology stack component -->
<img 
  src="/openai.png" 
  alt="OpenAI" 
  class="h-8 w-auto"
  loading="lazy"
/>

<img 
  src="/bland.png" 
  alt="Bland AI" 
  class="h-8 w-auto"
  loading="lazy"
/>
```

### Favicon Reference
```html
<!-- In app.html -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

## Asset Guidelines

### Adding New Assets
1. **Optimization**: Compress images using appropriate tools
2. **Naming**: Use descriptive, lowercase names with hyphens
3. **Format**: Choose the most appropriate format (SVG > PNG > JPG)
4. **Size**: Keep file sizes minimal for performance
5. **Alt Text**: Always provide meaningful alt text for images

### Logo Usage
1. **Brand Guidelines**: Follow official brand guidelines for logos
2. **Attribution**: Respect trademark and usage rights
3. **Quality**: Use high-resolution versions for crisp display
4. **Context**: Use logos appropriately in technology showcases

## Development Notes

- Static files bypass SvelteKit processing and are served directly
- Changes to static files may require browser cache clearing
- Static files are deployed with the application automatically
- All static assets are included in the production build 