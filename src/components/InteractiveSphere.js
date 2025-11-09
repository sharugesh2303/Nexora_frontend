import React, { useRef, useMemo } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Shader Material Definition ---
const PointShaderMaterial = shaderMaterial(
    { 
        time: 0, 
        mousePos: new THREE.Vector3(0, 0, 0),
        progress: 0,
        pointSize: 4.0, // Base point size
        // Define colors explicitly
        colorA: new THREE.Color(0xFFFFFF), // Bright white core/points
        colorB: new THREE.Color(0x00E0B3), // Neon teal/green glow
    },
    // Vertex Shader
    `
        uniform float time;
        uniform vec3 mousePos;
        uniform float progress;
        uniform float pointSize;

        attribute float initialTime;
        attribute vec3 center;
        attribute float radius; 

        varying float vColorProgress;
        varying float vAlpha;
        varying float vRadius;

        void main() {
            vec3 displacement = position - center;
            float dist = length(displacement);
            
            // Interaction: Mouse proximity pushes particles away
            float distToMouse = length(position - mousePos);
            float interactionFactor = 1.0 - clamp(distToMouse / 5.0, 0.0, 1.0); 

            vec3 newPosition = position;
            
            // Pulsing Bloom/Explosion Effect
            // Use radius to influence displacement, creating rings
            float bloomFactor = sin(time * 0.5) * 0.5 + 0.5; // Pulsing from 0.5 to 1.0
            newPosition += normalize(displacement) * (progress * 15.0 * radius) * bloomFactor;
            
            // Mouse Pushback
            vec3 pushDirection = normalize(position - mousePos);
            newPosition += pushDirection * interactionFactor * 5.0; // Less aggressive push
            
            // Chaotic Noise
            float chaos = sin(initialTime * 0.5 + time * 5.0) * 0.005; 
            newPosition += pushDirection * chaos;

            vec4 viewPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
            
            vRadius = radius;
            vColorProgress = clamp(dist / 50.0 + progress * 2.0, 0.0, 1.0);
            vAlpha = 1.0 - clamp(interactionFactor * 1.5, 0.0, 1.0);
            
            // Adjust point size based on radius to get large spheres vs small points
            // Larger points (representing spheres) maintain their size better
            gl_PointSize = (pointSize * 4.0 * radius) / -viewPosition.z;
            
            gl_Position = projectionMatrix * viewPosition;
        }
    `,
    // Fragment Shader
    `
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;
        
        varying float vColorProgress;
        varying float vAlpha;
        varying float vRadius;

        void main() {
            // Get distance from center of the point fragment
            float r = 0.0;
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            r = dot(cxy, cxy); 

            // 1. DUAL COLOR: Blend between white core and teal glow
            vec3 finalColor = mix(colorA, colorB, vColorProgress);
            
            // 2. RING/DOT EFFECT: Determine alpha based on point center distance (r)
            float alpha = 1.0 - smoothstep(0.7, 1.0, r); // Fade out towards point edge

            // 3. APPLY GLOW/PULSE: Subtle pulsation on the color
            float pulse = sin(time * 3.0) * 0.1 + 0.9;
            finalColor *= pulse;
            
            // 4. MASKING/RING: If the point is large (high radius), make it an opaque/solid disc.
            // If the point is small (low radius), let it be a sharp dot.
            if (vRadius < 0.6) {
                // Small dot/point (high-contrast white)
                finalColor = colorA;
                gl_FragColor = vec4(finalColor, alpha);
            } else {
                // Large sphere/ring (blend color)
                gl_FragColor = vec4(finalColor, alpha * 0.8);
            }

            // Discard fragments outside the circle for sphere appearance
            if (r > 1.0) {
                discard;
            }
        }
    `
);
extend({ PointShaderMaterial });

// --- Interactive Sphere Component (R3F) ---
const InteractiveSphere = () => {
    const meshRef = useRef();
    const materialRef = useRef();
    const startTime = useRef(Date.now());
    const count = 10000; 
    const sphereRadius = 5;

    // --- Particle data generation ---
    const [positions, initialTimes, centers, radii] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const initialTimes = new Float32Array(count);
        const centers = new Float32Array(count * 3);
        const radii = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Distribute particles in a slightly thicker shell (1.0 to 1.2 radius)
            const position = new THREE.Vector3().setFromSphericalCoords(
                sphereRadius * (1 + Math.random() * 0.2), 
                Math.acos(Math.random() * 2 - 1), 
                Math.random() * Math.PI * 2
            );
            
            positions.set(position.toArray(), i * 3);
            centers.set([0, 0, 0], i * 3);
            initialTimes[i] = Math.random() * 100;
            // Generate radii: some small (dots), some large (spheres/rings)
            radii[i] = Math.random() < 0.3 ? 0.3 : (Math.random() * 0.5 + 0.6); 
        }
        return [positions, initialTimes, centers, radii];
    }, [count]);

    // --- Animation loop (runs every frame) ---
    useFrame(({ clock, mouse, camera }) => {
        if (materialRef.current) {
            const timeElapsed = clock.getElapsedTime();
            materialRef.current.time = timeElapsed;
            
            // Progress control for pulsing
            materialRef.current.progress = Math.sin(timeElapsed * 0.2); 
            
            // Raycast mouse position onto a plane near the sphere's center
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            materialRef.current.mousePos.copy(mouseWorldPos); 
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-initialTime" count={initialTimes.length} array={initialTimes} itemSize={1} />
                <bufferAttribute attach="attributes-center" count={centers.length / 3} array={centers} itemSize={3} />
                <bufferAttribute attach="attributes-radius" count={radii.length} array={radii} itemSize={1} />
            </bufferGeometry>
            <pointShaderMaterial 
                ref={materialRef} 
                depthWrite={false} 
                transparent={true}
                blending={THREE.AdditiveBlending} 
                // Increased point size slightly for visibility
                uniforms-pointSize-value={5.0} 
            />
        </points>
    );
};

export default InteractiveSphere;