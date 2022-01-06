@extends('layouts.main')

@section('js', '/js/script_section.js')

@section('content')

    <header>
        {{-- Itens à esquerda --}}

        <div id="header-left-items">
            <div class="header-detail header-section"></div>
            <span id="section-title">@yield('section-title')</span>
        </div>

        {{-- Itens à direita --}}
        
        <div id="header-right-items">

            @yield('add-header-section') {{-- Aqui entra algum botão como "cancelar" ou "voltar" --}}

            <div id="logo"><img src="/img/logo.svg" id="logo-img"></div>
        </div>

    </header>

    <div class="black-overlay cancel-overlay">
        <div class="confirm-action simple-box">
            <span class="confirmation-header"><b>Deseja mesmo sair?</b></span>
            <span class="confirmation-details">Todo o conteúdo não salvo será perdido.</span>
            <div class="confirmation-buttons">
                <span class="confirmation-btn-hard">Não</span>
                <a href="@yield('if-cancelled')" class="confirmation-btn-light">Sair</a>
            </div>
        </div>
    </div>

    <div id="content">

        @yield('section_content')

    </div>
    
@endsection