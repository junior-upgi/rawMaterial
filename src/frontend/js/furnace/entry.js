import Vue from 'vue';
import VueResource from 'vue-resource';
import { mapGetters, mapMutations } from 'vuex';
Vue.use(VueResource);

import { store } from '../store/store.js';

import { scheduleSelector } from './scheduleSelector.js';
import { reservationForm } from './reservationForm.js';
import { shipmentTable } from './shipmentTable.js';
import { monthlyMemoBulletin } from './monthlyMemoBulletin.js';
import batchReservation from './batchReservation.js';

export default {
    name: 'furnaceComponent',
    store: store,
    components: {
        'schedule-selector': scheduleSelector,
        'reservation-form': reservationForm,
        'shipment-table': shipmentTable,
        'monthly-memo-bulletin': monthlyMemoBulletin,
        'batch-reservation': batchReservation
    },
    computed: {
        ...mapGetters({
            showRevision: 'getShowRevision',
            selectedYear: 'getSelectedYear',
            selectedMonth: 'getSelectedMonth',
            rawMatList: 'getRawMatList',
            selectedRawMatIndex: 'getSelectedRawMatIndex',
            enableBatchReservation: 'getEnableBatchReservation'
        }),
        batchReservationReady: function() {
            let firstDateOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // first day of the current month
            let firstDateOfSelectedMonthYear = new Date(this.selectedYear, this.selectedMonth, 1); // first day of the selected month/year
            // condition is met when all the following are true
            // A. a valid raw material is selected (index value > 0, since -1 is the general default selection)
            // B. enableBatchReservation state variable is set to true by button press
            // C. the current month is in the prior then the selected year month(only current month or future reservation is allowed)
            if ((this.selectedRawMatIndex >= 0) && this.enableBatchReservation && (firstDateOfCurrentMonth <= firstDateOfSelectedMonthYear)) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        ...mapMutations({
            logout: 'logout',
            toggleShowRevision: 'toggleShowRevision'
        })
    },
    template: `
        <div class="container-fluid">
            <br><br><br>
            <div class="row">
                <h3>&nbsp;&nbsp;&nbsp;統義玻璃股份有限公司&nbsp;<small>原料預約進貨作業</small></h3>
            </div>
            <br>
            <div class="row">
                <nav class="navbar navbar-default navbar-fixed-top">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <schedule-selector></schedule-selector>
                            <reservation-form></reservation-form>
                            <ul class="nav navbar-nav navbar-right">
                                <li>
                                    <button type="button" class="btn btn-default navbar-btn" v-bind:class="{active:showRevision}" v-on:click="toggleShowRevision">顯示修改</button>
                                    <button type="button" class="btn btn-default navbar-btn" disabled>輸出</button>
                                    <button type="button" class="btn btn-default navbar-btn" v-on:click="logout">登出</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <batch-reservation v-if="batchReservationReady" :selected-year="selectedYear" :selected-month="selectedMonth">
            </batch-reservation>
            <div class="row">
                <shipment-table></shipment-table>
            </div>
            <div class="row">
                <monthly-memo-bulletin :selected-year="selectedYear" :selected-month="selectedMonth"></monthly-memo-bulletin>
            </div>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
        </div>`
};
