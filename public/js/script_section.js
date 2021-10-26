$(document).ready(function(){

/*** Abre e fecha overlay de diálogo ***/
    
    $('.cancel-action').on('click', () => {
        $('.cancel-overlay').fadeIn(200).css('display', 'flex');
    });
    
    $('.confirmation-btn-hard').on('click', () => {
        $('.cancel-overlay').fadeOut(200);
    });

    
});
