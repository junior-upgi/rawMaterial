import Vue from 'vue';
import VueResource from 'vue-resource';
import { mapGetters, mapMutations } from 'vuex';
Vue.use(VueResource);

import { store } from '../store/store.js';

import { scheduleSelector } from './scheduleSelector.js';
import { reservationForm } from './reservationForm.js';
import { shipmentTable } from './shipmentTable.js';

export default {
    name: 'furnaceComponent',
    store: store,
    components: {
        'schedule-selector': scheduleSelector,
        'reservation-form': reservationForm,
        'shipment-table': shipmentTable
    },
    computed: { ...mapGetters({ showRevision: 'getShowRevision' }) },
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
                <h2>&nbsp;&nbsp;&nbsp;統義玻璃股份有限公司&nbsp;<small>原料預約進貨作業</small></h2>
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
            <div class="row">
                <shipment-table></shipment-table>
            </div>
        </div>`
};

// import moment from 'moment-timezone';

// import { YearSelector } from './yearSelector.js';
// import { MonthSelector } from './monthSelector.js';
// import { NotificationDisplay } from './notificationDisplay';

// import { serverUrl } from '../config.js';

// import { Shipment } from '../model/shipment.js';

/*
export function furnaceStaffValidate() {
    $.ajax({
        method: 'get',
        url: `${serverUrl}/validate`,
        headers: { 'x-access-token': sessionStorage.token }
    }).done(function(response) {
        if (response.error !== null) {
            alert('使用權限認證發生錯誤，請重新登入');
            sessionStorage.removeItem('token');
            window.location.assign(window.location);
        }
    }).fail(function(error) {
        console.log(error);
        if (error.responseJSON.error === 'jwt expired') {
            alert('使用權限認證過期，請重新登入');
            sessionStorage.removeItem('token');
            window.location.assign(window.location);
        } else {
            alert('使用權限認證發生錯誤，請重新登入');
            sessionStorage.removeItem('token');
            window.location.assign(window.location);
        }
    });
}

export function furnaceInitInterface() {
    // let notificationDisplay = new NotificationDisplay('body', '系統初始化...');
    // console.log('todo: ajax for actual year list that has data');
    // let yearSelector = new YearSelector('li#yearSelector.dropdown', [{ year: 2015 }, { year: 2016 }, { year: 2017 }]);
    // let monthSelector = new MonthSelector('li#monthSelector.dropdown');
}
*/

/*
function loadCurrentData() {
    return new Promise(function(resolve, reject) {
        let currentYear = new Date().getFullYear().toString();
        let currentMonth = (new Date().getMonth() + 1).toString();
        $.ajax({
            method: 'get',
            url: `${serverUrl}/shipment/${currentYear}/${currentMonth}`,
            headers: { 'x-access-token': sessionStorage.token }
        }).done(function(recordset) {
            let schedule = [];
            recordset.forEach(function(record) {
                schedule.push(new Shipment(record.date, record.CUS_NO, record.PRD_NO, record.typeID, record.quantity));
            });
            resolve(schedule);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        });
    });
}

function initMaterialSelector() {
    // disable keypresses, and only allow user to change this field through the button selector
    $('input#NAME').on('keypress', function(event) {
        event.preventDefault();
    });
    // get data without pricing property
    return new Promise(function(resolve, reject) {
        $.ajax({
            method: 'get',
            url: `${serverUrl}/rawMaterialList`,
            headers: { 'x-access-token': sessionStorage.token },
            success: function(rawMatList) {
                console.log(rawMatList);
                rawMatList.forEach(function(rawMat) { // fill data
                    if (rawMat.display === true) {
                        if (rawMat.type.length > 1) {
                            $('ul.rawMaterial').append(`<li><a class="dropdown-header">${rawMat.NAME}</a></li>`);
                            rawMat.type.forEach(function(rawMatType) {
                                if (rawMatType.display === true) {
                                    $('ul.rawMaterial').append('<li><a class="rawMaterial current"></a></li>');
                                    $('a.current').attr('id', `${rawMat.PRD_NO} ${rawMatType.id}`);
                                    $('a.current').html(`&nbsp;&nbsp;&nbsp;${rawMatType.spec}`);
                                    $('a.current')
                                        .data('NAME', `${rawMatType.NAME} ${rawMatType.spec}`)
                                        .data('PRD_NO', rawMat.PRD_NO)
                                        .data('typeID', rawMatType.id);
                                    $('a.current').removeClass('current');
                                }
                            });
                        } else {
                            $('ul.rawMaterial').append('<li><a class="rawMaterial current"></a></li>');
                            $('a.current').attr('id', `${rawMat.PRD_NO} 0`);
                            $('a.current').html(`${rawMat.NAME}`);
                            $('a.current')
                                .data('NAME', `${rawMat.type[0].NAME} ${rawMat.type[0].spec}`)
                                .data('PRD_NO', rawMat.PRD_NO)
                                .data('typeID', 0);
                            $('a.current').removeClass('current');
                        }
                    }
                });
                // handler for the material selector
                $('ul.rawMaterial li a.rawMaterial').off('click').on('click', function(event) {
                    event.preventDefault();
                    $('input#NAME').val($(this).data('NAME'));
                    $('input#PRD_NO').val($(this).data('PRD_NO'));
                    $('input#typeID').val($(this).data('typeID'));
                });
                resolve('materialSelector initialized');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(`原料選項初始化發生錯誤: ${errorThrown}`);
            }
        });
    });
}

function initFormDateInput() {
    $('input#requestDate').off('change').on('change', function() {
        let limit = moment(moment(), 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days');
        let requestDate = moment($(this).val(), 'YYYY-MM-DD');
        if (requestDate < limit) {
            alert('不能選取昨天以前的日期進貨，日期選項將重設');
            $(this).val('');
        }
    });
}

function initSubmitButton() {
    $('button#submitButton').on('click', function() {
        $('input#NAME')
            .prop('readonly', false)
            .on('blur', function() {
                $(this).prop('readonly', true);
            });
    });
    $('form#purchaseRequest').off('submit').on('submit', function(event) {
        if ($('form#purchaseRequest')[0].checkValidity()) {
            event.preventDefault();
            console.log('TODO: implement submit button submission action');
        }
    });
}

function initExportButton() {
    $('button#exportButton').off('click').on('click', function() {
        console.log('TODO: implement export excel data button action');
    });
}

function initLogoutButton() {
    $('button#logoutButton').off('click').on('click', function() {
        sessionStorage.clear();
        window.location.replace(`${serverUrl}/index.html`);
    });
}

function initAllowedAccessCounter() {
    $('span#accessExpDisplay').text(accessExp().format('HH:mm'));
}

function accessExp() {
    return moment.unix(decode(sessionStorage.token).exp);
}

function displayCurrentSchedule() {
    console.log('TODO: display schedule of current month');
}
*/
