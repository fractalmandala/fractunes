<script lang="ts">

	import Background from '$lib/bgtemp/Background.svelte'
	import BackgroundPicker from '$lib/bgtemp/BackgroundPicker.svelte';
	let value = $state('sunrise-drift')
</script>

<div class="box gap-bs pad-bs">
<BackgroundPicker bind:value />
</div>