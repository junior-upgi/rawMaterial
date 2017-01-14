import { Handlebars } from 'handlebars';

import { serverUrl } from '../config.js';

export class YearSelector {
    constructor(containerId, yearList) {
        this.currentYear = new Date().getFullYear();
        this.selectedYear = this.currentYear;
        this.yearList = yearList.slice();
        this.container = $(containerId);
        // this.dropdownMenu = $('li#yearSelector ul');
        // this.dropdownToggle = $('li#yearSelector a');
        this.templateData = {
            selectedYear: this.selectedYear,
            yearList: this.yearList
        };
        $.get(`${serverUrl}/template/yearSelector.hbs`, function(templateHtml) {
            this.template = templateHtml;
            this.compiledTemplate = Handlebars.compile(templateHtml);
            this.container.html(this.compiledTemplate(this.templateData));
            console.log('todo: implement event handler');
        });
    }
}
