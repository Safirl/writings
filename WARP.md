# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an interactive 3D portfolio website built with Astro, React, Three.js, and custom GLSL shaders. The project creates an immersive 3D environment where users can explore floating interactive cards around a central planet, each representing different writing projects. The site features complex 3D animations, particle systems, custom materials, and seamless transitions between views.

## Development Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |

### Development workflow
- Use `npm run dev` for development with hot reload
- Access the site at `http://localhost:4321`
- Changes to React components, shaders, and styles update automatically

## Architecture Overview

### Core Structure
- **Astro Framework**: Static site generator with React integration
- **React Three Fiber**: React renderer for Three.js
- **GSAP**: Animation library for smooth transitions and interactions
- **Custom Shaders**: GLSL materials for visual effects (dissolve, liquid)
- **SCSS Modules**: Scoped styling with Sass

### Key Components Hierarchy

```
Main.tsx (Root component)
├── Welcome.tsx (Entry screen)
├── SceneCanvas.tsx (3D scene container)
│   ├── Environment.tsx (Lighting, effects, particles)
│   │   ├── OrbitControls
│   │   ├── FloatingRocksParticles
│   │   ├── DustParticles
│   │   ├── WaterPlane
│   │   └── PostProcessing (Bloom, Vignette)
│   ├── Planet.tsx (Central 3D object)
│   ├── InteractiveCard.tsx (Project cards)
│   └── CameraManager.tsx (Camera animations)
└── Project.tsx (Content overlay)
```

### Data Flow
- **projects.js**: Central data store for all project content and positioning
- **State Management**: React useState for UI state, Three.js refs for 3D objects
- **Animation Timing**: Centralized `transitionTimers` object controls all animation durations
- **Camera Control**: Complex camera animations using GSAP with Three.js camera positions

### Custom Materials System
- **DissolveMaterial.ts**: Shader for card reveal animations using noise textures
- **LiquidMaterial.ts**: Animated shader for dynamic backgrounds
- **Texture Management**: Async loading with error handling and memory cleanup

### 3D Scene Architecture
- **Spherical Positioning**: Cards positioned using theta/phi coordinates around central planet
- **Interactive System**: Hover states, click handlers, and camera transitions
- **Particle Systems**: Multiple particle emitters for atmospheric effects
- **Post-Processing**: Bloom, vignette, and fog effects

## Key Technical Patterns

### Animation Orchestration
All animations use a centralized timer system in `Main.tsx`. When modifying transition timings, update the `transitionTimers` array to maintain consistency across components.

### 3D Interaction Flow
1. Card hover triggers GSAP animation (radius increase)
2. Click initiates camera movement toward card
3. Background vignette animates in
4. Project content overlays after delay
5. Back button reverses all animations

### Asset Loading Strategy
- Textures loaded asynchronously with Promise-based error handling
- Canvas-based texture generation for dynamic project cards
- Memory cleanup on component unmount to prevent leaks

### State Management Pattern
- UI state in React (Welcome screen, current project)
- 3D state in Three.js refs and GSAP animations
- Bridge between systems via callback props and useFrame hooks

## Development Guidelines

### When Working with 3D Components
- Always check for null refs before accessing Three.js objects
- Use `useFrame` for animation loops, `useGSAP` for discrete animations  
- Dispose of geometries and materials on unmount to prevent memory leaks
- Test hover/click interactions across different screen sizes

### Shader Development
- Custom materials are in `/src/components/` directory
- Follow the pattern: vertex shader → fragment shader → shaderMaterial → extend
- Test shader compilation by checking browser console for WebGL errors

### Animation Timing
- All durations defined in `transitionTimers` array (in milliseconds)
- Use GSAP's contextSafe for event handlers to prevent memory leaks
- Test animations at different speeds by adjusting timer values

### Project Content Management
- Add new projects to `src/data/projects.js`
- Include theta/phi positioning for card placement around sphere
- Images go in `public/projectImages/` directory
- Content supports basic HTML structure (h1, p tags with line breaks)

## File Structure Notes

### Critical Directories
- `src/components/three/`: All 3D-related React components
- `src/components/`: UI components and custom materials
- `src/data/`: Static data (projects configuration)
- `src/styles/`: SCSS modules and global styles
- `public/textures/`: Image assets for 3D materials
- `public/3D/`: 3D model files
- `public/fonts/`: Custom font files (Junicode)

### Debug System
- `debugUI.ts` provides lil-gui integration for development
- Uncomment `<StatsGl />` in SceneCanvas for performance monitoring
- GUI controls available for camera, lighting, and material parameters

## Performance Considerations

- Scene uses frustum culling and LOD where appropriate
- Particle systems optimized with instanced rendering
- Texture compression and appropriate sizing for web delivery
- Post-processing effects can be adjusted for performance vs quality balance

## Browser Compatibility

Requires WebGL2 support for custom shaders and post-processing effects. The experience gracefully handles texture loading failures but requires modern browsers for full functionality.