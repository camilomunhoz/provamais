@extends('layouts.section')

@section('title', '| Novo documento')
@section('css', '/css/create_quest.css')

{{-- URL para redirecionamento caso a ação seja cancelada --}}
@section('if-cancelled', '/my_docs')

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
@section('section-title', 'Novo documento')

{{-- Adiciona um botão de cancelar no header --}}
@section('add-header-section')
    <div class="header-section cancel-action">
        <span>Cancelar</span>
        <img src="/img/icons/ico_plus.svg" alt="X">
    </div>
@endsection

{{-- Conteúdo da seção --}}
@section('section_content')

    
    
@endsection