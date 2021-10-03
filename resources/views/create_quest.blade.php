@extends('layouts.section')

@section('title', '| Nova questão')
@section('css', '/css/create_quest.css')

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
@section('section-title', 'Nova questão')

{{-- Adiciona um botão de cancelar no header --}}
@section('add-header-section')
    <div class="header-section cancel-action">
        <span>Cancelar</span>
        <img src="/img/icons/ico_plus.svg" alt="X">
    </div>
@endsection

{{-- Conteúdo da seção --}}
@section('section_content')

    <form id="new-quest" action="" enctype="multipart/form-data"> @csrf
        
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
            </div>
        </div>

        {{-- Enunciado --}}
        <div class="row hidden">
            <div class="row-content-left aligned-top-right">
                <span class="bigger-label required">Enunciado</span>
            </div>
            <div class="row-content-right statement wrp-quill">
                <div id="input-statement" class="simple-box"></div>
            </div>
        </div>

        {{-- Alternativas / para questões objetivas --}}
        <div class="row hidden">
            <div class="row-content-left aligned-top-right">
                <span class="bigger-label required">Alternativas</span>
            </div>
            <div class="row-content-right">
                <div class="alters wrp-quill">
                    <div class="alternative">
                        <span class="letter">&#97;)</span><div class="a0 simple-box"></div>
                        <img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">
                    </div>
                    <div class="alternative">
                        <span class="letter">&#98;)</span><div class="a1 simple-box"></div>
                        <img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">
                    </div>
                    <div class="alternative">
                        <span class="letter">&#99;)</span><div class="a2 simple-box"></div>
                        <img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">
                    </div>
                    <div class="alternative">
                        <span class="letter">&#100;)</span><div class="a3 simple-box"></div>
                        <img class="x x-alter" src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">
                    </div>
                </div>
                <div id="add-alter"><img src="/img/icons/ico_plus.svg" alt="X" title="Apagar alternativa">Adicionar alternativa</div>
            </div>
        </div>

        {{-- Número de linhas / para questões dissertativas --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span class="required">Número de linhas</span>
            </div>
            <div class="row-content-right">
                <input type="number" name="n_lines" class="simple-box" id="n-lines" max="99" min="1" onkeypress="$(this).mask('00');" value=5>
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
                <span id="img-name">Nenhuma imagem selecionada</span>
                <input type="checkbox" name="quest_img_flag" id="quest-img-flag" value="0">
                <label for="quest-img-flag" id="quest-img-x"><img class="x x-img" src="/img/icons/ico_plus.svg" alt="X" title="Remover imagem"></label>
            </div>
        </div>

        {{-- Disciplina --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span class="required">Disciplina</span>
            </div>
            <div class="row-content-right">
                <select name="subject" class="simple-box" id="subject">
                    <option value="NULL">&lt; Selecionar &gt;</option>
                    @foreach ($subjects as $subject)
                        <option value="{{$subject->id}}">{{$subject->name}}</option>
                    @endforeach
                </select>
            </div>
        </div>

        {{-- Conteúdo --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span class="required">Conteúdo</span>
            </div>
            <div class="row-content-right">
                <input type="text" name="content" class="simple-box" id="content-tag">
            </div>
        </div>

        {{-- Outros termos --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span>Outros termos para pesquisa</span>
            </div>
            <div class="row-content-right">
                <input type="text" name="other_terms" class="simple-box" id="other-terms">
            </div>
        </div>

        {{-- Escolha privacidade --}}
        <div class="row hidden">
            <div class="row-content-left aligned-center-right">
                <span>Questão privada</span>
            </div>
            <div class="row-content-right is-private">
                <label for="no" class="checkbox-label">
                    <input class="simple-box" name="privacy" type="radio" id="no" checked>
                    <div class="checkbox"><div class="checkmark"></div></div>
                    <span>Não</span>
                </label>
                <label for="yes" class="checkbox-label">
                    <input class="simple-box" name="privacy" type="radio" id="yes">
                    <div class="checkbox"><div class="checkmark"></div></div>
                    <span>Sim</span>
                </label>
            </div>
        </div>
        
        {{-- Botão de salvar --}}
        <div class="row hidden">
            <div class="row-content-left">
                {{-- espaço vazio --}}
            </div>
            <div class="row-content-right">
                <input type="submit" value="Salvar" class="confirmation-btn-hard save-btn">
                <input type="submit" value="Salvar e cadastrar mais uma" class="confirmation-btn-light save-btn">
            </div>
        </div>

        <div class="row breathe-space"></div>
    </form>

    {{-- <script>
        $(() => {
            $('#new-quest').submit((e) => {
                e.preventDefault();

                $.ajax({
                    // url: "{{ route('teste') }}",
                });
            });
        });
    </script> --}}
    
@endsection