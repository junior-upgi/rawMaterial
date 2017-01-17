import Handlebars from 'handlebars';
import { decode } from 'jsonwebtoken';
import moment from 'moment-timezone';

import { serverUrl } from '../config.js';

export class NotificationDisplay {
    constructor(containerId, initMessage) {
        this.container = $(containerId);
        this.curTimerDuration = 3000;
        this.lastMessage = initMessage;
        this.templateData = {
            message: this.lastMessage,
            accessExp: moment.unix(decode(sessionStorage.token).exp).format('HH:mm')
        };
        let curTimerDuration = this.curTimerDuration;
        let container = this.container;
        let templateData = this.templateData;
        $.get(`${serverUrl}/template/notificationDisplay.hbs`, function(templateHtml) {
            let compiledTemplate = Handlebars.compile(templateHtml);
            container.append(compiledTemplate(templateData));
            setTimeout(function() {
                $('span#statusMessage').fadeOut('slow', function() {
                    $('span#statusMessage').empty().fadeIn();
                });
            }, curTimerDuration);
            console.log('todo: implement notificationDisplay methods');
        });
    }
}
