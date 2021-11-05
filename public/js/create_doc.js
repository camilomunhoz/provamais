$(document).ready(function() {

/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/*******            Este código contém a lógica necessária para o funcionamento do cadastro e edição de documentos.                 ********/
/*******                O código exclusivo para a edição de documentos está ao final, após o próximo divisor.                       ********/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/

    // Array que guarda as questões inseridas
    var insertedQuestions = [1];

    /****************************************************************/
    /******************** Insere botão de salvar ********************/
    /****************************************************************/

    $('#header-right-items').prepend(
        '<div id="save">'+
            '<img id="save-icon" src="/img/icons/ico_save.png">'+
            '<span id="save-label">Salvar</span>'+
        '</div>'
    );

    // Bloqueia ou desbloqueia o salvamento de acordo com as inserções
    function blockOrUnlockSave() {
        if (insertedQuestions.length === 0) {
            $('#save').css({
                userSelect: 'none',
                pointerEvents: 'none',
                opacity: '.4'
            }).off('click');
        }
        else {
            $('#save').off('click');
            $('#save').on('click', openSaveDialog).removeAttr('style');
        }
    }
    blockOrUnlockSave();

    /**********************************************************************/
    /*************** Exibe o ambiente para salvar a questão ***************/
    /**********************************************************************/
    $('#content').append(
        '<div id="save-overlay" class="black-overlay">'+
            '<form autocomplete="off" id="save-dialog" action="/store_doc" method="POST">'+
                '<input autocomplete="false" type="hidden">'+
                '<input id="questions-to-save" name="questions" type="hidden">'+
                '<label id="label-name-input" for="name-input" class="save-dialog-label">Nome do documento:'+
                    '<input id="name-input" name="name" type="text" class="simple-box" onkeydown="return event.key != \'Enter\';">'+
                '</label>'+
                '<div class="simple-line"></div>'+
                '<label id="label-enum-questions-input" for="enum-quests" class="save-dialog-label">Enumerador das questões:'+
                    '<select id="enum-quests" name="enum_questions" class="simple-box">'+
                        '<option value="1.">1.&nbsp;&nbsp;2.&nbsp;&nbsp;3.</option>'+
                        '<option value="1)">1)&nbsp;&nbsp;2)&nbsp;&nbsp;3)</option>'+
                        '<option value="1-">1-&nbsp;&nbsp;2-&nbsp;&nbsp;3-</option>'+
                        '<option value="Q1.">Questão 1.</option>'+
                        '<option value="Q1-">Questão 1 -</option>'+
                        '<option value="01.">01.&nbsp;&nbsp;02.&nbsp;&nbsp;03.</option>'+
                        '<option value="01)">01)&nbsp;&nbsp;02)&nbsp;&nbsp;03)</option>'+
                        '<option value="01-">01-&nbsp;&nbsp;02-&nbsp;&nbsp;03-</option>'+
                        '<option value="Q01.">Questão 01.</option>'+
                        '<option value="Q01-">Questão 01 -</option>'+
                    '</select>'+
                '</label>'+
                '<label id="label-enum-options-input" for="enum-opts" class="save-dialog-label">Enumerador das alternativas:'+
                    '<select id="enum-opts" name="enum_options" class="simple-box">'+
                        '<option value="a)">a)&nbsp;&nbsp;b)&nbsp;&nbsp;c)</option>'+
                        '<option value="A)">A)&nbsp;&nbsp;B)&nbsp;&nbsp;C)</option>'+
                    '</select>'+
                '</label>'+
                '<div class="simple-line"></div>'+
                '<button type="submit" id="save-btn" class="save-btn confirmation-btn-hard">Salvar</button>'+
            '</form>'+
        '</div>'
    );

    // Clona o CSRFtoken inserido via PHP pra dentro do form de salvamento // gambiarra total
    $('#save-dialog').prepend($('#filters input[name="_token"]').clone());

    // Bloqueia e desbloqueia o botão vermelho de salvar de acordo com a ausência de nome
    function blockOrUnlockRedSave() {
        if (!$('#name-input').val() || $('#name-input').val().match(/^(\s+)$/)) {
            $('#save-btn').css({
                userSelect: 'none',
                pointerEvents: 'none',
                filter: 'grayscale(100%)',
                opacity: '.6'
            })
            .removeAttr('type');
        }
        else {
            $('#save-btn').removeAttr('style').attr('type', 'submit');
        }
    }
    blockOrUnlockRedSave();
    $('#name-input').on('input', blockOrUnlockRedSave);

    function openSaveDialog() {
        
        $('#save-overlay').fadeIn(200);
        $('#save-dialog').slideDown(200);
        $('#save').off('click');

        // Insere no input escondido os identifiers das questões a serem enviadas
        $('#questions-to-save').val(JSON.stringify(insertedQuestions));

        // Deixa o documento em preto e branco
        $('#doc').css({filter: 'grayscale(.5)'});

        // Faz o botão "Salvar" fechar o overlay
        setTimeout(() => { $('#save').on('click', closeSaveDialog); }, 200); // Para não acumular animações

        // Faz o clique na parte preta do overlay fechar o overlay
        $('#save-dialog').on('mouseleave', () => {
            $('#save-overlay').on('mousedown', closeSaveDialog);
        });
        $('#save-dialog').on('mouseenter', () => {
            $('#save-overlay').off('mousedown');
        });

        // Foca no input do nome do documento se estiver vazio
        if (!$('#name-input').val()) {
            $('#name-input').focus();
        }

    }

    /****************************************************/
    /*********** Fecha overlay de salvamento ************/
    /****************************************************/

    function closeSaveDialog() {
        $('#doc').css({filter: 'none'});
        $('#save-dialog').slideUp(200);
        $('#save-overlay').fadeOut(200);
        $('#save').off('click');
        $('#save-dialog').off('mouseenter');
        $('#save-dialog').off('mouseleave');
        setTimeout(() => { $('#save').on('click', openSaveDialog); }, 200); // Para não acumular animações
    }

    $('.cancel-action').on('click', closeSaveDialog)

    /****************************************************************/
    /*********** Exibe o ambiente de seleção de questões ************/
    /****************************************************************/

    var selectedQuestions = [];

    $('#add-question-btn').on('click', () => {
        $('.add-question-overlay').fadeIn(200).css('display', 'flex');
    });

    /***************************************************/
    /****** Fecha overlay de seleção de questões *******/
    /***************************************************/

    function closeInsertionDialog(){
        $('.add-question-overlay').fadeOut(200);
        setTimeout(() => {
            $('#results').empty();
            $('#results').append(
                '<span>&larr;&nbsp;&nbsp;&nbsp; Especifique a busca inserindo um termo de busca.</span><br><br><br>'+
                '<span>&larr;&nbsp;&nbsp;&nbsp; Escolha ao menos uma disciplina para começar.</span>'
            );
            selectedQuestions = [];
            updateSelectedCount();
            blockOrUnlockInsertion();
            questions = [];
        }, 200);  
    }
    $('.x').on('click', closeInsertionDialog);
    $('#add-question-dialog').on('mouseleave', () => {
        $('.add-question-overlay').on('click', closeInsertionDialog);
    });
    $('#add-question-dialog').on('mouseenter', () => {
        $('.add-question-overlay').off('click',closeInsertionDialog);
    });

    /**************************************************/
    /********* Imprime os cards das questões **********/
    /**************************************************/

    function appendQuests(){

    /************** Caso retorne questões **************/
        if (questions.length) {
            $('#results').empty();
            
            // Exibe o termo de busca esteja sendo buscado
            if ($('#search-box').val()) {
                $('#results').append(
                    '<span id="no-quests">Procurando por "<b>'+$('#search-box').val()+'</b>"</span>'
                );  
            } 
            
            // Cria e insere os cards
            for (q in questions) {

                // Insere a estrutura do card já com as tags
                $('#results').append(
                    '<div id="result-'+q+'" class="result">'+
                        '<div id="'+questions[q].identifier+'" class="question-card simple-box">'+
                            '<div class="question-tag tag-subject">'+questions[q].subject_name+'</div>'+
                            '<div class="question-tag tag-content">'+questions[q].content+'</div>'+
                            '<div class="question-tag tag-type">'+questions[q].type+'</div>'+
                            '<span class="question-card-statement"></span>'+
                        '</div>'+
                    '</div>'
                );
                // Insere icone de cadeado caso a questão seja privada
                if (questions[q].private) {
                    $('#result-'+q+' > .question-card').prepend(
                        '<img src="/img/icons/ico_lock.svg" style="width: 10px;" title="Só você tem acesso a esta questão.">'
                    );
                }
                // Insere a checkbox correspondendo a questão
                $('#result-'+q).append(
                    '<label for="q-'+q+'" class="checkbox-label" title="Selecionar">'+
                        '<input type="checkbox" class="simple-box" id="q-'+q+'" value="'+questions[q].identifier+'">'+
                        '<div class="checkbox"><div class="checkmark"></div></div>'+
                    '</label>'
                );
                // Marca a checkbox caso a questão já esteja selecionada 
                if (questions[q].identifier == selectedQuestions.find((quest) => {
                    if (quest == questions[q].identifier) return true;
                    else return false;
                })) {
                    $('#q-'+q)[0].checked = true;
                }
                // Bloqueia a checkbox caso a questão já esteja inserida
                if (questions[q].identifier == insertedQuestions.find((quest) => {
                    if (quest == questions[q].identifier) return true;
                    else return false;
                })) {
                    $('#q-'+q)[0].checked = true;
                    $('#q-'+q).parent().css({
                        userSelect: 'none',
                        opacity: '.3',
                        cursor: 'default'
                    }).attr('title', 'Questão já inserida');
                    $('#q-'+q).removeAttr('id');
                }
            }

            // Exibe os enunciados das questões
            let quills = [];
            let cards = $('.question-card .question-card-statement');

            for (let i = 0 ; i < cards.length ; i++) {
                quills.push(
                    new Quill(cards[i], {theme: 'bubble', enable: 'false', readOnly: true})
                );
                quills[i].setContents(JSON.parse(questions[i].statement)); 
                quills[i].disable();
            }
            $('.question-card').on('click', showDetails);
            $('#results').append('<div id="quest-details" class="simple-box"></div>');
            $('.result input[type=checkbox]').on('change', selectQuestion);
        }

    /************** Caso a filtragem ou busca não retorne nenhuma questão **************/
        else {
            $('#results').empty();

            if ($('#search-box').val()) {
                $('#results').append(
                    '<span id="no-quests">Procurando por "<b>'+$('#search-box').val()+'</b>"</span>'
                );  
            } 
            $('#results').append(
                '<span id="no-quests">Nenhuma questão corresponde aos filtros aplicados.</span>'
            );
        }
            
        $('#results').css({display: 'flex'}).hide().fadeIn(300);
    }

    /******************************************************/
    /********* Permite marcar todas as checkboxes *********/
    /******************************************************/

    // Copyright: Saran, 2014. https://www.sanwebe.com/2014/01/how-to-select-all-deselect-checkboxes-jquery

    //select all checkboxes
    $("#all").change(function(){  //"select all" change 
        var status = this.checked; // "select all" checked status
        $('#filters .checkbox-label input').each(function(){ //iterate all listed checkbox items
            this.checked = status; //change ".checkbox" checked status
        });
    });

    $('#filters .checkbox-label input').change(function(){ //".checkbox" change 
        //uncheck "select all", if one of the listed checkbox item is unchecked
        if(this.checked == false){ //if this item is unchecked
            $("#all")[0].checked = false; //change "select all" checked status to false
        }
        
        //check "select all" if all checkbox items are checked
        if ($('#filters .checkbox-label input:checked').length == $('#filters .checkbox-label input').length-1 ){ 
            $("#all")[0].checked = true; //change "select all" checked status to true
        }
    });

    /***************************************************************************/
    /********* Impede que deixe grupos de checkboxes sem marcar nenhum *********/
    /***************************************************************************/

    $('#filters .checkbox-label input').on('change', checkFilters);

    function checkFilters() {
        let filterSubjectsCheck = false;

        // Na aba "Procurar questões", não há esses filtros, então a condição será verdadeira sempre
        let filterAnyUserCheck = $('#all-questions')[0].checked;
        let filterMyQuestsCheck = $('#my-questions')[0].checked;
        let filterPrivateCheck = $('#private-questions')[0].checked;
        let filterFavoriteCheck = $('#favorite-questions')[0].checked;

        let subjectsInputs = $('#filter-subjects input');

        for (i = 0; i < subjectsInputs.length; i++) {
            if (subjectsInputs[i].checked == true) {
                filterSubjectsCheck = true;
                break;
            }
        }

        if ( (!filterAnyUserCheck && !filterMyQuestsCheck && !filterPrivateCheck && !filterFavoriteCheck)
            || (!filterSubjectsCheck)
            || (!$('#alternative')[0].checked && !$('#essay')[0].checked) ) {
            
            $('#filter-btn').css({
                userSelect: 'none',
                pointerEvents: 'none',
                filter: 'grayscale(100%)',
                opacity: '.6'
            })
            .removeAttr('type');  
        }
        else {
            $('#filter-btn').removeAttr('style').attr('type', 'submit');
        }
    }
    checkFilters();


    /******************************************************/
    /*********** Faz a filtragem dos resultados ***********/
    /******************************************************/

    $('#filters').on('submit', (e) => {
        e.preventDefault();

        // Caso todos os filtros estejam selecionados, envia somente "all: 1", senão, envia todos os marcados
        let data;     
        if ($('#all')[0].checked) {
            data = {all: $('#all').val(),
                    _token: $("#filters :input[name='_token']").val(),
                    search: $('#search-box').val()};
        }
        else {
            data = $(e.target).serialize();
            
            // Se houver termo de busca, manda junto
            if ($('#search-box').val()) {
                data += '&search='+$('#search-box').val();  
            }
        }
        

        // Posta via AJAX
        $.ajax({
            url: '/filter_doc_quests',
            type: 'post',
            data: data,
            dataType: 'json',
            success: (response) => {
                questions = response;
                questions.sort((a,b) => (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                questions.sort((a,b) => (a.subject_id > b.subject_id) ? 1 : ((b.subject_id > a.subject_id) ? -1 : 0)); // Coloca as questões por ordem de disciplina
                appendQuests();
            }
        });
    });

    /***************************************************/
    /******** Exibe detalhes da questão clicada ********/
    /***************************************************/
        
    function showDetails(e) {

        let questCard; // Armazenará o card (elemento) clicado

        // Caso clique nos elementos filhos
        (!$(e.target).hasClass('question-card')) ? 
            questCard = $(e.target).parents('.question-card')
            :
            questCard = $(e.target);

        // Pega o id da questão clicada
        let questId = questCard.attr('id');

        let question; // Armazenará a questão e seus atributos

        // Percorre as questões (advindas da filtragem) em busca da questão clicada
        for(q in questions){
            if(questions[q].identifier == questId){
                question = questions[q];
                break;
            }
        }

        // Inserindo os detalhes da questão de fato 
        $('#quest-details').empty();
        $('#quest-details').append(
            '<div id="quest-details-header">'+
                '<div id="left-info">'+
                    '<div id="owner">'+
                        '<img id="owner-pic" src="/img/users_profile_pics/'+question.user.profile_pic+'">'+
                        '<span>Cadastrada por<br><a href="/profile/'+question.user.id+'" target="_blank">'+question.owner+'</a></span>'+
                    '</div>'+
                    '<div id="tags">'+
                        '<div class="question-tag tag-subject">'+question.subject_name+'</div>'+
                        '<div class="question-tag tag-content">'+question.content+'</div>'+
                        '<div class="question-tag tag-type">'+question.type+'</div>'+
                    '</div>'+
                '</div>'+
                '<div id="right-info">'+
                    '<label for="q-current" class="checkbox-label">'+
                        '<input type="checkbox" class="simple-box" id="q-current" value="'+questions[q].identifier+'">'+
                        '<div id="select-current">Selecionar</div>'+    
                    '</label>'+
                    '<img class="x" src="/img/icons/ico_plus.svg" alt="X" title="Fechar">'+
                '</div>'+
            '</div>'+
            '<div class="simple-line"></div>'+
            '<div id="quest-details-content">'+
                '<span id="question-statement"></span>'+
            '</div>'
        );
        if (questions[q].private) {
            $('#tags').prepend(
                '<img src="/img/icons/ico_lock.svg" style="width: 10px;" title="Só você tem acesso a esta questão.">'
            );
        }

        let statement = new Quill('#question-statement', {theme: 'bubble', enable: 'false', readOnly: 'true'});
        statement.setContents(JSON.parse(question.statement));
        statement.disable();
        
        if(question.image){
            $('#quest-details-content').append(
                '<img id="question-image" src="/img/questions_images/'+question.image+'">'
            );
        }
        if(question.answer_suggestion){
            $('#quest-details-content').append(
                '<span id="question-answer"><strong>Sugestão de resposta:</strong> '+question.answer_suggestion+'</span>'
            );
        }
        if(question.options && question.options.length){
            let correct;
            $('#quest-details-content').append(
                '<div id="question-options"></div>'
            );
            for(let i = 0; i < question.options.length; i++){
                $('#question-options').append(
                    '<div class="option-container opt-'+i+'"></div>'
                );
                $('.opt-'+i).append(
                    '<span class="option-enumerator"><b>&#'+(97+i)+';)</b></span>'+
                    '<div class="question-option o'+i+'"></div>'
                );
                let option = new Quill('.o'+i, {theme: 'bubble', enable: 'false', readOnly: 'true'});
                option.setContents(JSON.parse(question.options[i].content));
                option.disable();
                if (question.options[i].correct) correct = i;
            }
            $('#quest-details-content').append(
                '<div id="question-answer" style="text-align: right; padding-right: 10px;"><strong>Alternativa correta:</strong> &#'+(65+correct)+';</div>'
            );
        }
        $('#quest-details-content').append(
            '<div class="simple-line"></div>'
        );
        if (question.type == 'Dissertativa') {
            $('#quest-details-content').append(
                '<span id="n-lines">Resposta de no máximo <strong>'+question.n_lines+'</strong> linhas.</span>'
            );
        }
        // if(question.other_terms){
            $('#quest-details-content').append(
                '<span id="other-terms"><strong>Outros termos relacionados:</strong> de alguma forma aqui vão os termos</span>'
            );
        // }
                
        // Botão de selecionar

            // Quando exibe os detalhes, marca como selecionado ou não de acordo com as questões selecionadas
            if ($('#q-current').val() == selectedQuestions.find((quest) => {
                if (quest == questions[q].identifier) return true;
                else return false;
                }) ||
                $('#q-current').val() == insertedQuestions.find((quest) => {
                    if (quest == questions[q].identifier) return true;
                    else return false;
                })
            ) {
                $('#select-current').html('Selecionada <div class="checkmark"></div>').css({
                    color: 'var(--color1)',
                    backgroundColor: 'transparent',
                }).addClass('selected').attr('title', 'Remover');
            }
            else {
                $('#select-current').html('Selecionar').css({
                    color: 'grey',
                    backgroundColor: '#ddd',
                }).removeClass('selected').removeAttr('title');
            }

            // Seleciona ou desseleciona a questão
            $('#select-current').on('click', () => {
                if (!$('#select-current').hasClass('selected')) {
                    $('#select-current').html('Selecionada <div class="checkmark"></div>').css({
                        color: 'var(--color1)',
                        backgroundColor: 'transparent',
                    }).addClass('selected').attr('title', 'Remover');

                    // Inclui nas selecionadas e marca a checkbox
                    selectedQuestions.push($('#q-current').val());
                    $('.result input[value="'+$('#q-current').val()+'"]')[0].checked = true;
                    updateSelectedCount();
                }
                else {
                    $('#select-current').html('Selecionar').css({
                        color: 'grey',
                        backgroundColor: '#ddd',
                    }).removeClass('selected').removeAttr('title');

                    // Remove das selecionadas e desmarca a checkbox
                    selectedQuestions.splice(
                        selectedQuestions.findIndex((q) => {
                            if (q == questId) return true;   
                            else return false;
                        }),
                    1);
                    $('.result input[value="'+$('#q-current').val()+'"]')[0].checked = false;
                    updateSelectedCount();
                }
                blockOrUnlockInsertion();
            });

            // Se a questão já está inserida, marca como selecionado e bloqueia o botão
            if (question.identifier == insertedQuestions.find((quest) => {
                if (quest == question.identifier) return true;
                else return false;
            })) {
                $('#q-current').parent().css({
                    userSelect: 'none',
                    opacity: '.3',
                    cursor: 'default'
                }).attr('title', 'Questão já inserida')
                $('#q-current').removeAttr('id');
                $('#select-current').html('Inserida <div class="checkmark"></div>')
                $('#select-current').off('click');
            }

        $('#quest-details').slideDown(200).css('display', 'grid');
        $('#no-quests').hide();

        $('.x').on('click', () => {
            $('#quest-details').slideUp(200);
            setTimeout(() => {$('#no-quests').show()}, 200);
        });
    }

    /**************************************************************************/
    /******** Seleciona e desseleciona as questões que serão inseridas ********/
    /**************************************************************************/

    function selectQuestion(e) {
        let questId = e.target.value;
        if (e.target.checked == true) {
            selectedQuestions.push(questId);
        }
        else {
            selectedQuestions.splice(
                selectedQuestions.findIndex((q) => {
                    if (q == questId) return true;   
                    else return false;
                }),
            1);
        }
        updateSelectedCount();
        blockOrUnlockInsertion();
    }

    /******************************************************************************/
    /*********** Bloqueia o botão de inserir quando nenhuma selecionada ***********/
    /******************************************************************************/

    function blockOrUnlockInsertion() {
        if (selectedQuestions.length === 0) {
            $('#insert-questions').css({
                userSelect: 'none',
                pointerEvents: 'none',
                filter: 'grayscale(100%)',
                opacity: '.4'
            }).off('click');
        }
        else {
            $('#insert-questions').off('click');
            $('#insert-questions').on('click', getQuestions).removeAttr('style');
        }
    }
    blockOrUnlockInsertion();

    /************************************************************************/
    /************** Atualiza o número de questões selecionadas **************/
    /************************************************************************/

    function updateSelectedCount() {
        $('#selected-questions b').html(selectedQuestions.length);
    }
    updateSelectedCount();

    /***********************************************************************/
    /**************** Puxa do banco as questões selecionadas ***************/
    /***********************************************************************/

    // Traz via AJAX as questões selecionadas
    function getQuestions() {
        $('#insert-questions').off('click');
        let questionsIds = '';
        selectedQuestions.find((q) => {
            questionsIds += q+';';
        });
        let data = {
            ids: questionsIds,
        };

        $.get('/insert_doc_quests', data)
            .done((response => {
                let questions = JSON.parse(response);
                for (q of questions) {
                    insertQuestion(q);
                }
                closeInsertionDialog();
                updateEnumerators();
                blockOrUnlockSave();
            })
        );
    }

    /***********************************************************************/
    /******************* Insere as questões selecionadas *******************/
    /***********************************************************************/

    function insertQuestion(q) {
        // Insere a questão
        $('#questions').append(
            '<div class="question" id="'+q.identifier+'">'+
                '<div class="enumerator"></div>'+
                '<div class="question-content" data-question-id="'+q.identifier+'">'+
                    '<div class="statement"></div>'+
                '</div>'+
                '<div class="actions">'+
                    '<img class="remove-question" src="/img/icons/ico_trash.png" alt="Remover" title="Remover questão" data-question-id="'+q.identifier+'">'+
                    '<img class="reorder-question" src="/img/icons/ico_reorder.svg" alt="Reordenar" title="Arraste para reordenar">'+
                    '<img class="expand-question" src="/img/icons/ico_expand.svg" alt="Expandir" title="Expandir questão" data-question-id="'+q.identifier+'">'+
                    '<img class="minimize-question" src="/img/icons/ico_minimize.svg" alt="Minimizar" title="Minimizar questão" data-question-id="'+q.identifier+'">'+
                '</div>'+
            '</div>'
        );
        // Adiciona o enunciado com Quill
        let stmt = new Quill('.question-content[data-question-id="'+q.identifier+'"] .statement',
                        {theme: 'bubble', enable: 'false', readOnly: true});
        stmt.setContents(JSON.parse(q.statement));
        stmt.disable();

        // Adiciona a imagem se houver
        if(q.image){
            $('.question-content[data-question-id="'+q.identifier+'"]').append(
                '<img class="image" src="/img/questions_images/'+q.image+'">'
            );
        }
        // Adiciona as alternativas se houver
        if(q.options && q.options.length){
            $('.question-content[data-question-id="'+q.identifier+'"]').append(
                '<div class="options"></div>'
            );
            for(let i = 0; i < q.options.length; i++){
                $('.options').append(
                    '<div class="option-container opt-'+i+'"></div>'
                );
                $('.opt-'+i).append(
                    '<span class="option-enumerator"><b>&#'+(97+i)+';)</b></span>'+
                    '<div class="option o'+i+'"></div>'
                );
                let option = new Quill('.o'+i, {theme: 'bubble', enable: 'false', readOnly: 'true'});
                option.setContents(JSON.parse(q.options[i].content));
                option.disable();
            }
        }
        // Expande a questão
        $('.expand-question[data-question-id="'+q.identifier+'"]').on('click', (e) => {
            $('.question-content[data-question-id="'+q.identifier+'"]').css({height: 'fit-content'}) // css-tricks do the trick (animate height/width to "auto")
            $(e.target).hide();
            $(e.target).siblings('.minimize-question').show();
        })
        // Minimiza a questão
        $('.minimize-question[data-question-id="'+q.identifier+'"]').on('click', (e) => {
            $('.question-content[data-question-id="'+q.identifier+'"]').animate({height: '80px'}, 200) // css-tricks do the trick (animate height/width to "auto")
            $(e.target).hide();
            $(e.target).siblings('.expand-question').show();
        });
        // Adiciona no array que guarda o identifier de todas as questões que estão inseridas
        insertedQuestions.push(q.identifier);

        // Remove a questão
        $('.remove-question[data-question-id="'+q.identifier+'"]').on('click', (e) => {
            $('.question[data-question-id="'+q.identifier+'"]').remove();
            insertedQuestions.splice(
                insertedQuestions.findIndex((iQ) => {
                    if (iQ == q.identifier) return true;   
                    else return false;
                }),
            1);
            updateEnumerators();
        });
    }

    /***********************************************************************/
    /*********************** Reordenação das questões **********************/
    /***********************************************************************/

    // Permite a reordenção com o JQuery UI
    $('#questions').sortable({
        containment: '#questions',       // Container constrain
        handle: '.reorder-question',     // Sort Handle (que dispara o evento)
        revert: 100,                     // Animaçãozinha dele indo pro lugar
        tolerance: 'pointer',            // O item será reordenado quando o ponteiro passar por cima
        update: () => {                  // Dispara quando é reordenado
            updateEnumerators();
            insertedQuestions = $('#questions').sortable('toArray');
        },
    });

    // Atualiza os enumeradores das questões
    function updateEnumerators() {
        let enums = document.getElementsByClassName('enumerator');
        let count = 1;
        for (e of enums) {
            $(e).html(count+'.');
            count++;
        }
    }
    updateEnumerators()

    // Atualiza o que é necessário quando ocorre reordenação

/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
/********************************************************* Código para a edição de documentos **********************************************/
/*******************************************************************  a seguir  ************************************************************/
/*******************************************************************************************************************************************/
/*******************************************************************************************************************************************/
});