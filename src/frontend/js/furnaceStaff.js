import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';

import { serverUrl, validateTokenUrl } from './config.js';
import { monthList } from './utility.js';

export function furnaceStaffTest() {
    $.ajax({
        method: 'get',
        url: validateTokenUrl(),
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
    initYearSelector();
    initMonthSelector();
    initMaterialSelector();
    initFormDateInput();
    initSubmitButton();
    initExportButton();
    initLogoutButton();
    initAllowedAccessCounter();
}

function initYearSelector() {
    let currentYear = new Date().getFullYear();
    $('li#yearSelector a.dropdown-toggle').html(`${currentYear}&nbsp;<span class="caret"></span>`);
    console.log('TO-DO: fill year selector with proper data');
    console.log('TO-DO: yearSelector click handler');
}

function initMonthSelector() {
    let currentMonth = new Date().getMonth();
    $('li#monthSelector a.dropdown-toggle').html(`${monthList[currentMonth]}&nbsp;<span class="caret"></span>`);
    console.log('TO-DO: monthSelector click handler');
}

function initMaterialSelector() {
    // get data without pricing property
    let rawMatDataRequest = $.ajax({
        method: 'get',
        url: `${serverUrl()}/rawMaterialList`,
        headers: { 'x-access-token': sessionStorage.token }
    });
    rawMatDataRequest
        .done(function(rawMatList) {
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
        }).fail(function(error) {
            alert(`原料選項初始化發生錯誤: ${error}`);
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
    $('form#purchaseRequest').off('submit').on('submit', function(event) {
        if ($('form#purchaseRequest')[0].checkValidity()) {
            event.preventDefault();
            console.log('TO-DO: implement submit button submission action');
        }
    });
}

function initExportButton() {
    $('button#exportButton').off('click').on('click', function() {
        console.log('TO-DO: implement export excel data button action');
    });
}

function initLogoutButton() {
    $('button#logoutButton').off('click').on('click', function() {
        sessionStorage.removeItem('token');
        window.location.assign(`${serverUrl()}/index.html`);
    });
}

function initAllowedAccessCounter() {
    $('span#accessExpDisplay').text(accessExp().format('HH:mm'));
}

function accessExp() {
    return moment.unix(decode(sessionStorage.token).exp);
}
