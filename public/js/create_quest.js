$(document).ready(function() {

/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/*******            Este código contem a lógica necessária para o funcionamento do cadastro e edição de questões.                   ********/
/*******                O código exclusivo para a edição de questões está ao final, após o próximo divisor.                         ********/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/

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
        [{'align':[]}, {'indent':'-1'}, {'indent':'+1'}],
        [{'list':'ordered'},{'list':'bullet'}],
        ['formula'],
    ];
    var barraBubble = [['bold'], ['italic'], ['underline'], ['strike'], ['formula']];

    var allowedFormats = ['bold', 'italic', 'strike', 'underline', 'formula', 'indent', 'list', 'align', 'script'];

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
    function removeImage() {

        // Remove os elementos estéticos
        $('#img-name').empty().html('Nenhuma imagem selecionada');
        $('#quest-img-label').html('Escolher imagem');
        $('#quest-img-x').hide();
        $('#quest-img-flag').attr('value', 0);

        // Zera a variável que guarda a imagem
        image = '';
    }
    

    /***********************************************/
    /********* Envia o formulário via AJAX *********/
    /***********************************************/

    $('#new-quest').on('submit', (e) => {
        e.preventDefault();
        let submitterButton = $(e.originalEvent.submitter).attr('id');

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

        // Trata a alternativa correta de acordo com o tipo da questão
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
        formData.append("other_terms", $('#other-terms').val());                           // Outros termos
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
            if (response.ok) {
                if (submitterButton == 'save-and-leave') {
                    location.replace('/my_quests');
                }
                else if (submitterButton == 'save-and-other') {
                    location.reload();
                }
            }
            return response.json();
        }).then( response => {
            console.log(response);
            //Reseta os spans de erro
                $('.error-feedback').hide().html('');
                $('.error-feedback').parent().css({background: 'transparent'});
                if ($('#add-alter').attr('style')) $('#add-alter').removeAttr('style');
                
            // Exibe os erros e colore as divs
            for (let key in response.errors) {
                if (key == 'options') $('#add-alter').css({opacity: .6});
                $('#error-'+key).html(response.errors[key]).fadeIn(300);
                $('#error-'+key).parent().animate({backgroundColor: 'rgb(255, 190, 190)'}, 300);
            }
        });
    
    });

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
        }

        /******** Setando disciplina ********/
        $('#subject option[value='+question.subject_id+']')[0].selected = true;

        /******** Setando conteúdo ********/
        $('#content-tag').val(question.content);
        
        /******** Setando outros termos ********/
        $('#other-terms').val(question.other_terms);

        /******** Setando privacidade ********/
        question.private ? $('#yes')[0].checked = true : $('#no')[0].checked = true;
    }
});