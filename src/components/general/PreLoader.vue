<template>
	<div class="loader-container">
		<div class="lds-ring">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.loader-container {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999999;
		background: #ffffffab;
	}
	.lds-ring {
		width: 100px;
		height: 100px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999999;
	}
	.lds-ring div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 100px;
		height: 100px;
		margin: 8px;
		border: 15px solid #4782DA;
		border-radius: 50%;
		animation: lds-ring 1.1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #4782DA transparent transparent transparent;
	}

	.lds-ring div:nth-child(1) {
		animation-delay: -0.45s;
	}

	.lds-ring div:nth-child(2) {
		animation-delay: -0.3s;
	}

	.lds-ring div:nth-child(3) {
		animation-delay: -0.15s;
	}

	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
