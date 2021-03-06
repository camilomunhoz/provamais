$(document).ready(function(){

    /****** Slider ******/

    let atual = 0; // indica o nº do slide atual
    const N_SLIDES = 5;

    $('.frases-wrp').children().hide();  // esconde todas as frases
    $('#slider').find('img').hide();     // esconde todas as figuras

    function changeSlide(trigger){
        
        $('.d'+atual).animate({opacity:0.2});
        $('.f'+atual).hide();
        $('.s'+atual).hide();
        
        if(atual==0||trigger=='right-arrow'){ // esse 'atual==0' é para fazer o carregamento do primeiro slide
            atual++;
            if(atual==N_SLIDES+1){ // se não há mais à direita, vai ao primeiro
                atual = 1;
            }
        }
        else if(trigger=='left-arrow'){
            atual--;
            if(atual==0){ // se não há mais à esquerda, vai ao último
                atual = N_SLIDES;
            }
        }

        $('.d'+atual).animate({opacity:1});
        $('.f'+atual).fadeIn(400);
        $('.s'+atual).fadeIn(400);
    }
    changeSlide();

    $('#left-arrow').on('click', () => {changeSlide('left-arrow')});
    $('#right-arrow').on('click', () => {changeSlide('right-arrow')});

    setInterval(() => {
        changeSlide('right-arrow');
    }, 5000);


    /****** fim slider ******/
    
    /****** Overlay de login e cadastro ******/

    let overlayEffectDuration = 500;
    var color1 = 'rgb(250,250,250)';

    function showOverlay(event){
        $('#wrp-overlay').animate({left:0}, overlayEffectDuration);
        $('#wrp-overlay').animate({backgroundColor: color1}, overlayEffectDuration-300);
        $('#entrada').animate({left:'333.33%'}, overlayEffectDuration);
        $('#wrp-login').hide();
        $('#wrp-signup').hide();
        $('.io1').delay(overlayEffectDuration).show().animate({left:'-50px'});
        $('.io2').delay(overlayEffectDuration).show().animate({right:'-50px'});
        if(event.target.id=='btn-go-login'){
            showLoginDialog();
        }
        else if(event.target.id=='btn-go-signup'){
            showSignUpDialog();
        }
    }
    function hideOverlay(){
        $('#wrp-overlay').animate({left:'-100%'}, overlayEffectDuration);
        $('#entrada').animate({left:0}, overlayEffectDuration/1.4);
        $('#wrp-overlay').animate({backgroundColor: 'white'}, 0);
        $('.io1').hide(200).animate({left:'-100%'});
        $('.io2').hide(200).animate({right:'-200%'});
    }
    function showLoginDialog(){
        $('#wrp-login').delay(overlayEffectDuration-200).fadeIn();
    }
    function showSignUpDialog(){
        $('#wrp-signup').delay(overlayEffectDuration-200).fadeIn();
    }
        
    $('.icon-question').hover( () => $('.info-box').show() , () => $('.info-box').hide() );
    $('.info-box').hover( () => $('.info-box').show() ,  () => $('.info-box').hide() );
    $('#btn-go-login').on('click', showOverlay);
    $('#btn-go-signup').on('click', showOverlay);
    $('#voltar').on('click', hideOverlay);
    $('#x-voltar').on('click', hideOverlay);

    /****** fim overlay login cadastro ******/

    /****** Conheça - Responsividade Mobile ******/
    
    function showInfo(){
        let frases = [
            'Crie provas rapidamente.',
            'Organize suas questões.',
            'Desfrute de um banco de questões colaborativo.',
            'Contribua com a comunidade acadêmica e escolar.',
            'Agilize sua produção de material.',
        ];

        for(let i = 0; i<frases.length; i++){
            $('#wrp-homepage').append(
                '<div class="info">'+
                    '<span>'+frases[i]+'</span>'+
                    '<img src="/img/hmpg/'+(i+1)+'.png">'+
                '</div>'
            );
        }            
        $('#wrp-homepage').append(
            '<footer><img id="logo-footer" src="/img/logo.svg">'+
            '<a href=#entrada><img class="go-arrow back-arrow" src="/img/hmpg/down-arrow.svg"></a></footer>'
        );
        $('#conheca').html('<img class="go-arrow" src="/img/hmpg/down-arrow.svg" alt="">');
        $('#conheca').off('click');
    }
    $('#conheca').on('click', showInfo);
    
    /****** fim responsividade Mobile ******/

    $('form').on('submit', () => {
        $('body').css('cursor', 'progress');
        $('#btn-login, #btn-signup').css({
            userSelect: 'none',
            pointerEvents: 'none',
            opacity: '.6',
        });
    });

    $('#terms-of-use').on('change', () => {
        if ($('#terms-of-use')[0].checked) {
            $('#btn-signup').css({
                userSelect: 'all',
                pointerEvents: 'all',
                opacity: '1',
            });
        }
        else {
            $('#btn-signup').removeAttr('style');
        }
    });

    // function checkSignupInputs() {
    //     for (let i of $('#form-signup input')) {
    //         if(i.value == '') {
    //             $('#btn-signup').css({
    //                 userSelect: 'none',
    //                 pointerEvents: 'none',
    //                 opacity: '.6',
    //             });
    //             return true;
    //         }
    //         $('#btn-signup').removeAttr('style');
    //         return false;
    //     }
    // }
    // checkSignupInputs();
    // $('#form-signup input').on('change', () => {checkSignupInputs()});
    // $('#form-signup input').on('input', () => {checkSignupInputs()});

})