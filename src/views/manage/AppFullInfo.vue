<template>
	<div class="app-additional-info">
		<PreLoader v-if="isLoading"/>
		<div class="head-title d-flex align-center justify-space-between">
			<div class="d-flex align-center">
				<img src="../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back">
				<span>Полная информация по заявке</span>
			</div>
			<button
				class="btn blue-primary edit-mode-btn"
				:class="{'selected': !isDisabled}"
				@click="isDisabled = false"
			>
				{{isDisabled ? 'Режим редактирования' : 'Можете редактировать'}}
			</button>
		</div>

		<v-form class="full-info" ref="fullInfoForm">
			<div class="attach-files">
				<h3>Прикрепленные файлы:</h3>
				<label class="add-file" for="file">+<input type="file" id="file" @change="attachNewFile"></label>
				<div class="items">
					<div class="item d-flex align-center" v-for="(file, i) in application.attachments" :key="i">
						<span>{{file.fileName}}</span>
						<img src="../../assets/icons/download.svg" title="Скачать" @click="downloadAttachment(file)">
						<img src="../../assets/icons/delete-icon.svg" title="Удалить" @click="deleteAttachFile(file.id, i)">
					</div>
				</div>
			</div>
			<div class="client-info">
				<div class="created-by">Создан: <span>{{application.createdBy.replace('null', '')}}</span></div>
				<h3>Информация о заемщике</h3>
				<div class="masked-input">
					<span>Дата регистрации</span>
					<MaskedInput
						class="masked-input"
						mask="11.11.1111"
						placeholder="ДД.ММ.ГГГГ"
						v-model="application.registerDate"
						autocomplete="new-password"
						:readonly="isDisabled"
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
					:readonly="isDisabled"
				/>
				<v-select
					outlined
					label="Программа"
					:items="programTypes"
					item-text="title"
					item-value="id"
					v-model="application.programTypeId"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Имя клиента"
					v-model="application.customerDto.firstName"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Фамилия клиента"
					v-model="application.customerDto.lastName"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Отчество клиента"
					v-model="application.customerDto.middleName"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-select
					outlined
					label="Ответственный менеджер"
					:items="allUsers"
					item-text="fullName"
					item-value="fullName"
					v-model="application.userTitle"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Пин клиента"
					v-model="application.customerDto.pin"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-select
					outlined
					label="Регион"
					:items="regionList"
					item-text="title"
					item-value="id"
					v-model="parentLocationId"
					@change="getDistrict"
					:readonly="isDisabled"
				/>
				<v-select
					outlined
					label="Район"
					:items="districtList"
					item-text="title"
					item-value="id"
					v-model="application.customerDto.regionId"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Адрес проживания"
					v-model="application.customerDto.address"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Телефон"
					v-model="application.customerDto.phoneNumber"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Место работы"
					v-model="application.customerDto.jobPlace"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Доход"
					v-model="application.monthlyIncome"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Предварит. стоимость(жилья/авто)"
					v-model="application.proposedLoan"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
			</div>

			<div class="loan-info">
				<h3>Информация по займу</h3>
				<v-select
					outlined
					label="Статус"
					:items="statuses"
					item-text="title"
					item-value="value"
					v-model="application.statusType"
					:rules="requiredRule"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Вступительный взнос"
					v-model="application.admissionFee"
					:rules="requiredRule"
					@blur="countAdmissionPercent"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Вступит.взнос процент %"
					v-model="application.admissionFeePercentage"
					:rules="requiredRule"
					readonly
				/>
				<v-text-field
					outlined
					label="Собственный вклад"
					v-model="application.ownContribution"
					:rules="requiredRule"
					@blur="countOwnContributionPercent"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Собствен.вклад процент %"
					v-model="application.ownContributionPercentage"
					:rules="requiredRule"
					readonly
				/>
				<v-text-field
					outlined
					label="Сумма займа"
					v-model="application.loanAmount"
					:rules="requiredRule"
					type="number"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Срок займа(мес.)"
					v-model="application.loanTerm"
					:rules="requiredRule"
					type="number"
					:readonly="isDisabled"
				/>
				<div class="masked-input">
					<span>Предварительная дата</span>
					<MaskedInput
						class="masked-input"
						mask="11.11.1111"
						placeholder="ДД.ММ.ГГГГ"
						v-model="application.preliminaryDate"
						autocomplete="new-password"
						readonly
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
						:readonly="isDisabled"
					/>
				</div>
				<v-text-field
					outlined
					label="Членский взнос"
					v-model="application.membershipFee"
					:rules="requiredRule"
					type="number"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Паевой взнос"
					v-model="application.sharePayment"
					:rules="requiredRule"
					type="number"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Всего платеж"
					v-model="application.totalPayment"
					:rules="requiredRule"
					type="number"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Страховка"
					v-model="application.insurance"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Юр.услуги"
					v-model="application.legalServices"
					:readonly="isDisabled"
				/>
			</div>

			<div class="deposit-info">
				<h3>Информация по залогу</h3>
				<v-text-field
					outlined
					label="Адрес жилья"
					v-model="appInformation.accommodationAddress"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Тип (жилье, квартира, дом, авто)"
					v-model="appInformation.housingType"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Идентиф. код жилья (гос.номер)"
					v-model="appInformation.identificationCode"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Комнаты"
					v-model="appInformation.room"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Год постройки"
					v-model="appInformation.yearBuild"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Материал строения цвет"
					v-model="appInformation.materialBuilt"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Общая площадь (жилья/объем авто)"
					v-model="appInformation.totalArea"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Стоимость жилья"
					v-model="appInformation.houseCost"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Платеж/Доход (PTI)"
					v-model="appInformation.pti"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Займ/стоимость жилья (LTV)"
					v-model="appInformation.ltv"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Цена за 1 м² (Сом)"
					v-model="appInformation.unitPrice"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Цена за 1 м² (Долл.США)"
					v-model="appInformation.unitPriceDollar"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Код района недвижимости"
					v-model="appInformation.districtCode"
					:readonly="isDisabled"
				/>
				<v-select
					outlined
					label="Регион"
					:items="regionList"
					item-text="title"
					item-value="id"
					v-model="infoLocationId"
					@change="getInfoDistrict"
					:readonly="isDisabled"
				/>
				<v-select
					outlined
					label="Район"
					:items="infoDistrictList"
					item-text="title"
					item-value="id"
					v-model="appInformation.locationId"
					:readonly="isDisabled"
				/>
				<v-text-field
					outlined
					label="Примечание"
					v-model="appInformation.note"
					:readonly="isDisabled"
				/>
			</div>
			<div class="d-flex justify-center save-btn" v-if="!isDisabled">
				<button class="btn green-primary" @click.prevent="submitSaveData">Сохранить</button>
			</div>

			<div class="payment-info">
				<h3>Информация о платеже</h3>
				<div class="total-paid">Всего паевый взнос: <span>{{formatSum(alreadyPaid)}}</span></div>
				<div class="must-pay">Текущий остаток: <span>{{formatSum(application.loanAmount - alreadyPaid)}}</span></div>
				<div class="d-flex align-center pay-block" v-for="(item, i) in paymentObj.payments" :key="i">
					<span class="counter">{{i + 1}}</span>
					<v-text-field
						outlined
						label="Дата платежа"
						class="amount-input"
						v-model="item.paymentDate"
						readonly
					/>
					<v-text-field
						:class="{'paid': item.paymentStatus === 'PAID'}"
						outlined
						label="Сумма платежа"
						class="amount-input"
						v-model.number="item.paymentAmount"
						readonly
					/>
					<button class="btn blue-primary pay-btn" @click.prevent="togglePaymentModal(item)">
						{{item.paymentStatus === 'PAID' ? 'Изменить' : 'Оплатить'}}
					</button>
				</div>
				<!--payment modal-->
				<modal name="payment-modal" height="auto">
					<div class="modal-container">
						<h3>Оплатить</h3>
						<div class="d-flex align-center justify-center">
							<div class="masked-input">
								<span>Дата платежа</span>
								<MaskedInput
									class="masked-input"
									mask="11.11.1111"
									placeholder="ДД.ММ.ГГГГ"
									autocomplete="new-password"
									v-model="selectedPayObj.paymentDate"
									readonly
								/>
							</div>
							<v-text-field
								outlined
								label="Сумма платежа"
								class="amount-input"
								type="number"
								v-model.number="selectedPayObj.paymentAmount"
							/>
						</div>
						<div class="btn-actions">
							<button class="btn red-primary" @click.prevent="togglePaymentModal">Отмена</button>
							<button class="btn green-primary" @click.prevent="savePayment">Оплатить</button>
						</div>
					</div>
				</modal>
			</div>
		</v-form>
	</div>
</template>

<script>
import {RegionService} from '../../services/region.service';
import {ProgramTypeService} from '../../services/program-type.service';
import {DepartmentService} from '../../services/department.service';
import {ApplicationService} from '../../services/application.service';
import {UserService} from '../../services/user.service';
import MaskedInput from 'vue-masked-input';
import {format, parse} from 'date-fns';

export default {
	components: {
		MaskedInput,
	},
	data() {
		return {
			statuses: [{title: 'Выдан', value: 'ISSUED'}, {title: 'Накопительный', value: 'SAVING'}],
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			isLoading: false,
			houseTypes: [{title: 'Квартира', value: 'APARTMENT'}, {title: 'Авто', value: 'TOYOTA'}],
			allApplications: [],
			regionList: [],
			districtList: [],
			programTypes: [],
			departmentList: [],
			allUsers: [],
			infoDistrictList: [],
			parentLocationId: '',
			infoLocationId: '',
			application: {
				admissionFee: 0,
				admissionFeePercentage: 0,
				attachments: [],
				customerDto: {
					address: '',
					email: '',
					firstName: '',
					jobPlace: '',
					jobTitle: '',
					lastName: '',
					middleName: '',
					phoneNumber: '',
					pin: '',
					regionId: 0
				},
				customerId: 0,
				dateOfIssue: '',
				departmentId: 0,
				loanAmount: 0,
				loanTerm: 0,
				membershipFee: 0,
				monthlyIncome: 0,
				ownContribution: 0,
				ownContributionPercentage: 0,
				preliminaryDate: '',
				programTypeId: 0,
				proposedLoan: 0,
				registerDate: '',
				sharePayment: 0,
				totalPayment: 0,
				userId: 0,
				statusType: 'ISSUED',
				createdBy: ''
			},
			appInformation: {
				applicationId: 0,
				accommodationAddress: '',
				districtCode: '',
				houseCost: 0,
				housingType: '',
				identificationCode: '',
				locationId: 0,
				ltv: '',
				pti: '',
				room: 0,
				totalArea: 0,
				unitPrice: 0,
				unitPriceDollar: 0,
				yearBuild: 0,
				materialBuilt: '',
				note: ''
			},
			infoMode: 'create',
			paymentObj: {
				applicationId: 0,
				payments: []
			},
			alreadyPaid: 0,
			selectedPayObj: {
				paymentDate: '',
				paymentAmount: 0
			},
			isDisabled: true
		};
	},
	created() {
		this.isLoading = true;
		this.getApplicationById();
		this.getAllRegions();
		this.getProgramTypes();
		this.getDepartments();
		this.getAllUsers();
	},
	methods: {
		async getApplicationById() {
			try {
				this.application = await ApplicationService.findById(this.$route.params.id);
				this.application.customerDto = this.application.customerResource;
				this.application.customerId = this.application.customerDto.id;
				if (this.application.customerDto.regionId) {
					const res = await RegionService.findById(this.application.customerDto.regionId);
					this.parentLocationId = res.parentId;
					await this.getDistrict(this.parentLocationId);
				}
				await this.getAppEstateInformation();
				this.getPaymentInfo();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async getAppEstateInformation() {
			try {
				const resp = await ApplicationService.fetchAppEstateInfo(this.application.id);
				if (Object.values(resp).length) {
					this.infoMode = 'edit';
					this.appInformation = Object.assign({}, resp[0], {materialBuilt: resp[0].materialBuild});
					if (this.appInformation.locationId) {
						const region = await RegionService.findById(this.appInformation.locationId);
						this.infoLocationId = region.parentId;
						await this.getInfoDistrict(this.infoLocationId);
					}
				}
				this.appInformation.applicationId = this.application.id;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
			}
		},

		formatSum(sum) {
			return sum ? Number(sum).toLocaleString('en-EN') : 0;
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
				this.countPreliminaryDate();
			}
		},

		countPreliminaryDate() {
			let regDate = parse(this.application.registerDate, 'dd.MM.yyyy', new Date());
			if (this.application.ownContributionPercentage >= 50) {
				this.application.preliminaryDate = format(new Date(regDate.setDate(regDate.getDate() + 60)), 'dd.MM.yyyy');
			} else if (this.application.ownContributionPercentage >= 35) {
				this.application.preliminaryDate = format(new Date(regDate.setDate(regDate.getDate() + 90)), 'dd.MM.yyyy');
			} else {
				this.application.preliminaryDate = format(new Date(regDate.setDate(regDate.getDate() + 180)), 'dd.MM.yyyy');
			}
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
			}
		},

		async getInfoDistrict(regionId) {
			try {
				this.infoDistrictList = await RegionService.fetchDistrictList(regionId);
			} catch (err) {
				this.$toast.error(err);
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

		async submitSaveData() {
			if (this.$refs.fullInfoForm.validate()) {
				try {
					this.isLoading = true;
					await ApplicationService.update(this.application);
					if (this.infoMode === 'create') {
						await ApplicationService.createAppEstateInfo(this.appInformation);
					} else {
						await ApplicationService.updateAppEstateInfo(this.appInformation);
					}
					this.$toast.success('Успешно сохранено!');
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		async getPaymentInfo() {
			try {
				const dateOfIssue = parse(this.application.dateOfIssue, 'dd.MM.yyyy', new Date());
				this.paymentObj.applicationId = this.$route.params.id;
				const res = await ApplicationService.fetchPaymentInfo(this.$route.params.id);
				if (Object.values(res).length) {
					this.paymentObj.payments = res.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)).map((item) => {
						item.paymentDate = new Date(item.paymentDate).toLocaleDateString('ru');
						if (item.paymentAmount && item.paymentStatus) {
							item.paymentStatus = 'PAID';
							this.alreadyPaid += item.paymentAmount;
						} else {
							item.paymentStatus = 'DRAFT';
						}
						return item;
					});
					this.isLoading = false;
					return;
				}
				this.paymentObj.payments = new Array(this.application.loanTerm).fill(0).map(() => {
					return {
						paymentDate: new Date(dateOfIssue.setMonth(dateOfIssue.getMonth() + 1)).toLocaleDateString('ru'),
						paymentAmount: (this.application.loanAmount / this.application.loanTerm).toFixed(1),
						paymentStatus: 'DRAFT'
					};
				});
			} catch (err) {
				this.$toast.error(err);
			}
		},

		togglePaymentModal(item) {
			if (item) {
				this.selectedPayObj = item;
			}
			this.$modal.toggle('payment-modal');
		},

		async savePayment() {
			if (this.selectedPayObj.paymentAmount > (this.application.loanAmount - this.alreadyPaid)) {
				this.$toast.info('Сумма платежа не может быть больше чем текущий остаток!');
				return;
			}
			try {
				this.paymentObj.payments.map((item) => {
					if (item.paymentDate === this.selectedPayObj.paymentDate) {
						item.paymentAmount = this.selectedPayObj.paymentAmount;
						item.paymentStatus = 'PAID';
					}
					return item;
				});
				this.isLoading = true;
				this.alreadyPaid = 0;
				await ApplicationService.paymentCreate(this.paymentObj);
				this.getPaymentInfo();
				this.togglePaymentModal();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async downloadAttachment(file) {
			try {
				this.isLoading = true;
				const blob = await ApplicationService.downloadFile(file.url);
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(new Blob([blob]));
				link.download = file.fileName.replace(' ', '');
				document.body.appendChild(link);
				link.click();
				window.URL.revokeObjectURL(link.href);
				link.remove();
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async attachNewFile(e) {
			const formData = new FormData();
			const file = e.target.files[0];
			formData.append('files', file);
			try {
				this.isLoading = true;
				const res = await ApplicationService.attachFile(this.$route.params.id, formData);
				this.application.attachments.push(res[0]);
				this.isLoading = false;
				this.$toast.success('Успешно добавили файл!');
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async deleteAttachFile(fileId, index) {
			try {
				this.isLoading = true;
				await ApplicationService.deleteFile(fileId);
				this.application.attachments.splice(index, 1);
				this.isLoading = false;
				this.$toast.success('Удалено!');
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss">
	.app-additional-info {
		margin-bottom: 25px;
		.back {
			margin-right: 15px;
			cursor: pointer;
		}
		.edit-mode-btn {
			margin-right: 15px;
			outline: none;
			&.selected {
				opacity: 0.5;
				pointer-events: none;
			}
		}
		.full-info {
			padding: 15px;
			border-radius: 5px;
			max-width: 97%;
			margin: 10px auto;
			background: #fff;
			.save-btn {
				border-bottom: 1px solid #9e9e9e;
				margin: 10px 0 25px;
				padding-bottom: 12px;
				.btn {
					height: 55px;
					max-width: 250px;
				}
			}
		}
		.created-by {
			text-align: right;
			font-size: 12px;
			span {
				font-weight: bold;
			}
		}
		.attach-files {
			margin-bottom: 30px;
			border-bottom: 1px solid #797979;
			padding-bottom: 5px;
			font-size: 15px;
			color: #797979;
			.add-file {
				background: #00c7a3;
				color: #fff;
				font-size: 20px;
				padding: 0 10px;
				border-radius: 4px;
				cursor: pointer;
				input {
					display: none;
				}
			}
			.item {
				span {
					color: #026dc1;
				}
				img {
					margin-left: 10px;
					cursor: pointer;
				}
			}
		}
		.payment-info {
			.counter {
				margin-right: 15px;
			}
			.must-pay {
				margin-bottom: 15px;
			}
			.amount-input {
				max-width: 220px;
				max-height: 50px;
				margin-left: 20px;
			}
			.pay-btn {
				margin-left: 15px;
			}
			.paid {
				background: #00ff0a38;
			}
			.pay-block {
				margin-bottom: 20px;
			}
		}
	}
</style>