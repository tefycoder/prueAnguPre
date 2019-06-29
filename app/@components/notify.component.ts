declare var $: any;
export class ShowNotify {
    notify(type:string, message:string){
        $.notify({
            icon: 'add_alert',
            message: message      
            },{
            type: type,
            timer: 4000,
            placement: {
            from: 'top',
            align: 'right'
            }
            });
    }
}
