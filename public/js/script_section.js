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
    }
    function resetProfilePic() {
        $('#my-profile-pic').attr('src', '/img/users_profile_pics/user_pic_placeholder.png');
        $('#wrp-my-profile-pic label').hide();
        $('#reset-my-profile-pic').attr('value', 1);
    }
    
/********************* CADASTRO DE QUESTÃO *********************/

    // Esconde os spans de erro
    $('.error-feedback').hide();

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

        // Liberação do respectivo formulário
        if($(e.target).attr('id') == 'type-alter' || $(e.target).parent().attr('id') == 'type-alter'){
            $('.hidden').fadeIn(200).css('display', 'flex').removeClass('hidden');
            $('#n-lines').parent().parent().addClass('hidden').hide();
            $('#answer').parent().parent().addClass('hidden').hide();
            $('#quest-type-flag').attr('value', 'alternative');
        }
        else{
            $('.hidden').fadeIn(200).css('display', 'flex').removeClass('hidden');
            $('.alters').parent().parent().addClass('hidden').hide();
            $('#quest-type-flag').attr('value', 'essay');
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
    var allowedFormats = ['bold', 'italic', 'strike', 'underline', 'formula', 'indent', 'list', 'align', 'script']

    var configEnunciado = {
        modules: {
            toolbar: barraSnow,
        },
        theme: 'snow',
        formats: allowedFormats,
    } 
    var configAlter = {
        modules: {
            toolbar: barraBubble,
        },
        theme: 'bubble',
        formats: allowedFormats,
        bounds: '.alternative'
    }

    // Enunciado
    var enunciado = new Quill('#input-statement', configEnunciado);

    // Alternativa correta
    function refreshCorrect(){
        $('#correct').empty().append("<option value=''>-</option>");
        for (let i = 0; i < alt.length; i++){
            let asciiLetter = i + 97; // para definir a letra com ASCII
            $('#correct').append('<option value='+a+'>&#'+asciiLetter+';</option>');
        }
    }

    // Alternativas
    var alt = [];
    var a; // Contador do nº de alternativas
    for(a = 0; a < 4; a++){
        alt.push({
            'number': a,
            'obj': new Quill('.a'+a, configAlter ), 
        });
    }
    refreshCorrect();

    // Adiciona alternativa
    $('#add-alter').on('click', () => {
        let numAlts = $('.alternative').length;
        let asciiLetter = numAlts + 97; // para definir a letra com ASCII
        $('.alters').append(
            '<div class="alternative">'+
                '<span class="letter">&#'+ asciiLetter +';)</span><div class="a'+ (++a) +' simple-box"></div>'+
                '<img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">'+
            '</div>'
        );
        alt.push({
            'number': a,
            'obj': new Quill('.a'+a, configAlter ), 
        });
        refreshCorrect();
        $('.x-alter').on('click', deleteAlternative);
    });

    // Exclui alternativa
    function deleteAlternative(e){
        
        // Seleciona a alternativa
        let alter = $(e.target).siblings('.simple-box');
        
        // Extrai o número da alternativa
        let classes = alter.attr('class').split(/\s+/);
        let nAlt = classes[0];
        nAlt = Number(nAlt.substr(nAlt.length - 1));
        
        // Retira a instância Quill do array
        for(let x = 0; x < alt.length; x++){;
            if(alt[x].number == nAlt){
                alt.splice(x, 1);
                x = alt.length;
            }
        }
        
        // Remove alternativa do DOM
        $(e.target).parent('.alternative').remove();
        
        // Refaz a enumeração com as letras
        let letters = $('.letter');
        for(let i = 0; i < letters.length; i++){
            $(letters[i]).html('&#'+(97+i)+';)');
        }
        refreshCorrect();
    }
    $('.x-alter').on('click', deleteAlternative);
    
    // Escolha da imagem
    $('#quest-img').on('change', getImageName);
    $('.x-img').on('click', removeImage);
    
    function getImageName(e) {
    
        if (e.target.files && e.target.files[0]) {
            let imgName = e.target.files[0].name;
            $('#img-name').html(imgName);
            $('#quest-img-label').html('Alterar imagem');
            $('#quest-img-x').show();
            $('#quest-img-flag').attr('value', 1);
        }
    }
    function removeImage() {
        $('#img-name').html('Nenhuma imagem selecionada');
        $('#quest-img-label').html('Escolher imagem');
        $('#quest-img-x').hide();
        $('#quest-img-flag').attr('value', 0);
    }

    // Envia o formulário via AJAX

    $('#new-quest').on('submit', (e) => {
        e.preventDefault();
        console.log($('#correct').find(':selected').val());
        // Define o tipo de questão de acordo com a que está selecionada
        let questType = '';

        if($('#type-alter').hasClass('selected-type')){
            questType = 'objetiva';
        }
        else if($('#type-essay').hasClass('selected-type')){
            questType = 'dissertativa';
        }

        // Escolhe o que será enviado dependendo do tipo da questão
        // para evitar conflito caso o usuário mude no meio da inserção
        let nLines, answer;
        let altDeltas = [];

        if(questType == 'objetiva'){
            nLines = 1;
            answer = '';
            for (let i = 0; i < alt.length; i++) {
                altDeltas[i] = {
                    delta: JSON.stringify(alt[i].obj.getContents()),
                    order: i
                };
            }
            JSON.stringify(altDeltas);
        }
        else {
            nLines = $('#n-lines').val();
            answer = $('#answer').val();
            altDeltas = '';
        }

        // Trata a alternativa correta de acordo com o tipo da Questão
        let correct;
        if(questType == 'objetiva'){
            correct = $('#correct').find(':selected').val();
        }
        else {
            correct = 'No correct answer for this type of question.';
        }

        // Define os dados que serão enviados para o back-end
        let data = {
            _token: $("#new-quest :input[name='_token']").val(),            // CSRF token
            type: questType,                                                // Tipo da questão
            statement: JSON.stringify(enunciado.getContents()),             // Enunciado. getContents() pega o delta do enunciado.
            options: altDeltas,                                             // Alternativas. Envia os deltas coletados.
            n_lines: nLines,                                                // Número de linhas
            private: $("#new-quest :input[type='radio']:checked").val(),    // Opção de privacidade
            subject_id: $('#subject').find(':selected').val(),              // Disciplina. Envia o id, não o nome.
            content: $('#content-tag').val(),                               // Conteúdo
            other_terms: $('#other-terms').val(),                           // Outros termos
            image: '',                                                      // Imagem
            correct: correct,                                               // Alternativa correta
            answer_suggestion: answer                                       // Sugestão de resposta
        };
        console.log(JSON.stringify(enunciado.getContents()))

        JSON.stringify(data);

        // Posta via AJAX
        $.ajax({
            url: '/store_question',
            type: 'post',
            data: data,
            dataType: 'json',
            error: (jqXHR, textStatus, errorThrown) => {
                // Reseta os spans de erro
                $('.error-feedback').hide().html('');
                $('.error-feedback').parent().css({background: 'transparent'});
                
                // Exibe os erros e colore as divs
                var response = jqXHR.responseJSON;
                for (let key in response.errors) {
                    $('#error-'+key).html(response.errors[key]).fadeIn(300);
                    $('#error-'+key).parent().animate({backgroundColor: 'rgb(255, 190, 190)'}, 300);
                }
            }
        });
    
    });
    
    /******************************************************************** */
    /******************************************************************** */
    /******************************************************************** */

    
});
