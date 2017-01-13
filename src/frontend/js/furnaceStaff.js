import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';

import { serverUrl } from './config.js';
import { monthList } from './utility.js';

import { Shipment } from './model/shipment.js';

export function furnaceStaffTest() {
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
    let prerequisite = function() {
        return new Promise(function(resolve, reject) {
            initMaterialSelector()
                .then(function() {
                    initYearSelector();
                    initMonthSelector();
                    return loadCurrentData();
                }).then(function(recordset) {
                    console.log(recordset);
                    initFormDateInput();
                    initSubmitButton();
                    initExportButton();
                    initLogoutButton();
                    initAllowedAccessCounter();
                    resolve('prerequisites initialized');
                }).catch(function(error) {
                    reject(error);
                });
        });
    };

    prerequisite()
        .then(function() {
            displayCurrentSchedule();
            $('div#statusMessage').text('初始化完成');
            setTimeout(function() {
                $('div#statusMessage').fadeOut('slow', function() {
                    $(this).text('').show();
                });
            }, 5000);
        }).catch(function(error) {
            console.log('error occured');
        });
}

function initYearSelector() {
    let currentYear = new Date().getFullYear();
    $('li#yearSelector a.dropdown-toggle').html(`${currentYear}&nbsp;<span class="caret"></span>`);
    console.log('TODO: fill year selector with proper data');
    console.log('TODO: yearSelector click handler');
}

function initMonthSelector() {
    let currentMonth = new Date().getMonth();
    $('li#monthSelector a.dropdown-toggle').html(`${monthList[currentMonth]}&nbsp;<span class="caret"></span>`);
    console.log('TODO: monthSelector click handler');
}

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
