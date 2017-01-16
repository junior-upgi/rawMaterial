import Handlebars from 'handlebars';

import { serverUrl } from '../config.js';

export class MonthSelector {
    constructor(containerId) {
        this.monthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        this.currentMonth = new Date().getMonth();
        this.selectedMonth = this.currentMonth;
        this.container = $(containerId);
        this.templateData = {
            selectedMonth: this.selectedMonth,
            monthList: this.monthList
        };
        let container = this.container;
        let templateData = this.templateData;
        $.get(`${serverUrl}/template/monthSelector.hbs`, function(templateHtml) {
            let compiledTemplate = Handlebars.compile(templateHtml);
            container.html(compiledTemplate(templateData));
            console.log('todo: implement monthSelector event handler');
        });
    }
}
