<template>
    <span>
        <button class="btn btn-primary" style="border:0px;" @click="prevMonth">
            <span class="glyphicon glyphicon-triangle-left"></span>
        </button>
        &nbsp;{{workingYear}} 年 {{workingMonth}} 月份
        <button class="btn btn-primary" style="border:0px;" @click="nextMonth">
            <span class="glyphicon glyphicon-triangle-right"></span>
        </button>
    </span>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'workingTimeSelector',
        computed: {
            ...mapGetters({
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            })
        },
        methods: {
            ...mapActions({
                nextWorkingMonth: 'nextWorkingMonth',
                prevWorkingMonth: 'prevWorkingMonth'
            }),
            ...mapMutations({
                dataInitialization: 'dataInitialization'
            }),
            nextMonth: function() {
                this.nextWorkingMonth()
                    .then((responseList) => {
                        this.dataInitialization(responseList);
                    })
                    .catch((error) => {
                        console.log(error.errorMessage);
                    });
            },
            prevMonth: function() {
                this.prevWorkingMonth()
                    .then((responseList) => {
                        this.dataInitialization(responseList);
                    })
                    .catch((error) => {
                        console.log(error.errorMessage);
                    });
            }
        }
    };

</script>
