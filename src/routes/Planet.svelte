<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import GUI from 'lil-gui';

	let container: HTMLDivElement;

	onMount(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 5;
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const geometry = new THREE.SphereGeometry(1, 32, 32);
		const material = new THREE.MeshBasicMaterial({ color: '#3a6ea6', wireframe: true });
		material.wireframe = true;
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		// Sizes
		const sizes = {
			width: window.innerWidth,
			height: window.innerHeight
		};

		window.addEventListener('resize', () => {
			// Update sizes
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;

			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
		});

		function animate() {
			requestAnimationFrame(animate);
			sphere.rotation.y += 0.01;
			renderer.render(scene, camera);
		}

		animate();

		//DEBUG
		const gui = new GUI();
		const debugObject = {
			color: '#3a6ea6',
			cameraFov: 75
		};
		gui.add(camera.position, 'z', 0, 10, 0.01).name('cameraDistance');
		gui.addColor(debugObject, 'color').onChange((newColor: string) => {
			material.color.set(newColor);
		});
		gui.add(debugObject, 'cameraFov', 0, 150, 0.01).onChange((newFov: number) => {
			camera.fov = newFov;
			camera.updateProjectionMatrix();
		});
	});
</script>

<div bind:this={container}></div>

<style lang="scss">
	div {
		min-width: 100vw;
		min-height: 100vh;
	}
</style>
