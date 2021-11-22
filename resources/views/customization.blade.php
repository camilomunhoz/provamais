@extends('layouts.section')

@section('title', '| Personalização dso documentos')
@section('css', '/css/customization.css')

{{-- Define título do header --}}
@section('section-title', 'Personalização dos documentos')

{{-- Conteúdo da seção --}}
@section('section_content')

    {{-- Define variáveis que serão usadas em /js/customization.js para acessar as images e instruções --}}
    <script> var images = {!! json_encode($images) !!}; </script>
    <script> var instructions = {!! json_encode($instructions) !!}; </script>
    <script type="text/javascript" src="/js/customization.js"></script>

    <div id="explanation">
        Aqui você pode definir opções para a personalização de seus documentos.<br>
        Você pode aplicá-las ao salvar um documento.</div>

    {{-- Imagens --}}
    <section class="simple-box" id="section-images">
        <h1>Imagens para cabeçalho</h1><span class="add">Adicionar</span>
        {{-- <div class="small-tip" id="info-img">
            <img src="/img/icons/ico_help.svg">
            <div class="tip-msg">Dica: utilize imagens com orientação horizontal
                <div><div class="tip-detail"></div></div>
            </div>
        </div> --}}
        <div class="simple-line"></div>

        <div id="images">

            {{-- Overlay de adição de imagem --}}
            <div id="overlay-add-image">
                @csrf
                <label for="img" id="img-label">Escolher imagem</label>
                <input type="file" accept=".jpg, .jpeg, .png" name="quest_img" id="img">
                <span id="img-name">Nenhuma imagem selecionada</span>
                <input type="checkbox" name="image_flag" id="img-flag" value="0">
                <label for="img-flag" id="img-x"><img class="x x-img" src="/img/icons/ico_plus.svg" alt="X" title="Remover imagem"></label>
                <span id="save-img" class="confirmation-btn-hard">Salvar</span>
            </div>

            {{-- Imagens --}}
            <div id="default-img" class="image simple-box">
                <div class="arrow-down"></div>
                <div class="image-title">Padrão</div>
                <img src="/img/logo.png">
            </div>
        </div>
    </section>

    {{-- Instruções --}}
    <section class="simple-box" id="section-instructions">
        <h1>Instruções para os alunos</h1>
        <span class="add">Adicionar</span>
        <div class="simple-line"></div>

        <div id="instructions">

            {{-- Overlay de adição de instruções --}}
            <div id="overlay-add-instruction">
                @csrf
                <label for="instruction-name"><span>Nome das instruções:</span><input id="instruction-name" class="simple-box" type="text"></label>
                <span>Escreva abaixo as instruções:</span>
                <label id="inputs-instruction" class="simple-box">
                    <span class="bullet">&bull;</span><textarea type="text"></textarea>
                </label>
                <span id="save-instruction" class="confirmation-btn-hard">Salvar</span>
                <div class="simple-line"></div>
            </div>

            {{-- Instruções --}}
            <div id="default-instruction" class="instruction simple-box">
                <div class="arrow-down"></div>
                <div class="instruction-title">Padrão</div>
                <ul>
                    <li>Leia e realize as questões com atenção;</li>
                    <li>Utilize caneta esferográfica azul ou preta;</li>
                    <li>Ao término da prova, levante a mão e aguarde o(a) professor(a);</li>
                </ul>
            </div>
        </div>
    </section>


@endsection