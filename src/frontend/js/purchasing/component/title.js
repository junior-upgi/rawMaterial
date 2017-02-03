export default {
    name: 'titleComponent',
    data: function() {
        return {
            pageTitle: '統義玻璃股份有限公司',
            subtitle: '原料採購下單作業'
        };
    },
    template: `
        <div>
            <h3>{{ pageTitle }}</h3>
            <h5>{{ subtitle }}</h5>
        </div>`
};
