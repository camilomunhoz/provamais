@extends('layouts.section')

@section('title', '| Edição de questão')
@section('css', '/css/create_quest.css')

{{-- URL para redirecionamento caso a ação seja cancelada --}}
@section('if-cancelled', '/my_quests')

{{-- Linkando o Quill e Katex --}}
@section('quill')
    <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
	<link href="//cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css" integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn" crossorigin="anonymous">
    <script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.js" integrity="sha384-pK1WpvzWVBQiP0/GjnvRxV4mOb0oxFuyRxJlk6vVw146n3egcN5C925NCP7a7BY8" crossorigin="anonymous"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
@endsection

{{-- Define o título do header --}}
@if(session('duplicated') == null)
    @section('section-title', 'Edição de questão')
@else
    @section('section-title', 'Editando questão duplicada')
@endif

{{-- Adiciona um botão de cancelar no header caso não seja uma duplicação --}}
@if(session('duplicated') == null)
    @section('add-header-section')
        <div class="header-section cancel-action">
            <span>Cancelar</span>
            <img src="/img/icons/ico_plus.svg" alt="X">
        </div>
    @endsection
@endif

{{-- Conteúdo da seção --}}
@section('section_content')

    {{-- Define variável que será usada em /js/create_edit_quest.js para acessar os detalhes da questão --}}
    <script> var question = {!! json_encode($question) !!}; </script>

    {{-- Define variável que será usada em /js/create_edit_quest.js para saber a origem da edição --}}
    @if(session('origin') == 'doc' || isset($origin))
        <script> var origin = 'doc'; </script>
    @else
        <script> var origin = 'questions'; </script>
    @endif    
    
    <script type="text/javascript" src="/js/create_quest.js"></script>

    <form id="new-quest"> @csrf <input type="hidden" name="identifier" value="{{$identifier}}">
        
        {{-- Tipo --}}
        <div class="row">
            <input type="checkbox" name="quest_type_flag" id="quest-type-flag" value="NULL">
            <div class="row-content-left aligned-center-right">
                <span class="bigger-label required">Tipo da questão</span>
            </div>
            <div class="row-content-right simple-box">
                <div id="wrp-quest-type">
                    <div class="quest-type" id="type-alter"><img src="/img/icons/quest_alter.svg" alt="Questão objetiva"><span class="bigger-label">Objetiva</span></div>
                    <div class="quest-type" id="type-essay"><img src="/img/icons/quest_disser.svg" alt="Questão dissertativa"><span class="bigger-label">Dissertativa</span></div>
                </div>
                <span class="error-feedback" id="error-type"></span>
            </div>
        </div>

        {{-- Enunciado --}}
        <div class="row hidden">
            <div class="row-content-left aligned-top-right">
                <span class="bigger-label required">Enunciado</span>
            </div>
            <div class="row-content-right statement wrp-quill">
                <div id="input-statement" class="simple-box"></div>
                <span class="error-feedback" id="error-statement"></span>
            </div>
        </div>

        {{-- Alternativas / para questões objetivas --}}
        <div class="row hidden">
            <div class="row-content-left aligned-top-right" id="alters-sidebar">
                <span class="bigger-label required">
                    <div class="small-tip" id="info-format" title="Como formatar o conteúdo?">
                        <img src="/img/icons/ico_help.svg">
                        <div class="tip-msg">
                            <img src="/img/gif/format_option.gif" alt="Selecione o texto para formatar">
                            <div><div class="tip-detail"></div></div>
                        </div>
                    </div>
                    Alternativas
                </span>
                <label for="correct" id="correct-label"> <span class="required">Correta:</span><br>
                    <select name="correct" id="correct" class="simple-box"></select>
                    <span class="error-feedback" id="error-correct"></span>
                </label>
            </div>
            <div class="row-content-right">
                <div class="alters wrp-quill">
                    
                    {{-- Aqui vão as alternativas via JS --}}

                </div>
                <div id="add-alter"><img src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">Adicionar alternativa</div>
                <span class="error-feedback" id="error-options"></span>
            </div>
        </div>

        {{-- Número de linhas / para questões dissertativas --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span class="required">Número de linhas</span>
            </div>
            <div class="row-content-right">
                <input type="number" name="n_lines" class="simple-box" id="n-lines" max="99" min="1" onkeypress="$(this).mask('00');" value=5 onkeydown="return event.key != 'Enter';">
                <span class="error-feedback" id="error-n-lines"></span>
            </div>
        </div>

        {{-- Sugestão de resposta / para questões dissertativas --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span>Sugestão de resposta</span>
            </div>
            <div class="row-content-right">
                <input type="text" name="answer_suggestion" class="simple-box" id="answer" onkeydown="return event.key != 'Enter';">
                <span class="error-feedback" id="error-answer_suggestion"></span>
            </div>
        </div>

        {{-- Imagem --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span>Incluir imagem</span>
            </div>
            <div class="row-content-right wrp-img-input">
                <label for="quest-img" id="quest-img-label">Escolher imagem</label>
                <input type="file" accept=".jpg, .jpeg, .png" name="quest_img" id="quest-img">
                <span id="img-name"> @if(!$question->image) Nenhuma imagem selecionada @endif</span>
                <input type="checkbox" name="image_flag" id="quest-img-flag" value="0">
                <label for="quest-img-flag" id="quest-img-x"><img class="x x-img" src="/img/icons/ico_plus.svg" alt="X" title="Remover imagem"></label>
                <span class="error-feedback" id="error-image"></span>
            </div>
        </div>

        {{-- Disciplina --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span class="required">Disciplina</span>
            </div>
            <div class="row-content-right">
                <select name="subject_id" class="simple-box" id="subject">
                    <option value="">&lt; Selecionar &gt;</option>
                    @foreach ($subjects as $subject)
                        <option value="{{$subject->id}}">{{$subject->name}}</option>
                    @endforeach
                </select>
                <span class="error-feedback" id="error-subject_id"></span>
            </div>
        </div>

        {{-- Conteúdo --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span class="required">Conteúdo</span>
            </div>
            <div class="row-content-right">
                <input type="text" name="content" class="simple-box" id="content-tag" onkeydown="return event.key != 'Enter';">
                <span class="error-feedback" id="error-content"></span>
            </div>
        </div>

        {{-- Outros termos --}}
        <div class="row hidden">
            <div id="other-terms-label" class="row-content-left aligned-top-right">
                <span>Outros termos para pesquisa</span>
            </div>
            <div class="row-content-right">
                <input type="text" name="other_terms" class="simple-box" id="other-terms" maxlength="80" placeholder="Digite e insira com a tecla 'Enter' " onkeydown="return event.key != 'Enter';" autocomplete="off">
                <div id="tags"></div>
                <span class="error-feedback" id="error-other-terms"></span>
            </div>
        </div>

        {{-- Escolha privacidade --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span>Questão privada</span>
            </div>
            <div class="row-content-right is-private">
                <label for="no" class="checkbox-label">
                    <input class="simple-box" name="privacy" type="radio" id="no" value="0">
                    <div class="checkbox"><div class="checkmark"></div></div>
                    <span>Não</span>
                </label>
                <label for="yes" class="checkbox-label">
                    <input class="simple-box" name="privacy" type="radio" id="yes" value="1">
                    <div class="checkbox"><div class="checkmark"></div></div>
                    <span>Sim</span>
                </label>
                <span class="error-feedback" id="error-privacy">Este campo é obrigatório.</span>
            </div>
        </div>
        
        {{-- Botão de salvar --}}
        <div class="row hidden">
            <div class="row-content-left">
                {{-- espaço vazio proposital --}}
            </div>
            <div class="row-content-right">
                <input type="submit" value="Salvar" class="confirmation-btn-hard save-btn" id="save-and-leave">
            </div>
        </div>

        <div class="row breathe-space"></div>
    </form>
    
@endsection