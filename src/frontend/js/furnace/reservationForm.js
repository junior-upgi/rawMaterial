import moment from 'moment-timezone';
import numeral from 'numeral';
import { mapGetters, mapMutations, mapActions } from 'vuex';

import { store } from '../store/store.js';

export let reservationForm = {
    name: 'reservationForm',
    store: store,
    computed: {
        ...mapGetters({
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth',
            showRevision: 'getShowRevision',
            rawMatList: 'getRawMatList',
            planSchedule: 'getPlanSchedule'
        }),
        firstDateOfCurrentMonth() {
            let firstDateOfCurrentMonth = new Date().setDate(1);
            return moment(firstDateOfCurrentMonth, 'YYYY-MM-DD HH:mm:ss');
        },
        firstDateOfSelectedMonthYear() {
            let firstDateOfSelectedMonthYear = new Date(this.selectedYear, this.selectedMonth, 1);
            return moment(firstDateOfSelectedMonthYear, 'YYYY-MM-DD HH:mm:ss');
        },
        disallowBatchReservation: function() {
            if ((parseInt(this.selectedRawMatIndex) === -1) || (this.firstDateOfCurrentMonth <= this.firstDateOfSelectedMonthYear)) {
                return true;
            } else {
                return false;
            }
        },
        relevantSchedule: function() {
            if ((this.requestDate === null) || (this.requestDate === '') || (parseInt(this.selectedRawMatIndex) === -1)) {
                return null;
            } else {
                return this.planSchedule
                    .filter((shipment) => {
                        return ((shipment.CUS_NO === this.rawMatList[this.selectedRawMatIndex].CUS_NO) &&
                            (shipment.PRD_NO === this.rawMatList[this.selectedRawMatIndex].PRD_NO) &&
                            (shipment.typeId === this.rawMatList[this.selectedRawMatIndex].typeId) &&
                            (shipment.requestDate === this.requestDate) &&
                            (!shipment.deprecated));
                    }).length;
            }
        },
        disallowReservation: function() {
            return ((parseInt(this.selectedRawMatIndex) === -1) ||
                (!this.requestDate) ||
                (!this.quantity) ||
                (this.relevantSchedule !== 0)) ? true : false;
        }
    },
    data: function() {
        return {
            selectedRawMatIndex: -1,
            quantity: null,
            requestDate: null
        };
    },
    created: function() { this.initRawMatList(); },
    methods: {
        ...mapMutations({
            rawMatSelected: 'rawMatSelected',
            toggleEnableBatchReservation: 'toggleEnableBatchReservation'
        }),
        ...mapActions({
            initRawMatList: 'initRawMatList',
            scheduleShipment: 'scheduleShipment'
        }),
        checkDateValidity: function() {
            let limit = moment(moment(), 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days');
            let requestDate = moment(this.requestDate, 'YYYY-MM-DD');
            if (requestDate <= limit) {
                alert('不能預約過去的日期進貨，選項將重置');
                this.requestDate = '';
            }
        },
        makeReservation: function() {
            if (document.getElementById('reservationForm').checkValidity()) {
                if (this.selectedRawMatIndex > -1) { // prevent the -1 valued 'general selection' from being submitted
                    this.scheduleShipment({
                        type: 'scheduleShipment',
                        requestDate: this.requestDate,
                        CUS_NO: this.rawMatList[this.selectedRawMatIndex].CUS_NO,
                        PRD_NO: this.rawMatList[this.selectedRawMatIndex].PRD_NO,
                        typeId: this.rawMatList[this.selectedRawMatIndex].typeId,
                        quantity: this.quantity
                    });
                    this.quantity = '';
                    this.requestDate = '';
                } else {
                    alert('請選擇一項原料再進行進貨預約');
                }
            }
        }
    },
    filters: {
        toTonnage: function(value) {
            return `${numeral(Math.round(value / 1000)).format('0,0')} 噸`;
        }
    },
    template: `
        <form id="reservationForm" class="navbar-form navbar-left" @submit.prevent>
            <select style="font-size: 6px;" class="form-control" v-model="selectedRawMatIndex" @change="rawMatSelected(selectedRawMatIndex)" required >
                <option value="-1">顯示本月所有進貨作業項目</option>
                <option v-for="(rawMat, index) in rawMatList" :value="index">
                    【{{rawMat.CUS_SNM}}】{{rawMat.PRDT_SNM}} {{rawMat.specification}} (每車約 {{rawMat.unitPerTruck|toTonnage}})
                </option>
            </select>
            <input style="font-size:6px;" type="date" class="form-control" required v-model="requestDate" @change="checkDateValidity" required />
            <input style="font-size:6px;width:70px;" type="number" class="form-control text-center" placeholder="數量" min="1" v-model="quantity" required />
            <button
                type="submit" class="btn btn-default"
                @click="makeReservation"
                :disabled="disallowReservation"
                style="font-size:6px;">
                預約
            </button>
            <button
                type="button" class="btn btn-default"
                style="font-size:6px;"
                :disabled="disallowBatchReservation"
                @click="toggleEnableBatchReservation">
                批次預約
            </button>
        </form>`
};
