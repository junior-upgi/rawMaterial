import Handlebars from 'handlebars';

import { serverUrl } from '../config.js';

let rawMatData = [
    { CUS_NO: 'FH02', PRD_NO: 'MROPA001', typeId: '0', description: '凡華散裝濕砂' },
    { CUS_NO: 'FH02', PRD_NO: 'MROPA001', typeId: '1', description: '凡華散裝乾砂' },
    { CUS_NO: 'FH02', PRD_NO: 'MROPA001', typeId: '2', description: '凡華太空包裝濕砂' },
    { CUS_NO: 'FH02', PRD_NO: 'MROPA001', typeId: '3', description: '凡華太空包裝乾砂' },
    { CUS_NO: 'HH05', PRD_NO: 'MROPH001', typeId: '0', description: '昊漢純鹼' },
    { CUS_NO: 'DJ02', PRD_NO: 'MROPH001', typeId: '0', description: '東鹼純鹼' },
    { CUS_NO: 'SG01', PRD_NO: 'MROPC001', typeId: '0', description: '欣桂芒硝' },
    { CUS_NO: 'SI13', PRD_NO: 'MROPA003', typeId: '0', description: '盛毅螢石' },
    { CUS_NO: 'GC01', PRD_NO: 'MROPD001', typeId: '0', description: '公昌石灰石' },
    { CUS_NO: 'GC01', PRD_NO: 'MROPD002', typeId: '0', description: '公昌白雲石' },
    { CUS_NO: 'JJ07', PRD_NO: 'MROPA006', typeId: '0', description: '佳集納長石' }
];

export class rawMatSelector {
    constructor(containerId, optionData) {
        this.optionData = optionData.slice();
        this.container = $(containerId);
        this.templateData = {
            selectedYear: this.selectedYear,
            yearList: this.yearList
        };
        let container = this.container;
        let templateData = this.templateData;
        $.get(`${serverUrl}/template/rawMatSelector.hbs`, function(templateHtml) {
            let dataRetrival = new Promise(function(resolve, reject) {
                resolve(rawMatData);
            });
            dataRetrival.then(function(recordset) {
                let compiledTemplate = Handlebars.compile(templateHtml);
                container.html(compiledTemplate(templateData));
                console.log('todo: implement rawMatSelector event handler');
            });
        });
    }
}
