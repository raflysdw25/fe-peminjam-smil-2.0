<template>
	<div class="menu-navigation">
		<b-navbar
			toggleable="lg"
			type="dark"
			variant="smil-primary"
			v-if="type === 'navbar'"
		>
			<b-navbar-brand to="/">
				<div class="logo-brand container">
					<img src="@/assets/images/brand-peminjaman.png" alt="" />
				</div>
			</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<template v-for="(menu, indexMenu) in listMenu">
						<b-nav-item-dropdown
							right
							v-if="menu.child"
							:key="`menu-dropdown-${indexMenu}${menu.id}`"
							class="mr-4"
						>
							<template slot="button-content">
								<icon-component
									v-if="menu.icon"
									:iconName="menu.icon.iconName"
									:size="menu.icon.size"
									:colorIcon="menu.icon.color"
								/>
								{{ menu.text }}
							</template>
							<b-dropdown-item
								href="#"
								v-for="dropdown in menu.child"
								:key="`dropdown-${dropdown.id}`"
								:to="{ name: dropdown.to }"
							>
								{{ dropdown.text }}
							</b-dropdown-item>
						</b-nav-item-dropdown>
						<b-nav-item
							v-else
							:key="`menu-item-${indexMenu}${menu.id}`"
							:to="{ name: menu.to }"
							:active="menu.to === $route.name"
							class="mr-4"
						>
							<icon-component
								v-if="menu.icon"
								:iconName="menu.icon.iconName"
								:size="menu.icon.size"
								:colorIcon="menu.icon.color"
							/>
							<span class="smil-link">{{ menu.text }}</span>
						</b-nav-item>
					</template>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
	</div>
</template>

<script>
	// Components
	import IconComponent from '@/components/IconComponent.vue'
	export default {
		name: 'menu-navigation',
		components: { IconComponent },
		props: {
			listMenu: {
				required: true,
				type: Array,
			},
			type: {
				required: true,
				type: String,
			},
		},
		watch: {},
		data() {
			return {
				toggleSidebar: false,
			}
		},
		mounted() {},
		computed: {},
		methods: {
			collapseMenu(idCollapse) {
				this.$root.$emit('bv::toggle::collapse', idCollapse)
			},
			activeMenu(activeCriteria) {
				let fullPath = this.$route.fullPath.split('/')
				return fullPath.includes(activeCriteria)
			},
			childActiveMenu(parentCriteria, childCriteria) {
				let fullPath = this.$route.fullPath.split('/')
				return (
					fullPath.includes(parentCriteria) && fullPath.includes(childCriteria)
				)
			},
			navigate(routeTo) {
				this.$router.push({ name: routeTo })
			},
		},
	}
</script>

<style lang="scss" scoped>
	.logo-brand img {
		height: 50px;
	}

	.logo-brand-admin {
		margin-top: 25px;
		img {
			height: 50px;
		}
	}
	.nav-link {
		display: flex;
		align-items: center;
	}

	.collapse-menu {
		.collapse-menu-list-menu {
			list-style: none;
			width: max-content;
			&.smil-link {
				color: #696969;
				&:hover {
					color: #101939;
					font-weight: 700;
				}

				&::before {
					background-color: #101939;
				}
			}
			padding: 10px 0;
			&.active {
				color: #101939;
				font-weight: 700;
			}
		}
	}
</style>
<style lang="scss">
	.nav-item {
		&.b-nav-dropdown {
			&.dropdown {
				.nav-link {
					display: flex;
					align-items: center;
					color: #fff !important;
				}
				&.active {
					font-weight: bold;
				}
			}
		}
	}
	.b-sidebar {
		height: 100% !important;
		overflow-x: hidden;
	}
	.bg-smil-primary {
		background-color: #101939 !important;
	}

	#sidebar-menu {
		.nav {
			margin-top: 70px;
		}
		.nav-item {
			padding: 0 14px;
			margin-bottom: 10px;
			.nav-link,
			.nav-item.b-nav-dropdown.dropdown .nav-link {
				padding-left: 0;
				font-size: 18px;
				text-decoration: none;
				color: #696969 !important;
				&.active {
					color: #fff !important;
					font-weight: 700;
				}
			}
		}
		.dropdown-toggle::after {
			margin-left: 40px;
			color: #fff !important;
		}
		.icon-component {
			margin-right: 20px;
			&.collapse-icon-dropdown {
				margin-right: 0;
				margin-left: auto;
			}
		}

		.collapse {
			&.show {
				padding: 0 14px;
			}
		}
	}
</style>
