<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import Planet from './Planet.svelte';
</script>

<svelte:head>
	<title>Writings</title>
	<meta name="description" content="Some writings" />
</svelte:head>

<Planet />

<style lang="scss">
	div {
		min-height: 100vh;
		min-width: 100vw;
	}
</style>
