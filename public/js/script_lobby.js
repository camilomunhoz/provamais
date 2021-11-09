$(document).ready(function(){

    /*** Fecha banners ***/
    
    $('.btn-close-banner').on('click', () => {
        $('.banner').slideUp(200);
    });
    $('.hello').on('click', () => {
        $('.help-tip').css('display', 'flex');
    });

    /*** Abre overlay do nav de perfil ***/
    
    $('#profile').on('click', showOverlay);
    $('.close-nav-2').on('click', hideOverlay);

    function showOverlay(){
        $('#profile').off('click');
        setTimeout(() => { $('#profile').on('click', hideOverlay) }, 210);
        $('.nav-1').hide();
        $('.nav-2').slideDown(400).css('display', 'flex');
        $('nav').animate({backgroundColor: 'rgb(0, 20, 50)'}, 200);
        $('.arrow').hide();
    }

    function hideOverlay(){
        $('#profile').off('click');
        setTimeout(() => { $('#profile').on('click', showOverlay) }, 210);
        $('.nav-2').hide();
        $('.nav-1').slideDown(400).css('display', 'flex');
        $('nav').animate({backgroundColor: 'rgb(15, 59, 109)'}, 200);
        $('.arrow').show();
    }

    /*** Fecha diálogo de ajuda ***/

    $('.close-help-tip').on('click', () => {
        $('.help-tip').slideUp(200);
    });
    
});