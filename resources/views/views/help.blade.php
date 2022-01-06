@extends('layouts.section')

@section('title', '| Ajuda')
@section('css', '/css/help.css')

{{-- Define o título do header --}}
@section('section-title', 'Tutoriais do Prova+')

{{-- Conteúdo da seção --}}
@section('section_content')

    <div id="sidebar" class="simple-box">
        <h1>Tópicos</h1>
        <a href="#advice-1" class="advice-link">Como cadastrar uma questão</a>
        <a href="#advice-2" class="advice-link">Como adaptar uma questão de terceiro</a>
        <a href="#advice-3" class="advice-link">Como criar um documento</a>
        <a href="#advice-4" class="advice-link">Como criar um cabeçalho personalizado</a>
    </div>

    <section id="advices">
        <div class="advice" id="advice-1">
            <h1>Como cadastrar uma questão</h1>
            <ol>
                <li>Acesse a guia "Minhas questões" no menu superior;</li>
                <li>Clique no botão vermelho de "+" no canto inferior direito;</li>
                <li>Escolha o tipo da questão (dissertativa ou objetiva);</li>
                <li>Preencha as informações e clique em salvar.</li>
            </ol>
        </div>
        <div class="advice" id="advice-2">
            <h1>Como adaptar uma questão de terceiro</h1>
            <ol>
                <li>Em um ambiente em que seja possível visualizar questões de terceiros, clique na questão desejada;</li>
                <li>No canto superior direito, clique no ícone de edição;</li>
                <li>Você será redirecionado para a página de edição e uma cópia da questão é salva automaticamente em suas questões. Note que não é possível tornar pública uma questão adaptada de terceiros;</li>
                <li>Edite os dados desejados e clique em "Salvar".</li>
            </ol>
        </div>
        <div class="advice" id="advice-3">
            <h1>Como criar um documento</h1>
            <ol>
                <li>Acesse a guia "Meus documentos" no menu superior;</li>
                <li>Clique no botão vermelho de "+" no canto inferior direito;</li>
                <li>Clique em "Adicionar questões" para escolher as questões desejadas;</li>
                <li>Selecione as questões e clique em "Inserir";</li>
                <li>Clique em "Salvar" no menu superior, preencha as informações e clique novamente em "Salvar".</li>
            </ol>
        </div>
        
        <div class="advice" id="advice-4">
            <h1>Como personalizar documentos</h1>
            <ol>
                <li>Acesse a guia "Meus documentos" no menu superior;</li>
                <li>Ao lado da barra de pesquisa, clique em "Personalizar";</li>
                <li>Já no ambiente de personalização, insira imagens de cabeçalho e/ou instruções personalizadas;</li>
                <li>Agora é possível aplicar as personalizações ao salvar um documento.</li>
            </ol>
        </div>
    </section>

@endsection