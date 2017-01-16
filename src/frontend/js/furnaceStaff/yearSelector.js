import Handlebars from 'handlebars';

import { serverUrl } from '../config.js';

export class YearSelector {
    constructor(containerId, yearList) {
        this.currentYear = new Date().getFullYear();
        this.selectedYear = this.currentYear;
        this.yearList = yearList.slice();
        this.container = $(containerId);
        this.templateData = {
            selectedYear: this.selectedYear,
            yearList: this.yearList
        };
        let container = this.container;
        let templateData = this.templateData;
        $.get(`${serverUrl}/template/yearSelector.hbs`, function(templateHtml) {
            let compiledTemplate = Handlebars.compile(templateHtml);
            container.html(compiledTemplate(templateData));
            console.log('todo: implement yearSelector event handler');
        });
    }
}
