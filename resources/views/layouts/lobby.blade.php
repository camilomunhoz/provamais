@extends('layouts.main')

@section('css', '/css/lobby.css')
@section('js', '/js/script_lobby.js')

@section('content')

    <nav>
        {{-- Itens à esquerda --}}

        <div id="nav-left-items">
        
            <div id="profile">
                <img src="/img/users_profile_pics/{{($user->profile_pic)}}" id="profile-picture" title="Perfil">
            </div>

            {{-- nav 2 / Profile --}}
            
            <span class="nav-2 username"> {{$user->name}} </span>
            <div class="nav-2 line-detail"></div>
            <a href="/my_profile" class="nav-2 nav2-section">
                <img src="/img/icons/ico_edit_profile.svg" class="section-img">
                <span class="section-title">Editar perfil</span>
            </a>
            <div class="nav-2 line-detail"></div>
            <div class="nav-2 nav2-section close-nav-2"><span>Fechar</span></div>

            {{-- nav 1 / Menus --}}

            <a href="/my_docs" id="my-tests" class="nav-1 nav-section @yield('current_1')">
                <img src="/img/icons/ico_tests.svg" class="section-img">
                <span class="section-title">Minhas avaliações</span>
                @yield('current-detail_1')
            </a>
    
            <a href="/my_quests" id="my-quests" class="nav-1 nav-section @yield('current_2')">
                <img src="/img/icons/ico_quests.svg" class="section-img">
                <span class="section-title">Minhas questões</span>
                @yield('current-detail_2')
            </a>
    
            <a href="/search_quests" id="search-quests" class="nav-1 nav-section @yield('current_3')">
                <img src="/img/icons/ico_search.svg" class="section-img">
                <span class="section-title">Procurar questões</span>
                @yield('current-detail_3')
            </a>
        </div>

        {{-- Itens à direita --}}
        
        <div id="nav-right-items">

            {{-- nav 2 / Profile --}}
            <a href="/logout" class="nav-2 nav-section logout">
                <img src="/img/icons/ico_logout.svg" alt="Sair">
                <span>Sair</span>
            </a>

            {{-- nav 1 / Menus --}} 
            <a href="/help" target="_blank" class="nav-1 nav-section help">
                <img src="/img/icons/ico_help.svg" alt="Ajuda">
                <span>Ajuda</span>
            </a>

            <div id="logo"><img src="/img/logo.svg" id="logo-img"></div>
        </div>

    </nav>

    <header>
        <div id="header-left-items">
            <img id="header-img" src="@yield('header-img')" alt="@yield('header_img_desc')">
            <span id="header-title">@yield('header-title')</span>
        </div>

        <form action="@yield('search-route')" method="GET" id="header-right-items">
            @csrf
            <input type="text" placeholder="@yield('search-placeholder')" class="search-box simple-box">
            <button type="submit" class="search-submit no-style">
                <img src="/img/icons/ico_search_box.svg" alt="Pesquisar" title="Pesquisar">
            </button>
        </form>   
    </header>

    <div class="simple-line"></div>

        @yield('lobby_content')

@endsection