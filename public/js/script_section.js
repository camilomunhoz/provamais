$(document).ready(function(){

/*** Abre e fecha overlay de diálogo ***/
    
    $('.cancel-action').on('click', () => {
        $('.cancel-overlay').fadeIn(200).css('display', 'flex');
    });
    
    $('.confirmation-btn-hard').on('click', () => {
        $('.cancel-overlay').fadeOut(200);
    });

/*** Preview da imagem de perfil ***/

    $('#my-profile-alterpic').on('change', previewProfilePic);
    $('#reset-my-profile-pic').on('change', resetProfilePic);
    
    function previewProfilePic(e) {
    
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                $('#my-profile-pic').attr('src', e.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
            if(!$('#reset-my-profile-pic').length){
                $('#wrp-my-profile-pic').append(
                    '<input type="checkbox" id="reset-my-profile-pic" name="resetpic" title="Remover foto de perfil" value=false>'+
                    '<label for="reset-my-profile-pic"><img src="/img/icons/ico_plus.svg" alt="X"></label>'
                );
            }
            else{
                $('#wrp-my-profile-pic label').show();
            }
            $('#reset-my-profile-pic').attr('value', false);
            $('#reset-my-profile-pic').on('change', resetProfilePic);
        }
    }
    function resetProfilePic() {
        $('#my-profile-pic').attr('src', '/img/users_profile_pics/user_pic_placeholder.png');
        $('#wrp-my-profile-pic label').hide();
        $('#reset-my-profile-pic').attr('value', true);
    }
    
/********************* CADASTRO DE QUESTÃO *********************/

    // Seleção do tipo
    $('.quest-type').on('click', (e) => {
        let classes = e.target.className;
        classes = classes.split(' ');
        
        // if-else para não dar problema quando clicar nos elementos filhos
        if(classes[0] == 'quest-type'){
            $(e.target).addClass('selected-type');
            $(e.target).removeClass('unselected-type');
            $(e.target).siblings().removeClass('selected-type');
            $(e.target).siblings().addClass('unselected-type');
        }
        else {
            $(e.target).parent().addClass('selected-type');
            $(e.target).parent().removeClass('unselected-type');
            $(e.target).parent().siblings().removeClass('selected-type');
            $(e.target).parent().siblings().addClass('unselected-type');
        }
    });

    // Quill config
    var barraSnow = [
        ['bold', 'italic', 'underline', 'strike'],['clean'],
        [{'script':'super'}, {'script':'sub'}],
        [{'align':[]}, {'indent':'-1'}, {'indent':'+1'}],
        [{'list':'ordered'},{'list':'bullet'}],
        ['formula'],
    ]
    var barraBubble = [
        ['bold'], ['italic'], ['underline'], ['strike'], ['formula']
    ]
    var configEnunciado = {
        modules: {
            toolbar: barraSnow,
        },
        theme: 'snow',
    }
    var configAlter = {
        modules: {
            toolbar: barraBubble,
        },
        theme: 'bubble',
    }

    // Enunciado
    var enunciado = new Quill('#input-statement', configEnunciado);

    // Alternativas
    var alt = [];
    var a; // Contador do nº de alternativas
    for(a = 0; a < 4; a++){
        alt.push({
            'number': a,
            'obj': new Quill('.a'+a, configAlter ), 
        });
    }

    // Escolha da imagem
    $('#quest-img').on('change', getImageName);
    $('.x-img').on('click', removeImage);
    
    function getImageName(e) {
    
        if (e.target.files && e.target.files[0]) {
            let imgName = e.target.files[0].name;
            $('#img-name').html(imgName);
            $('#quest-img-label').html('Alterar imagem');
            $('#quest-img-x').show();
            $('#quest-img-flag').attr('value', true);
        }
    }
    function removeImage() {
        $('#img-name').html('Nenhuma imagem selecionada');
        $('#quest-img-label').html('Escolher imagem');
        $('#quest-img-x').hide();
        $('#quest-img-flag').attr('value', false);
    }
    
});
