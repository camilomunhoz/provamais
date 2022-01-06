$(document).ready(function(){
    
    $('#my-profile-alterpic').on('change', previewProfilePic);
    $('#reset-my-profile-pic').on('change', resetProfilePic);

    /*** Preview da imagem de perfil ***/    
    function previewProfilePic(e) {

        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].size < 1024*100) {
                var reader = new FileReader();
    
                reader.onload = function (e) {
                    $('#my-profile-pic').attr('src', e.target.result);
                }
                reader.readAsDataURL(e.target.files[0]);
                if(!$('#reset-my-profile-pic').length){
                    $('#wrp-my-profile-pic').append(
                        '<input type="checkbox" id="reset-my-profile-pic" name="resetpic" title="Remover foto de perfil" value="0">'+
                        '<label for="reset-my-profile-pic"><img src="/img/icons/ico_plus.svg" alt="X"></label>'
                    );
                }
                else{
                    $('#wrp-my-profile-pic label').show();
                }
                $('#reset-my-profile-pic').attr('value', 0);
                $('#reset-my-profile-pic').on('change', resetProfilePic);
            }
            else {
                alert('Por limitações temporárias do servidor, pedimos que a imagem não exceda 100kb.');
            }
        }
    }

    /*** Reset da imagem de perfil ***/    
    function resetProfilePic() {
        $('#my-profile-pic').attr('src', '/img/users_profile_pics/user_pic_placeholder.png');
        $('#wrp-my-profile-pic label').hide();
        $('#reset-my-profile-pic').attr('value', 1);
    }

    /*** Bloqueia botão de envio quando envia ***/    
    $('#my-profile').on('submit', () => { 
        $('.save-btn').css({pointerEvents: 'none', userSelect: 'none', opacity: '.4', cursor: 'default'}).attr('type', 'button');
        $('body').css('cursor', 'progress');
    });

    /***********************************************/
    /***************** Tip de ajuda ****************/
    /***********************************************/

    $('#info-pix').on('mouseenter', () => { $('#info-pix .tip-msg').show() } )
    $('#info-pix').on('mouseleave', () => { $('#info-pix .tip-msg').hide() } )
});