$(document).ready(function() {
    $('#save-btn').on('click', () => {print()});

    /***********************************************************************/
    /******************* Insere as questões selecionadas *******************/
    /***********************************************************************/
    
    var count = 0; // Conta o número de questões inseridas. Incrementada em getQuestEnumerator()

    function insertQuestion(q) {
        // Insere a questão
        $('#questions').append(
            '<div class="question" id="'+q.identifier+'">'+
                '<div class="question-content" data-question-id="'+q.identifier+'">'+
                    '<div class="statement"></div>'+
                '</div>'+
            '</div>'
        );
        // Adiciona o enunciado com Quill e o enumerador
        let stmt = new Quill('.question-content[data-question-id="'+q.identifier+'"] .statement',
                        {theme: 'bubble', enable: 'false', readOnly: true});
        let stmtAndEnum = JSON.parse(q.statement);
        stmtAndEnum.ops.unshift({insert: getQuestEnumerator(), attributes: {bold: true} });
        stmt.setContents(stmtAndEnum);
        stmt.disable();

        // Adiciona a imagem se houver
        if (q.image) {
            $('.question-content[data-question-id="'+q.identifier+'"]').append(
                '<img class="image" src="/img/questions_images/'+q.image+'">'
            );
        }
        // Adiciona as alternativas se houver
        if (q.options && q.options.length) {
            $('.question-content[data-question-id="'+q.identifier+'"]').append(
                '<div class="options"></div>'
            );
            for(let i = 0; i < q.options.length; i++){
                $('.question-content[data-question-id="'+q.identifier+'"] .options').append(
                    '<div class="option-container opt-'+i+'"></div>'
                );
                $('.question-content[data-question-id="'+q.identifier+'"] .opt-'+i).append(
                    '<div class="option o-'+i+'"></div>'
                );
                let option = new Quill('.question-content[data-question-id="'+q.identifier+'"] .o-'+i,
                                        {theme: 'bubble', enable: 'false', readOnly: 'true'});
                let optAndEnum = JSON.parse(q.options[i].content);
                optAndEnum.ops.unshift({insert: getOptionEnumerator(i), attributes: {bold: true} });
                option.setContents(optAndEnum);
                option.disable();

                // Destaca a resposta correta caso seja gabarito
                try {
                    if (typeof answers !== 'undefined') {
                        if (answers[count-1] == i) {
                            $('.question-content[data-question-id="'+q.identifier+'"] .o-'+i).css({fontWeight: 'bold', color: 'red', border: '1px dashed red'});
                        } 
                    }
                } catch (e) {}
            }
        }
        // Adiciona linhas caso seja dissertativa e não seja gabarito
        try {
            if (typeof answers === 'undefined') {
                if (q.type == 'Dissertativa') {
                    let lines = q.n_lines;
                    while (lines > 0) {
                        $('.question[id="'+q.identifier+'"]').append('<div class="line"></div>');
                        lines--;
                    }
                }
            }
            // Se for gabarito, adiciona a resposta
            else {
                if (q.type == 'Dissertativa') {
                    if (answers[count-1] != '') {
                        $('.question[id="'+q.identifier+'"]').append('<div class="essay-answer">'+answers[count-1]+'</div>');
                    }
                    else {
                        $('.question[id="'+q.identifier+'"]').append('<div class="essay-answer">-</div>');
                    }
                }
            }
        } catch (e) {}
    }
    for (let q of questions) {
        insertQuestion(q);
    }


    /***********************************************************************/
    /********* Funções para enumeração das questões e alternativas *********/
    /***********************************************************************/

    // Atualiza os enumeradores das questões
    function getQuestEnumerator() {
        let enu = '';
        count++;
        if (doc.question_enumerator == '1.') {
            enu = String(count)+'. ';
        }
        else if (doc.question_enumerator == '1)') {
            enu = String(count)+') ';
        }
        else if (doc.question_enumerator == '1-') {
            enu = String(count)+' - ';
        }
        else if (doc.question_enumerator == 'Q1.') {
            enu = 'Questão '+String(count)+'. ';
        }
        else if (doc.question_enumerator == 'Q1-') {
            enu = 'Questão '+String(count)+' - ';
        }
        return enu;
    }

    // Atualiza os enumeradores das opções
    function getOptionEnumerator(optCount) {
        let enu = '';
        if (doc.options_enumerator == 'a)') {
            enu = String.fromCharCode(97+optCount)+') ';
        }
        else if (doc.options_enumerator == 'A)') {
            enu = String.fromCharCode(65+optCount)+') ';
        }
        return enu;
    }

    /**************************************************************/
    /********************** Exibe instruções **********************/
    /**************************************************************/

    $('#help-btn').on('click', () => {
        if ($('#save-instructions').css('display') == 'none') {
            $('#save-instructions').slideDown(200);
        }
        else {
            $('#save-instructions').slideUp(200);
            $('.browser-instruction').slideUp(200);
        }
    });
    $('.browser').on('click', (e) => {
        if ($(e.currentTarget).children('.browser-instruction').css('display') == 'none') {
            $(e.currentTarget).children('.browser-instruction').slideDown(200);
        }
        else {
            $(e.currentTarget).children('.browser-instruction').slideUp(200);
        }
    });
    
});