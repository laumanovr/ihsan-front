<template>
	<div class="application-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<span>Заявки</span>
			<button
				class="btn blue-primary"
				@click="toggleAppModal('add')"
				v-if="permissions.some(i => i.code === 'app-create/edit')"
			>
				Создать заявку
			</button>
		</div>

		<div class="tables d-flex">
			<table class="table fixed">
				<thead>
				<tr>
					<th></th>
					<th>#</th>
					<th>Дата регистрации</th>
					<th>Филиал</th>
					<th>Программа</th>
					<th>ФИО</th>
					<th>Менеджер</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(app, i) in allApplications" :key="app.id">
					<td><v-checkbox v-model="app.checked" @change="onSelectApp(app)"/></td>
					<td>{{(currentPage - 1) * 10 + (i + 1)}}</td>
					<td>{{app.registerDate}}</td>
					<td>{{app.departmentTitle}}</td>
					<td>{{app.programType}}</td>
					<td>{{app.customerResource.lastName+' '+app.customerResource.firstName+' '+app.customerResource.middleName}}</td>
					<td>{{app.userTitle}}</td>
				</tr>
				</tbody>
			</table>
			<table class="table is-scroll">
				<thead>
				<tr>
					<th>Пин клиента</th>
					<th>Район</th>
					<th>Адрес</th>
					<th>Телефон</th>
					<th>Место работы</th>
					<th>Доход</th>
					<th>Предварит. стоимость(жилья/авто)</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="app in allApplications" :key="app.id">
					<td>{{app.customerResource.pin}}</td>
					<td>{{app.customerResource.regionTitle}}</td>
					<td>{{app.customerResource.address}}</td>
					<td>{{app.customerResource.phoneNumber}}</td>
					<td>{{app.customerResource.jobPlace}}</td>
					<td>{{app.monthlyIncome}}</td>
					<td>{{app.proposedLoan}}</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div class="pagination d-flex align-center" v-if="totalPages.length > 1">
			<div class="select d-flex align-center">
				<label>Страница</label>
				<v-select
					solo
					class="drop-down-pages"
					:items="totalPages"
					v-model="currentPage"
					@change="jumpToPage"
				/>
			</div>
			<div class="divider">|</div>
			<div class="change-page d-flex align-center">
				<img src="../../assets/icons/arrow-right.svg" class="left" @click="paginate('left')">
				<span>{{currentPage}}</span>
				<img src="../../assets/icons/arrow-right.svg" @click="paginate('right')">
			</div>
		</div>

		<div class="fixed-actions" v-if="selectedApp">
			<button
				class="btn blue-primary"
				@click="approveApp(true)"
				v-if="permissions.some(i => i.code === 'approve')"
			>
				Одобрить
			</button>
			<button
				class="btn blue-primary"
				@click="toggleAppModal('edit')"
				v-if="permissions.some(i => i.code === 'app-create/edit')"
			>
				Изменить
			</button>
		</div>

		<!--APPLICATION MODAL-->
		<modal name="app-modal" height="97%">
			<div class="modal-container">
				<h3>{{mode === 'add' ? 'Создать заявку' : 'Редактировать'}}</h3>
				<v-form ref="appForm">
					<div class="masked-input">
						<span>Дата регистрации</span>
						<MaskedInput
							class="masked-input"
							mask="11.11.1111"
							placeholder="ДД.ММ.ГГГГ"
							v-model="application.registerDate"
							autocomplete="new-password"
							:readonly="!permissions.some(i => i.code === 'registerDate')"
						/>
					</div>
					<v-select
						outlined
						label="Филиал"
						:items="departmentList"
						item-text="title"
						item-value="id"
						v-model="application.departmentId"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'departmentTitle')"
					/>
					<v-select
						outlined
						label="Программа"
						:items="programTypes"
						item-text="title"
						item-value="id"
						v-model="application.programTypeId"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'programType')"
					/>
					<v-text-field
						outlined
						label="Имя клиента"
						v-model="application.customerDto.firstName"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'fio')"
					/>
					<v-text-field
						outlined
						label="Фамилия клиента"
						v-model="application.customerDto.lastName"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'fio')"
					/>
					<v-text-field
						outlined
						label="Отчество клиента"
						v-model="application.customerDto.middleName"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'fio')"
					/>
					<v-select
						outlined
						label="Ответственный менеджер"
						:items="allUsers"
						item-text="fullName"
						item-value="id"
						v-model="application.userId"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'userTitle')"
					/>
					<v-text-field
						outlined
						label="Пин клиента"
						v-model="application.customerDto.pin"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'pin')"
					/>
					<v-select
						outlined
						label="Регион"
						:items="regionList"
						item-text="title"
						item-value="id"
						v-model="parentLocationId"
						@change="getDistrict"
					/>
					<v-select
						outlined
						label="Район"
						:items="districtList"
						item-text="title"
						item-value="id"
						v-model="application.customerDto.regionId"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'regionTitle')"
					/>
					<v-text-field
						outlined
						label="Адрес проживания"
						v-model="application.customerDto.address"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'address')"
					/>
					<v-text-field
						outlined
						label="Телефон"
						v-model="application.customerDto.phoneNumber"
						:rules="requiredRule"
						type="number"
						:readonly="!permissions.some(i => i.code === 'phoneNumber')"
					/>
					<v-text-field
						outlined
						label="Место работы"
						v-model="application.customerDto.jobPlace"
						:rules="requiredRule"
						:readonly="!permissions.some(i => i.code === 'jobPlace')"
					/>
					<v-text-field
						outlined
						label="Доход"
						v-model="application.monthlyIncome"
						:rules="requiredRule"
						type="number"
						:readonly="!permissions.some(i => i.code === 'monthlyIncome')"
					/>
					<v-text-field
						outlined
						label="Предварит. стоимость(жилья/авто)"
						v-model.number="application.proposedLoan"
						:rules="requiredRule"
						type="number"
						:readonly="!permissions.some(i => i.code === 'proposedLoan')"
					/>
					<v-file-input
						label="Загрузить файлы"
						outlined
						counter
						multiple
						show-size
						truncate-length="15"
						@change="onSelectFile"
						prepend-icon=""
					/>
					<div class="attach-files" v-if="mode === 'edit' && application.attachments.length">
						<span>Прикрепленные файлы:</span>
						<div class="items">
							<div class="item d-flex align-center" v-for="(file, i) in application.attachments" :key="i">
								<span>{{file.fileName}}</span>
								<img src="../../assets/icons/delete-icon.svg" @click="deleteAttachFile(file.id, i)">
							</div>
						</div>
					</div>
				</v-form>
				<div class="btn-actions">
					<button class="btn red-primary" @click="toggleAppModal">Отмена</button>
					<button class="btn green-primary" @click="submitSave">Сохранить</button>
				</div>
			</div>
		</modal>

		<!--APPROVE MODAL-->
		<modal name="approve-modal" height="97%">
			<div class="modal-container">
				<h3>Одобрить</h3>
				<v-form ref="approveForm">
					<v-select
						outlined
						label="Статус"
						:items="statuses"
						item-text="title"
						item-value="value"
						v-model="application.statusType"
						:rules="requiredRule"
					/>
					<v-text-field
						outlined
						label="Вступительный взнос"
						v-model.number="application.admissionFee"
						:rules="requiredRule"
						type="number"
						@blur="countAdmissionPercent"
					/>
					<v-text-field
						outlined
						label="Вступит.взнос процент %"
						v-model="application.admissionFeePercentage"
						:rules="requiredRule"
						type="number"
						readonly
					/>
					<v-text-field
						outlined
						label="Собственный вклад"
						v-model="application.ownContribution"
						:rules="requiredRule"
						type="number"
						@blur="countOwnContributionPercent"
					/>
					<v-text-field
						outlined
						label="Собствен.вклад процент %"
						v-model="application.ownContributionPercentage"
						:rules="requiredRule"
						type="number"
						readonly
					/>
					<v-text-field
						outlined
						label="Сумма займа"
						v-model="application.loanAmount"
						:rules="requiredRule"
						type="number"
					/>
					<v-text-field
						outlined
						label="Срок займа(мес.)"
						v-model="application.loanTerm"
						:rules="requiredRule"
						type="number"
					/>
					<div class="masked-input">
						<span>Предварительная дата</span>
						<MaskedInput
							class="masked-input"
							mask="11.11.1111"
							placeholder="ДД.ММ.ГГГГ"
							v-model="application.preliminaryDate"
							autocomplete="new-password"
						/>
					</div>
					<div class="masked-input">
						<span>Дата выдачи</span>
						<MaskedInput
							class="masked-input"
							mask="11.11.1111"
							placeholder="ДД.ММ.ГГГГ"
							v-model="application.dateOfIssue"
							autocomplete="new-password"
						/>
					</div>
					<v-text-field
						outlined
						label="Членский взнос"
						v-model="application.membershipFee"
						:rules="requiredRule"
						type="number"
					/>
					<v-text-field
						outlined
						label="Паевой взнос"
						v-model="application.sharePayment"
						:rules="requiredRule"
						type="number"
					/>
					<v-text-field
						outlined
						label="Всего платеж"
						v-model="application.totalPayment"
						:rules="requiredRule"
						type="number"
					/>
				</v-form>
				<div class="btn-actions">
					<button class="btn red-primary" @click="$modal.hide('approve-modal')">Отмена</button>
					<button class="btn green-primary" @click="approveApp(false)">Одобрить</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import {RegionService} from '../../services/region.service';
import {ProgramTypeService} from '../../services/program-type.service';
import {DepartmentService} from '../../services/department.service';
import {ApplicationService} from '../../services/application.service';
import {UserService} from '../../services/user.service';
import MaskedInput from 'vue-masked-input';

export default {
	components: {
		MaskedInput
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			isLoading: false,
			statuses: [{title: 'Выдан', value: 'ISSUED'}, {title: 'Накопительный', value: 'SAVING'}],
			application: {
				customerDto: {
					address: '',
					email: '',
					firstName: '',
					jobPlace: '',
					lastName: '',
					middleName: '',
					phoneNumber: '',
					pin: '',
					regionId: 0
				},
				userId: 0,
				departmentId: 0,
				monthlyIncome: 0,
				programTypeId: 0,
				proposedLoan: 0,
				registerDate: '',
				statusType: 'QUEUE',
				customerId: '',
				admissionFee: 0,
				admissionFeePercentage: 0,
				dateOfIssue: '',
				loanAmount: 0,
				loanTerm: 0,
				membershipFee: 0,
				ownContribution: 0,
				ownContributionPercentage: 0,
				preliminaryDate: '',
				sharePayment: 0,
				totalPayment: 0,
			},
			parentLocationId: '',
			selectedApp: '',
			mode: '',
			allApplications: [],
			regionList: [],
			districtList: [],
			programTypes: [],
			departmentList: [],
			allUsers: [],
			filterBody: {
				statuses: ['QUEUE'],
				userId: '',
			},
			currentPage: 1,
			totalPages: [],
			formData: new FormData()
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.user;
		},
		permissions() {
			if (this.userProfile.permissions) {
				return this.userProfile.permissions.filter(i => i.sidebar.href === this.$route.path);
			}
			return [];
		},
		isShowAll() {
			return this.permissions.some(i => i.code === 'show-all-queue');
		}
	},
	mounted() {
		this.filterBody.userId = this.isShowAll ? '' : this.userProfile.user.id;
		this.getAllApplications();
		this.getAllRegions();
		this.getProgramTypes();
		this.getDepartments();
		this.getAllUsers();
	},
	methods: {
		async getAllApplications() {
			try {
				this.isLoading = true;
				const res = await ApplicationService.fetchApplicationList(this.currentPage, this.filterBody);
				this.allApplications = res._embedded ? res._embedded.applicationResourceList : [];
				this.totalPages = new Array(res.page.totalPages).fill(0).map((i, p) => p + 1);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
			}
		},

		countAdmissionPercent() {
			if (this.application.admissionFee) {
				const result = (this.application.admissionFee / this.application.proposedLoan) * 100;
				this.application.admissionFeePercentage = result.toFixed(1);
			}
		},

		countOwnContributionPercent() {
			if (this.application.ownContribution) {
				const result = (this.application.ownContribution / this.application.proposedLoan) * 100;
				this.application.ownContributionPercentage = result.toFixed(1);
			}
		},

		paginate(nav) {
			if (nav === 'right' && this.currentPage < this.totalPages.length) {
				this.currentPage += 1;
				this.getAllApplications();
			}
			if (nav === 'left' && this.currentPage > 1) {
				this.currentPage -= 1;
				this.getAllApplications();
			}
		},

		jumpToPage(page) {
			this.currentPage = page;
			this.getAllApplications();
		},

		async getAllUsers() {
			try {
				const res = await UserService.fetchUserList();
				this.allUsers = res.map((user) => {
					user.fullName = `${user.lastName} ${user.firstName}`;
					return user;
				});
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async getAllRegions() {
			try {
				this.regionList = await RegionService.fetchRegionList();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async getDistrict(regionId) {
			try {
				this.districtList = await RegionService.fetchDistrictList(regionId);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getProgramTypes() {
			try {
				this.programTypes = await ProgramTypeService.fetchAllProgramTypes();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async getDepartments() {
			try {
				this.departmentList = await DepartmentService.fetchDepartmentList();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async toggleAppModal(mode) {
			this.mode = mode;
			this.formData = new FormData();
			if (mode === 'add') {
				this.application = {customerDto: {}, statusType: 'QUEUE'};
			}
			if (mode === 'edit') {
				this.application = this.selectedApp;
				this.application.customerDto = this.selectedApp.customerResource;
				this.application.customerId = this.application.customerDto.id;
				this.application.statusType = 'QUEUE';
				try {
					this.isLoading = true;
					const res = await RegionService.findById(this.application.customerDto.regionId);
					this.parentLocationId = res.parentId;
					await this.getDistrict(this.parentLocationId);
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
			this.$modal.toggle('app-modal');
		},

		onSelectApp(app) {
			this.selectedApp = app.checked ? app : '';
			this.allApplications.map((item) => {
				if (app.id !== item.id) {
					item.checked = false;
				}
				return item;
			});
		},

		onSelectFile(arrFiles) {
			arrFiles.map((file) => this.formData.append('files', file));
		},

		async submitSave() {
			if (this.$refs.appForm.validate()) {
				try {
					this.isLoading = true;
					if (this.mode === 'add') {
						const res = await ApplicationService.create(this.application);
						await this.sendAttachFiles(res.message);
						this.getAllApplications();
					}
					if (this.mode === 'edit') {
						await ApplicationService.update(this.application);
						await this.sendAttachFiles(this.application.id);
						this.onSelectApp({id: 0, checked: false});
						const updatedApp = await ApplicationService.findById(this.application.id);
						this.allApplications = this.allApplications.map((app) => {
							if (app.id === this.application.id) {
								app = updatedApp;
								app.customerDto = updatedApp.customerResource;
							}
							return app;
						});
					}
					this.$toast.success(this.mode === 'add' ? 'Успешно создано!' : 'Успешно обновлено!');
					this.toggleAppModal();
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		async sendAttachFiles(appId) {
			if (this.formData.entries().next().value) {
				try {
					await ApplicationService.attachFile(appId, this.formData);
				} catch (err) {
					this.$toast.error(err);
				}
			}
		},

		async deleteAttachFile(fileId, index) {
			try {
				this.isLoading = true;
				await ApplicationService.deleteFile(fileId);
				this.application.attachments.splice(index, 1);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async approveApp(isConfirm) {
			if (isConfirm) {
				this.application = this.selectedApp;
				this.application.customerDto = this.selectedApp.customerResource;
				this.$modal.show('approve-modal');
				return;
			}
			if (!this.$refs.approveForm.validate()) {
				this.$toast.info('Вы не заполнили все поля!');
				return;
			}
			try {
				this.isLoading = true;
				await ApplicationService.update(this.application);
				this.$modal.hide('approve-modal');
				this.$toast.success('Успешно одобрено!');
				this.$router.push({name: 'approvedApps'});
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss">
	.application-container {
		margin-bottom: 50px;
		.tables {
			flex-wrap: wrap;
			table {
				display: inline-block;
				overflow-x: auto;
				&::-webkit-scrollbar {
					width: 0;
					height: 8px;
					background: transparent;
				}
				&::-webkit-scrollbar-thumb {
					background-color: rgba(0, 0, 0, 0.3);
					border-radius: 5px;
				}
				th {
					white-space: nowrap;
				}
				td {
					padding: 0 10px;
					height: 70px;
				}
				&.fixed {
					width: 50%;
					border-radius: 5px 0 0 5px;
				}
				&.is-scroll {
					width: 50%;
					border-radius: 0 5px 5px 0;
				}
			}
		}
		.fixed-actions {
			display: flex;
			position: fixed;
			bottom: 0;
			background: #fff;
			padding: 10px 0;
			width: 100%;
			.btn:first-child {
				margin: 0 20px 0 15px;
			}
		}
		.pagination {
			background: #fff;
			justify-content: center;
			color: #778192;
			border-radius: 5px;
			margin-top: 20px;
			.select {
				.v-select {
					max-width: 70px;
					height: 50px;
				}
				.v-input__slot {
					box-shadow: none !important;
				}
			}
			.divider {
				margin: 0 25px 0 10px;
			}
			.change-page {
				img {
					transform: scale(2.2);
					cursor: pointer;
					&.left {
						transform: rotate(180deg) scale(2.2);
					}
				}
				span {
					color: #000;
					margin: 0 12px;
					font-size: 17px;
				}
			}
		}
		.attach-files {
			margin-bottom: 30px;
			border-bottom: 1px solid #797979;
			padding-bottom: 5px;
			font-size: 14px;
			color: #797979;
			.item {
				img {
					margin-left: 10px;
					cursor: pointer;
				}
			}
		}
	}
</style>