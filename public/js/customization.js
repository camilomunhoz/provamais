$(document).ready(function() {

    /**************************************************************/
    /******************** Exibe imagem clicada ********************/
    /**************************************************************/

    function showImage(e) {
        if ($(e.target).hasClass('delete-img')) {
            return false;
        }
        if ($(e.currentTarget).children('.image img:first-of-type').css('display') == 'none') {
            $(e.currentTarget).children('.image img:first-of-type').slideDown(200);
            setTimeout(() => {
                $(e.currentTarget).children('.image img:first-of-type').css('display', 'block').animate({opacity: 1}, 200);
            }, 220)
        }
        else {
            $(e.currentTarget).children('.image img:first-of-type').slideUp(200);
            setTimeout(() => {
                $(e.currentTarget).children('.image img:first-of-type').css('opacity', '0');
            }, 220)
        }
    }

    /*******************************************************************/
    /******************** Exibe a instrução clicada ********************/
    /*******************************************************************/

    function showInstruction(e) {
        if ($(e.target).hasClass('delete-instruction')) {
            return false;
        }
        if ($(e.currentTarget).children('.instruction ul').css('display') == 'none') {
            $(e.currentTarget).children('.instruction ul').slideDown(200);
        }
        else {
            $(e.currentTarget).children('.instruction ul').slideUp(200);
        }
    }

    /**************************************************************/
    /************** Exibe overlay de adição de imagem *************/
    /**************************************************************/

    $('#section-images .add').on('click', (e) => {
        if ($('#overlay-add-image').css('display') == 'none') {
            $('#overlay-add-image').slideDown(200);
        }
        else {
            $('#overlay-add-image').slideUp(200);
        }
    });

    /********* Escolha da imagem *********/
    $('#img').on('change', setImage);
    $('.x-img').on('click', removeImage);
    var image = '';
    
    function setImage(e) {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].size < 1024*100) {
                // Colocando elementos estéticos como o nome da imagem
                let imgName = e.target.files[0].name;
                $('#img-name').html(imgName);
                $('#img-label').html('Alterar imagem');
                $('#img-x').show();
                $('#img-flag').attr('value', 1);

                // Salvando imagem para enviar posteriormente
                image = e.target.files[0];

                // Desbloqueando o botão de salvar
                $('#save-img').css({opacity: 1, pointerEvents: 'all', userSelect: 'all'});
            }
            else {
                alert('Por limitações temporárias do servidor, pedimos que a imagem não exceda 100kb.');
            }
        }
    }
    function removeImage() {

        // Remove os elementos estéticos
        $('#img-name').empty().html('Nenhuma imagem selecionada');
        $('#img-label').html('Escolher imagem');
        $('#img-x').hide();
        $('#img-flag').attr('value', 0);

        // Zera a variável que guarda a imagem
        image = '';

        // Bloqueando o botão de salvar
        $('#save-img').css({opacity: '.5', pointerEvents: 'none', userSelect: 'none'});
    }

    /**************************************************************/
    /******************** Salva imagem via AJAX *******************/
    /**************************************************************/

    function saveImage() {
        $('#img-label').css({opacity: '.5', pointerEvents: 'none', userSelect: 'none'});
        $('#save-img').css({opacity: '.5', pointerEvents: 'none', userSelect: 'none'});
        $('body').css('cursor', 'progress');
        $('#save-img').off('click');

        // Define os dados que serão enviados para o back-end
        let formData = new FormData();
        formData.append("image", image);
        formData.append("image_flag", $('#img-flag').val());

        // Posta via fetch() (AJAX)
        fetch('/customization/store/img',{
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': $("#overlay-add-image :input[name='_token']").val(),
                accept: 'application/json',
                contentType: 'application/json',
            },
            body: formData,
        }).then( response => {
            return response.json();
        }).then( response => {
            $('body').css('cursor', 'default');
            $('.image:not(#default-img)').remove();
            for (let i of response) {
                insertImage(i);
            }
            $('.image').off('click');
            $('.image').on('click', (e) => {showImage(e)});
            $('#save-img').on('click', saveImage);
            removeImage();
            $('#img-label').removeAttr('style');
        });
    }
    $('#save-img').on('click', saveImage);

    /**************************************************************/
    /****************** Insere as imagens no DOM ******************/
    /**************************************************************/

    function insertImage(img) {
        $('#images').append(
            '<div class="image simple-box">'+
                '<div class="arrow-down"></div>'+
                '<div class="image-title">'+img.client_name+'</div>'+
                '<img src="/img/headers/'+img.name+'">'+
                '<img src="/img/icons/ico_plus.svg" class="x x-img delete-img" data-img-id="'+img.id+'" title="Apagar">'+
            '</div>'
        ).hide().fadeIn(200);
        $('.delete-img[data-img-id="'+img.id+'"]').on('click', () => {deleteImage(img.id)});
    }
    if (images.length > 0) {
        for (let i of images) {
            console.log(i)
            insertImage(i);
        }
    }
    $('.image').on('click', (e) => {showImage(e)});

    /**************************************************************/
    /************************ Deleta imagens **********************/
    /**************************************************************/

    function deleteImage(id) {
        $('.delete-img[data-img-id="'+id+'"]').off('click');
        $('body').css('cursor', 'progress');

        $.get('/customization/remove/img/'+id, (data) => {
            $('body').css('cursor', 'default');
            $('.delete-img[data-img-id="'+id+'"]').parent().slideUp(200);
            setTimeout(() => {$('.delete-img[data-img-id="'+id+'"]').parent().remove()}, 220);
        });
    }

    
    /**************************************************************/
    /************ Exibe overlay de adição de instruções ***********/
    /**************************************************************/

    $('#section-instructions .add').on('click', (e) => {
        if ($('#overlay-add-instruction').css('display') == 'none') {
            $('#overlay-add-instruction').slideDown(200);
            $('#inputs-instruction textarea').trigger('input');
            $('#instruction-name').focus();
        }
        else {
            $('#overlay-add-instruction').slideUp(200);
        }
    });

    /**************************************************************/
    /************* Lógica para inserção das instruções ************/
    /**************************************************************/

    // Permite redimensionamento automático das textareas
    $("#inputs-instruction textarea").on("input", resizeTextarea);
    function resizeTextarea(e) {
        this.style.height = "0px";
        this.style.height = e.currentTarget.scrollHeight + "px";
        unlockOrBlockSave();
    }
    
    // Quando dá enter, cria outra textarea
    $("#inputs-instruction textarea").on("keydown", appendTextarea);
    function appendTextarea(e) {
        if (e.key == 'Enter' && e.currentTarget.value != '' && !e.currentTarget.value.match(/^(\s+)$/)) {
            $('#inputs-instruction').append('<span class="bullet">&bull;</span><textarea type="text"></textarea>');
            $("#inputs-instruction textarea").off("input");
            $("#inputs-instruction textarea").on("input", resizeTextarea);
            $("#inputs-instruction textarea:last-of-type").trigger('input').focus()
            $("#inputs-instruction textarea").off("keydown", appendTextarea);
            $("#inputs-instruction textarea").on("keydown", appendTextarea);
            $("#inputs-instruction textarea").off("keydown", removeTextarea);
            $("#inputs-instruction textarea").on("keydown", removeTextarea);
            return false;
        }
        return e.key != 'Enter';
    }

    // Quando apaga tudo, deleta a textarea
    $("#inputs-instruction textarea").on("keydown", removeTextarea);
    function removeTextarea(e) {
        if (e.key == 'Backspace' && e.currentTarget.value == '' && $("#inputs-instruction textarea").length > 1) {
            $(e.currentTarget).prev().prev().focus();
            $(e.currentTarget).prev().remove();
            $(e.currentTarget).remove();
            return false;
        }
    }

    // Bloqueia ou desbloqueia botão de salvar
    function unlockOrBlockSave() {
        if ($("#inputs-instruction textarea").length > 0
            && $("#inputs-instruction textarea")[0].value != ''
            && !$("#inputs-instruction textarea")[0].value.match(/^(\s+)$/)
            && $("#instruction-name").val() != ''
            && !$("#instruction-name").val().match(/^(\s+)$/)
        ) {
            $('#save-instruction').off('click');
            $('#save-instruction').on('click', saveInstructions);
            $('#save-instruction').css({opacity: 1, pointerEvents: 'all', userSelect: 'all'});
        }
        else {
            $('#save-instruction').off('click');
            $('#save-instruction').css({opacity: '.5', pointerEvents: 'none', userSelect: 'none'});
        }
    }
    $('#instruction-name').on('input', unlockOrBlockSave);
    
    /**************************************************************/
    /****************** Salva instruções via AJAX *****************/
    /**************************************************************/

    $('#save-instruction').on('click', saveInstructions);
    function saveInstructions() {
        $('body').css('cursor', 'progress');
        $('#save-instruction').off('click');

        let instructionsToSend = [];
        for (let i of $("#inputs-instruction textarea")) {
            if ($(i).val() != '') {
                instructionsToSend.push($(i).val());
            }
        }
        let data = {
            _token: $('input[name="_token"]').val(),
            name: $('#instruction-name').val(),
            instructions: JSON.stringify(instructionsToSend),
        }
        $.post('/customization/store/instruction', data, response => {
            $('body').css('cursor', 'default');
            $('.instruction:not(#default-instruction)').remove();
            for (let i of JSON.parse(response)) {
                insertInstruction(i);
            }
            $('.instruction').off('click');
            $('.instruction').on('click', (e) => {showInstruction(e)});
            $('#save-instruction').on('click', saveInstructions);
            $('#instruction-name').val('');
            for (let i of $('#inputs-instruction textarea:not(#inputs-instruction textarea:first-of-type)')) {
                $(i).prev().remove();
                $(i).remove();
            }
            $('#section-instructions .add').trigger('click');
            $('#inputs-instruction textarea:first-of-type').val('');
        });
    }
    
    /**************************************************************/
    /***************** Insere as instruções no DOM ****************/
    /**************************************************************/

    function insertInstruction(inst) {
        $('#instructions').append(
            '<div class="instruction simple-box" data-instruction-id="'+inst.id+'">'+
                '<div class="arrow-down"></div>'+
                '<div class="instruction-title">'+inst.name+'</div>'+
                '<ul></ul>'+
                '<img src="/img/icons/ico_plus.svg" class="x x-img delete-instruction" data-instruction-id="'+inst.id+'" title="Apagar">'+
            '</div>'
        ).hide().fadeIn(200);
        for (let i of JSON.parse(inst.instructions)) {
            $('.instruction[data-instruction-id="'+inst.id+'"] ul').append(
                '<li>'+i+'</li>'
            );
        }

        $('.delete-instruction[data-instruction-id="'+inst.id+'"]').on('click', () => {deleteInstruction(inst.id)});
    }
    if (instructions.length > 0) {
        for (let i of instructions) {
            insertInstruction(i);
        }
    }
    $('.instruction').on('click', (e) => {showInstruction(e)});

    /**************************************************************/
    /********************** Deleta instrução **********************/
    /**************************************************************/

    function deleteInstruction(id) {
        $('.delete-instruction[data-instruction-id="'+id+'"]').off('click');
        $('body').css('cursor', 'progress');

        $.get('/customization/remove/instruction/'+id, (data) => {
            $('body').css('cursor', 'default');
            $('.delete-instruction[data-instruction-id="'+id+'"]').parent().slideUp(200);
            setTimeout(() => {$('.delete-instruction[data-instruction-id="'+id+'"]').parent().remove()}, 220);
        });
    }

    /**************************************************************/
    /************************* Exibe dicas ************************/
    /**************************************************************/

    $('#info-img').on('mouseenter', () => { $('#info-img .tip-msg').show() } )
    $('#info-img').on('mouseleave', () => { $('#info-img .tip-msg').hide() } )

});