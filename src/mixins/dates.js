export default {
    computed:{
        currentMonth(){
            const fecha = new Date();
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses[fecha.getMonth()]
        },
    },
    methods:{
        dateFormat(date){
            if(date!=undefined){
                const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return date.slice(0,2) + ' ' + meses[(date.slice(3,5)*1)-1] + ' ' + date.slice(6,10)
            }   
        },
        monthFormat(month){
            if(month!=undefined){
                const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                return meses[(month*1)-1]
            }   
        }
    }
}