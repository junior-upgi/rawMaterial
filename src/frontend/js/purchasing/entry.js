import titleComponent from './component/title.js';

export default {
    name: 'purchasingComponent',
    components: {
        'title-component': titleComponent
    },
    data: function() {
        return {};
    },
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3 col-lg-2">
                    <nav class="navbar navbar-default navbar-fixed-side">
                        <title-component></title-component>
                        <!-- normal collapsible navbar markup -->
                    </nav>
                </div>
                <div class="col-sm-9 col-lg-10">
                    <div class="row" style="padding-top:80px;">採購模組BODY</div>
                </div>
            </div>
        </div>`
};
