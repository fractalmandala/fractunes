<div class="out-gridder">
<div class="my-gridder">
	<div class="verti"></div>
<div class="verti"></div>
<div class="verti"></div>
<div class="verti"></div>
<div class="verti"></div>
<div class="verti"></div>
<div class="verti"></div>
</div>
<div class="my-rows">
<div class="horti"></div>
<div class="horti"></div>
<div class="horti"></div>
<div class="horti"></div>
<div class="horti"></div>
<div class="horti"></div>
<div class="horti"></div>
</div>
</div>

<style lang="sass">

.out-gridder
	height: 100%
	width: 100%
	position: relative

.my-rows
	display: grid
	grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
	height: 100%
	width: 100%
	position: absolute
	top: 0
	left: 0
	pointer-events: none
	.horti
		display: flex
		flex-direction: row
		width: 100%
		border-bottom: 1px solid var(--border-subtle)

.my-gridder
	display: grid
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
	height: 100%
	width: 100%
	position: absolute
	top: 0
	left: 0
	pointer-events: none
	.verti
		display: flex
		flex-direction: column
		height: 100%
		border-right: 1px solid var(--border-subtle)

</style>