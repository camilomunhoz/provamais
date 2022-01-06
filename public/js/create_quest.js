$(document).ready(function() {

/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/*******            Este código contem a lógica necessária para o funcionamento do cadastro e edição de questões.                   ********/
/*******                O código exclusivo para a edição de questões está ao final, após o próximo divisor.                         ********/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
console.log(origin);

    /********* Esconde os spans de erro *********/
    $('.error-feedback').hide();

    /********* Seleção do tipo *********/
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

    /********* Enunciado *********/
    var barraSnow = [
        ['bold', 'italic', 'underline', 'strike'],['clean'],
        [{'script':'super'}, {'script':'sub'}],
        [{'indent':'-1'}, {'indent':'+1'}],
        [{'list':'ordered'},{'list':'bullet'}],
        ['formula'],
    ];
    var barraBubble = [['bold'], ['italic'], ['underline'], ['strike'], ['formula'], [{'script':'super'}], [{'script':'sub'}]];

    var allowedFormats = ['bold', 'italic', 'strike', 'underline', 'formula', 'indent', 'list', 'script'];

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

    var enunciado = new Quill('#input-statement', configEnunciado);

            // Caso seja edição, já vai ter o enunciado
            try {
                if (question) {
                    enunciado.setContents(JSON.parse(question.statement));
                }
            } catch(e) {};

    /********* Alternativa correta *********/
    function refreshCorrect(){
        $('#correct').empty().append("<option value=''>-</option>");
        for (let i = 0; i < alt.length; i++){
            let asciiLetter = i + 97; // para definir a letra com ASCII
            $('#correct').append('<option value='+i+'>&#'+asciiLetter+';</option>');
        }
    }

    /********* Alternativas *********/
    var alt = [];
    var a = 0; // Contador do nº de alternativas

    // Para não dar erro no console quando for uma edição
    if (typeof question === 'undefined') {

        // Insere as alternativas iniciais
        for(; a < 4; a++){
            alt.push({
                'number': a,
                'obj': new Quill('.a'+a, configAlter ), 
            });
        }
        refreshCorrect();
    } 

    /********* Adiciona alternativa *********/
    $('#add-alter').on('click', () => {
        let numAlts = $('.alternative').length;
        let asciiLetter = numAlts + 97; // para definir a letra com ASCII
        $('.alters').append(
            '<div class="alternative">'+
                '<span class="letter">&#'+ asciiLetter +';)</span><div class="a'+ (++a) +' simple-box"></div>'+
                '<img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">'+
            '</div>'
        );
        $($('.a'+a).parents('.alternative')).hide().slideDown(50);
        alt.push({
            'number': a,
            'obj': new Quill('.a'+a, configAlter ), 
        });
        refreshCorrect();
        $('.x-alter').off('click', deleteAlternative);
        $('.x-alter').on('click', deleteAlternative);
        console.log(alt)
    });

    /********* Exclui alternativa *********/
    function deleteAlternative(e){ 
        
        // Seleciona a alternativa
        let alter = $(e.target).siblings('.simple-box');
        
        // Extrai o número da alternativa
        let classes = alter.attr('class').split(/\s+/);
        let nAlt = classes[0];
        nAlt = Number(nAlt.substr(1));
        
        // Retira a instância Quill do array
        for(let x = 0; x < alt.length; x++){;
            if(alt[x].number == nAlt){
                alt.splice(x, 1);
                // Também retira a alternativa de question.options caso seja uma edição
                if (typeof question !== 'undefined') {
                    if (x < question.options.length) {
                        question.options.splice(x, 1);
                    }
                }
                break;
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
    $('.x-alter').off('click', deleteAlternative);
    $('.x-alter').on('click', deleteAlternative);
    
    /********* Escolha da imagem *********/
    $('#quest-img').on('change', setImage);
    $('.x-img').on('click', removeImage);
    //var image = question.image ? 'keep' : '';  // Declarada assim para manter a imagem no BD caso ela não seja trocada ou excluída na edição 
    var image = '';
    
    function setImage(e) {
        if (e.target.files[0].size < 1024*100) {
            if (e.target.files && e.target.files[0]) {
                // Colocando elementos estéticos como o nome da imagem
                let imgName = e.target.files[0].name;
                $('#img-name').html(imgName);
                $('#quest-img-label').html('Alterar imagem');
                $('#quest-img-x').show();
                $('#quest-img-flag').attr('value', 1);
    
                // Salvando imagem para enviar posteriormente
                image = e.target.files[0];
            }
        }
        else {
            alert('Por limitações temporárias do servidor, pedimos que a imagem não exceda 100kb.');
        }
    }
    function removeImage() {

        // Remove os elementos estéticos
        $('#img-name').empty().html('Nenhuma imagem selecionada');
        $('#quest-img-label').html('Escolher imagem');
        $('#quest-img-x').hide();
        $('#quest-img-flag').attr('value', 0);

        // Zera a variável que guarda a imagem
        image = '';
    }
    

    /************************************************/
    /********* Tags para os "outros termos" *********/
    /************************************************/
    // Minha autoria, disponível em https://codepen.io/kamilgaz/pen/mdMabzR
    
    // Will store the inserted tags
    let tags = [];
    if (typeof question !== 'undefined') {
        if (question.other_terms != null) {
            existentTags = JSON.parse(question.other_terms);
        }
    }
    
    // Declare the keys which triggers tag insertion
    const appendTagTriggers = ['Enter', 'Tab']

    /***** Listen to the keys pressed *****/
    
    $('#other-terms').on('keydown', e => {
        
        // Get the input value and clean excessive whitespaces
        let input = e.target.value;
        input = input.trim();
        input = input.replace(/^(\s+)$/, '');
        
        // Define if the pressed key was a trigger
        let triggerPressed = appendTagTriggers.find((trigger) => { return (trigger == e.key ? true : false) });
        
        // If a trigger is pressed...
        if (triggerPressed) {
            // ... validate if input is not a duplicate and if it's empty
            let duplicated = tags.find((tag) => { return (tag == input ? true : false) });
            if (!duplicated && input != '' && !input.match(/^(\s+)$/) && input.length <= 80) {
                // Append the tag
                appendTag(input);
                e.target.value = '';
            }
            // If duplicated, draw attention to the existent tag
            else if (duplicated) {
                $('.tag[data-content="'+input+'"]').addClass('look-at-me');
                setTimeout(() => {$('.tag[data-content="'+input+'"]').removeClass('look-at-me')}, 600);
                e.target.value = '';
            }
        }
    });
    
    /********** Append a new tag **********/
    
    function appendTag(content) {
        
        // Append tag structure
        $('#tags').append(
            '<div class="tag" data-content="'+content+'">'+
                '<span class="tag-content">'+content+'</span>'+
                '<span class="tag-delete-btn" title="Delete">x</span>'+
            '</div>'
        );
        
        // Animate tag entrance
        $('.tag[data-content="'+content+'"]').hide().show(200);
        
        // Set up the deletion button
        $('.tag[data-content="'+content+'"] .tag-delete-btn')
            .on('click', () => { deleteTag(content) });
        
        // Store the inserted tag
        tags.push(content);
    }
    
    /************ Delete a tag ************/
    
    function deleteTag(content) {
        
        // Remove tag from the storage array
        tags.splice(tags.findIndex((tag) => { return (tag == content ? true : false) }), 1); console.log(tags)
        
        // Animate tag removal from DOM
        $('.tag[data-content="'+content+'"]').hide(200);
        setTimeout(() => {$('.tag[data-content="'+content+'"]').remove()}, 200);
    }

    /***********************************************/
    /********* Envia o formulário via AJAX *********/
    /***********************************************/

    $('#new-quest').on('submit', (e) => {
        e.preventDefault();
        let submitterButton = $(e.originalEvent.submitter).attr('id');
        $('.save-btn').css({pointerEvents: 'none', userSelect: 'none', opacity: '.4', cursor: 'default'}).attr('type', 'button');
        $('body').css('cursor', 'progress');

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
                    order: i,
                };
                // Caso seja uma edição, envia também o id das alternativas e um id vazio para as novas 
                if (typeof question !== 'undefined') {
                    if (i < question.options.length) altDeltas[i].id = question.options[i].id;
                    else altDeltas[i].id = '';
                }
                console.log(altDeltas[i]);
            }
            altDeltas = JSON.stringify(altDeltas);
            // console.log(altDeltas);
        }
        else {
            nLines = $('#n-lines').val();
            answer = $('#answer').val();
            altDeltas = 'none';
        }

        // Trata a resposta correta de acordo com o tipo da questão
        let correct;
        if(questType == 'objetiva'){
            correct = $('#correct').find(':selected').val();
        }
        else {
            correct = 'none';
        }

        // Define os dados que serão enviados para o back-end
        const formData = new FormData();

        formData.append("identifier", $("#new-quest :input[name='identifier']").val());    // Identificador único para poder salvar as alternativas
        formData.append("type", questType);                                                // Tipo da questão
        formData.append("statement", JSON.stringify(enunciado.getContents()));             // Enunciado. getContents() pega o delta do enunciado.
        formData.append("options", altDeltas);                                             // Alternativas. Envia os deltas coletados.
        formData.append("n_lines", nLines);                                                // Número de linhas
        formData.append("private", $("#new-quest :input[type='radio']:checked").val());    // Opção de privacidade
        formData.append("subject_id", $('#subject').find(':selected').val());              // Disciplina. Envia o id, não o nome.
        formData.append("content", $('#content-tag').val());                               // Conteúdo
        formData.append("other_terms", tags.length > 0 ? JSON.stringify(tags) : "");       // Outros termos
        formData.append("image", image);                                                   // Imagem
        formData.append("image_flag", $('#quest-img-flag').val());                         // Confirmação se existe imagem
        formData.append("correct", correct);                                               // Alternativa correta
        formData.append("answer_suggestion", answer);                                      // Sugestão de resposta
        // console.log(Array.from(formData))

        // Posta via fetch() (AJAX)
        fetch(typeof question !== 'undefined' ? '/update_question' : '/store_question',{
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': $("#new-quest :input[name='_token']").val(),
                accept: 'application/json',
                contentType: 'application/json',
            },
            body: formData,
        }).then( response => {
            $('.save-btn').removeAttr('style').attr('type', 'submit');
            $('body').removeAttr('style');
            if (response.ok) {
                if (origin == 'doc') {
                    close();
                }
                else if (submitterButton == 'save-and-leave') {
                    location.replace('/my_quests');
                }
                else if (submitterButton == 'save-and-other') {
                    location.reload();
                }
            }
            //Reseta os spans de erro
            $('.error-feedback').hide().html('');
            $('.error-feedback').parent().css({background: 'transparent'});
            if ($('#add-alter').attr('style')) $('#add-alter').removeAttr('style');

            return response.json();

        }).then( response => {
            
            // Exibe os erros e colore as divs
            let i = 0;
            for (let key in response.errors) {
                if (i == 0) {
                    let pos;
                    setTimeout(() => {
                        pos = $('#error-'+key).parent().prop('offsetTop');
                        document.getElementById('content').scrollTo({top: 0, behavior: 'smooth'});
                        // document.getElementById('content').scrollTo({top: (pos-20), behavior: 'smooth'});
                        // console.log(response.errors)
                        // console.log($('#error-'+key).parent())
                        // console.log(pos)
                    }, 2);
                }
                // console.log(key)
                if (key == 'options') $('#add-alter').css({opacity: .6});
                $('#error-'+key).html(response.errors[key]).fadeIn(300);
                $('#error-'+key).parent().animate({backgroundColor: 'rgb(255, 190, 190)'}, 300);
                i++;
            }
        });
    
    });

    /***********************************************/
    /***************** Tip de ajuda ****************/
    /***********************************************/

    $('#info-format').on('mouseenter', () => { $('#info-format .tip-msg').show() } )
    $('#info-format').on('mouseleave', () => { $('#info-format .tip-msg').hide() } )


/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/********************************************************* Código para a edição de questões ************************************************/
/*******************************************************************  a seguir  ************************************************************/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/

    if (typeof question !== 'undefined') {

        console.log(question);

        /*************************************/
        /******** Se for dissertativa ********/
        /*************************************/
        
        if (question.type == 'Dissertativa') {

            // Liberação do respectivo formulário
            $('.hidden').fadeIn(200).css('display', 'flex').removeClass('hidden');
            $('.alters').parent().parent().addClass('hidden').hide();
            $('#quest-type-flag').attr('value', 'essay');
        
            $('#type-essay').addClass('selected-type');
            $('#type-essay').removeClass('unselected-type');
            $('#type-essay').siblings().removeClass('selected-type');
            $('#type-essay').siblings().addClass('unselected-type');

            // Setando número de linhas
            $('#n-lines').val(question.n_lines);

            // Setando sugestão de resposta
            $('#answer').val(question.answer_suggestion);
        
        }

        /*************************************/
        /********** Se for objetiva **********/
        /*************************************/

        else if (question.type == 'Objetiva') {
            
            // Liberação do respectivo formulário
            $('.hidden').fadeIn(200).css('display', 'flex').removeClass('hidden');
            $('#n-lines').parent().parent().addClass('hidden').hide();
            $('#answer').parent().parent().addClass('hidden').hide();
            $('#quest-type-flag').attr('value', 'alternative');

            $('#type-alter').addClass('selected-type');
            $('#type-alter').removeClass('unselected-type');
            $('#type-alter').siblings().removeClass('selected-type');
            $('#type-alter').siblings().addClass('unselected-type');

            // Setando as alternativas
            var barraBubble = [['bold'], ['italic'], ['underline'], ['strike'], ['formula']];
            var allowedFormats = ['bold', 'italic', 'strike', 'underline', 'formula', 'indent', 'list', 'align', 'script'];
            let configAlter = {
                modules: {
                    toolbar: barraBubble,
                },
                theme: 'bubble',
                formats: allowedFormats,
                bounds: '.alternative'
            }

            question.options.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)); // Coloca as questões em ordem
            for(; a < question.options.length; a++){ // o contador "a" já está definido, por isso não foi declarado aqui
                $('.alters').append(
                    '<div class="alternative">'+
                        '<span class="letter">&#'+(a+97)+';)</span><div class="a'+ a +' simple-box"></div>'+
                        '<img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">'+
                    '</div>'
                );
                alt.push({
                    'number': question.options[a].order,
                    'obj': new Quill('.a'+a, configAlter ), 
                });
                alt[a].obj.setContents(JSON.parse(question.options[a].content));
            }
            $('.x-alter').on('click', deleteAlternative);

            // Setando alternativa a correta
            $('#correct').append("<option value=''>-</option>");
            for (let i = 0; i < alt.length; i++){
                let asciiLetter = i + 97; // para definir a letra com ASCII
                $('#correct').append('<option value='+i+'>&#'+asciiLetter+';</option>');
            }
            let correct;
            for (o of question.options) {
                if (o.correct) { correct = o.order; break; }
            }
            $('#correct option[value='+correct+']')[0].selected = true;
        }

    /*=================================================================================*/

        /******** Setando o enunciado ********/
            // implementado em "/js/create_quest.js"

        /******** Setando imagem ********/
        if (question.image) {
            // Colocando elementos estéticos como o nome da imagem
            $('#img-name').append('<img src="/img/questions_images/'+question.image+'">');
            $('#quest-img-label').html('Alterar imagem');
            $('#quest-img-x').show();
            $('#quest-img-flag').attr('value', 1);
        }
        /******** Setando disciplina ********/
        $('#subject option[value='+question.subject_id+']')[0].selected = true;

        /******** Setando conteúdo ********/
        $('#content-tag').val(question.content);
        
        /******** Setando outros termos ********/
        if (typeof existentTags !== 'undefined') {
            for (let i in existentTags) {
                appendTag(existentTags[i]);
            }
        }
        /******** Setando privacidade ********/
        if (question.duplicated_from_user != null && question.duplicated_from_user != question.user_id) {
            $('#no').parent().remove();
            $('#yes')[0].checked = true;
            $('#yes').attr('disabled', 'disabled');
            $('#yes').parent().css({
                userSelect: 'none',
                opacity: '.3',
                cursor: 'default',
                marginLeft: 0,
            });
            $('.is-private').append(
                '<span id="duplication-warning">Esta questão é uma adaptação de outro usuário, por isso será salva de forma privada.</span>'
            );
        }
        else {
            question.private ? $('#yes')[0].checked = true : $('#no')[0].checked = true;
        }
    }
});