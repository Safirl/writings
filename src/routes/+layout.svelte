<script lang="ts">
	// import Header from './Header.svelte';
	import '../reset.scss';
	import '../app.scss';

	let { children } = $props();
</script>

<div class="app">
	<!-- <Header /> -->

	<main>
		{@render children()}
	</main>

	<!-- <footer>
		<p>
			visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
		</p>
	</footer> -->
</div>

<style lang="scss">
	// main {
	// 	min-width:;
	// }
</style>
