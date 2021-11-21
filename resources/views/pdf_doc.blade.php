@extends('layouts.pdf')

@section('pdf_content')

    {{-- Define variável que será usada em /js/pdf.js para acessar as questões --}}
    <script> var questions = {!! json_encode($questions) !!}; </script>
    {{-- Define variável que será usada em /js/pdf.js para acessar o documento --}}
    <script> var doc = {!! json_encode($doc) !!}; </script>

    {{-- View (o que aparecerá para o user) --}}
    <div id="view">
        <div id="dialog-box">
            <div id="logo"><img src="/img/logo.svg" alt="ProvA+"></div>

            <h1 id="doc-name">{{$doc->name}}</h1>
            <div class="simple-line"></div>
            <div id="save-btn">Salvar PDF</div>
            <div id="help-btn">Preciso de instruções</div>

            <div id="save-instructions">
                <div class="arrow-down"></div>
                <span>Qual navegador você está utilizando?</span>
                <div class="browser simple-box">
                    <span>Google Chrome, Safari ou Opera</span>
                    <div class="arrow-down"></div>
                    <div class="browser-instruction">
                        <span>1) Vá até a barra lateral de configurações</span>
                        <img src="/img/instructions/chrome_1.png" alt="Vá na caixa de diálogo">
                        <span>2) Defina as configurações como na foto</span>
                        <img src="/img/instructions/chrome_2.png" alt="Mude o destino e desmarque cabeçalhos e rodapés">
                        <span>3) Clique em salvar</span>
                        <img src="/img/instructions/chrome_3.png" alt="Clique em salvar">
                    </div>
                </div>
                <div class="browser simple-box">
                    <span>Mozilla Firefox</span>
                    <div class="arrow-down"></div>
                    <div class="browser-instruction">
                        <span>1) Vá até a barra lateral de configurações e abra "Mais configurações"</span>
                        <img src="/img/instructions/firefox_1.png" alt="Vá na caixa de diálogo">
                        <span>2) Defina as configurações como na foto</span>
                        <img src="/img/instructions/firefox_2.png" alt="Mude o destino e desmarque cabeçalhos e rodapés">
                        <span>3) Clique em salvar</span>
                        <img src="/img/instructions/firefox_3.png" alt="Clique em salvar">
                    </div>
                </div>
                <div class="browser simple-box">
                    <span>Microsoft Edge</span>
                    <div class="arrow-down"></div>
                    <div class="browser-instruction">
                        <span>1) Vá até a barra lateral de configurações e abra "Mais configurações"</span>
                        <img src="/img/instructions/edge_1.png" alt="Vá na caixa de diálogo">
                        <span>2) Defina as configurações como na foto</span>
                        <img src="/img/instructions/edge_2.png" alt="Mude o destino e desmarque cabeçalhos e rodapés">
                        <span>3) Clique em salvar</span>
                        <img src="/img/instructions/edge_3.png" alt="Clique em salvar">
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- PDF (exibido somente no print) --}}
    <div id="pdf">

        {{-- Header do documento --}}
        <header>
            <div id="left">
                <div><span>Nome:</span><div class="blanket"></div></div>
                <div><span>Disciplina:</span><div class="blanket"></div></div>
                <div><span>Professor(a): {{$user->name}}</span></div>
            </div>
            <div id="center">
                <div><span>Turma:</span><div class="blanket"></div></div>
                <div><span>Data:</span><div class="blanket"></div></div>
            </div>
            <div id="right">
                <img src="/img/logo.png" alt="">
            </div>
        </header>
        
        {{-- Instruções para os alunos --}}
        <section id="instructions">
            <ul>
                <li>Leia e realize as questões com atenção.</li>
                <li>Utilize caneta esferográfica azul ou preta.</li>
                <li>A prova terá duração de 1 hora e 30 minutos.</li>
                <li>Ao término da prova, levante a mão e aguarde o(a) professor(a).</li>
            </ul>
        </section>
        
        {{-- Questões --}}
        <section id="questions">
            {{-- Aqui são inseridas as questões --}}
        </section>

    </div>


@endsection