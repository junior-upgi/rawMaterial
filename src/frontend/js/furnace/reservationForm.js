import moment from 'moment-timezone';
import Vue from 'vue';
import VueResource from 'vue-resource';
import { mapGetters, mapMutations, mapActions } from 'vuex';

import { store } from '../store/store.js';
Vue.use(VueResource);

export let reservationForm = {
    name: 'reservationForm',
    store: store,
    computed: {
        ...mapGetters({
            showRevision: 'getShowRevision',
            rawMatList: 'getRawMatList'
        })
    },
    data: function() {
        return {
            selectedRawMatIndex: null,
            quantity: null,
            requestDate: null
        };
    },
    created: function() { this.updateRawMatList(); },
    methods: {
        ...mapMutations({ rawMatSelected: 'rawMatSelected' }),
        ...mapActions({
            updateRawMatList: 'updateRawMatList',
            scheduleNewShipment: 'scheduleNewShipment'
        }),
        checkDateValidity: function() {
            let limit = moment(moment(), 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days');
            let requestDate = moment(this.requestDate, 'YYYY-MM-DD');
            if (requestDate <= limit) {
                alert('不能預約過去的日期進貨，選項將重置');
                this.requestDate = '';
            }
        },
        makeReservation: function($event) {
            if (document.getElementById('reservationForm').checkValidity()) {
                this.scheduleNewShipment({
                    type: 'scheduleNewShipment',
                    requestDate: this.requestDate,
                    CUS_NO: this.rawMatList[this.selectedRawMatIndex].CUS_NO,
                    PRD_NO: this.rawMatList[this.selectedRawMatIndex].PRD_NO,
                    typeId: this.rawMatList[this.selectedRawMatIndex].typeId,
                    quantity: this.quantity
                });
            }
            $event.preventDefault();
            this.selectedRawMatIndex = -1;
            this.rawMatSelected();
            this.quantity = '';
            this.requestDate = '';
        }
    },
    template: `
        <form id="reservationForm" class="navbar-form navbar-left" v-on:submit.prevent>
            <select class="form-control xs-col-12" v-model="selectedRawMatIndex" v-on:change="rawMatSelected(selectedRawMatIndex)" required >
                <option value="-1"></option>
                <option v-for="(rawMat, index) in rawMatList" v-bind:value="index">
                    【{{rawMat.CUS_SNM}}】{{rawMat.PRDT_SNM}} {{rawMat.specification}}
                </option>
            </select>
            <input type="date" class="form-control" required v-model="requestDate" v-on:change="checkDateValidity" required />
            <input type="number" class="form-control" placeholder="數量" min="1" v-model="quantity" required />
            <button type="submit" class="btn btn-default" v-on:click="makeReservation">預約</button>
        </form>`
};
