@extends('layouts.main')

@section('css', '/css/homepage.css')

@if(session('login'))
    @section('js', '/js/script_for_login.js')
@elseif($errors->any())
    @section('js', '/js/script_for_signup.js')
@else
    @section('js', '/js/script_homepage.js')
@endif

@section('content')

    <div id="deco"></div>
    <div id="wrp-homepage">
        
        {{-- Seção para ir ao login e cadastro --}}
        <div id="entrada">
            <img id="logo" src="/img/logo.svg" alt="Prova+">
            @auth
                <a id="wrp-btn-go-in" href="/my_docs"><span>Entrar</span></a>
                <a id="btn-logout" href="/logout">Encerrar sessão</a>
            @endauth
            @guest
                <button id="btn-go-login">Entrar</button>
                <button id="btn-go-signup">Cadastre-se</button>
            @endguest
            <a id="conheca" href="#infos">Clique aqui e conheça<br><img class="go-arrow" src="/img/hmpg/down-arrow.svg"></a>
        </div>

        {{-- Seção do slide-show --}}
        <div id="slider">

            {{-- Frases --}}
            <div id="frases-wrp">
                <span class="frase f1">Crie provas rapidamente.</span>
                <span class="frase f2">Organize suas questões.</span>
                <span class="frase f3">Desfrute de um banco de questões colaborativo.</span>
                <span class="frase f4">Contribua com a comunidade acadêmica e escolar.</span>
                <span class="frase f5">Agilize sua produção de material.</span>
            </div>

            {{-- Imagens --}}
            <img class="slide s1" src="/img/hmpg/1.png" alt="">
            <img class="slide s2" src="/img/hmpg/2.png" alt="">
            <img class="slide s3" src="/img/hmpg/3.png" alt="">
            <img class="slide s4" src="/img/hmpg/4.png" alt="">
            <img class="slide s5" src="/img/hmpg/5.png" alt="">

            <div id="left-arrow"></div>
            <div id="right-arrow"></div>
        </div>

        <div id="slider-scrl"> {{-- Progresso do slide-show --}}
            <div class="dot d1"></div>
            <div class="dot d2"></div>
            <div class="dot d3"></div>
            <div class="dot d4"></div>
            <div class="dot d5"></div>
        </div>
        
        <div id="infos"></div> {{-- Aqui se inserem as infos no mobile --}}
    </div> 

    {{-- Overlay de login e cadastro --}}
    <div id="wrp-overlay">
        <div id="overlay">
            <!-- <div id="tapa-buraco"></div> -->
            <span id="voltar">&#60;&nbsp;&nbsp;&nbsp;Voltar</span>
            <span id="x-voltar">&#60;</span>

            <div id="illust-wrp">
                <img class="illustration io1" src="/img/hmpg/overlay-illustration-left.svg" alt="">
                <img class="illustration io2" src="/img/hmpg/overlay-illustration-right.svg" alt="">
                <div id="circulo"></div>
            </div>

            {{-- Login --}}
            <div id="wrp-login">
                <span id="login-label">ENTRAR</span>
                <form id="form-login" action="/login" method="POST">
                    @csrf
                    @if($errors->any() && session('login'))
                        @foreach($errors->all() as $error)
                            <div class="error-banner">{{ $error }}</div>
                        @endforeach
                    @endif
                    @if(session('status'))
                        <script>alert("{{session('status')}}")</script>
                    @endif
                    <input type="text" maxlength="255" class="form-input" name="email" placeholder="E-mail" @if(session('login')) value="{{ old('email') }}" @endif required>
                    <input type="password" maxlength="255" class="form-input" name="password" placeholder="Senha" required>
                    <a href="/password/reset" id="forgot-pswd">Esqueci minha senha</a>
                    <input id="btn-login" type="submit" value="ENTRAR">
                </form>
            </div>

            {{-- Cadastro --}}
            <div id="wrp-signup">
                <span id="signup-label">CADASTRE-SE</span>
                <form id="form-signup" action="/register" method="POST">
                    @csrf
                    <input type="text" maxlength="146" class="form-input @error('name') invalid-signup-input @enderror" name="name" placeholder="Nome completo" value="{{ old('name') }}">
                        @error('name') <span class="error-feedback">{{$message}}</span> @enderror

                    <input type="text" maxlength="14" class="form-input @error('cpf') invalid-signup-input @enderror" name="cpf" placeholder="CPF" onchange="$(this).mask('000.000.000-00');" onkeypress="$(this).mask('000.000.000-00');" value="{{ old('cpf') }}">
                        @error('cpf') <span class="error-feedback">{{$message}}</span> @enderror

                    <input type="text" maxlength="255" class="form-input @error('email') invalid-signup-input @enderror" name="email" placeholder="E-mail" @if(!session('login')) value="{{ old('email') }}" @endif>
                        @error('email') <span class="error-feedback">{{$message}}</span> @enderror

                    <input type="password" maxlength="255" class="form-input @error('password') invalid-signup-input @enderror" name="password" placeholder="Senha">
                    <span class="error-pswd-feedback @error('password') error-feedback @enderror">A senha deve ter tamanho mínimo de 8 caracteres e conter uma letra maíuscula e um número.</span>
                    
                    <input type="password" maxlength="255" class="form-input @error('password_confirmation') invalid-signup-input @enderror @error('password') invalid-signup-input @enderror" name="password_confirmation" placeholder="Confirme sua senha">
                        @error('password') <span class="error-feedback"> {{$message}} </span> @enderror
                        @error('password_confirmation') <span class="error-feedback">{{$message}}</span> @enderror

                    <div id="terms">
                        <label for="terms-of-use" class="checkbox-label">
                            <input type="checkbox" class="simple-box" name="terms_of_use" id="terms-of-use" value="1">
                            <div class="checkbox"><div class="checkmark"></div></div>
                        </label>
                        <div id="see-terms">
                            Aceito os termos de uso e condições
                            <a href="/terms_of_use" target="_blank"><img src="/img/icons/ico_new_tab.svg" alt="Ler termos de uso e condiçoes" title="Ler termos de uso e condiçoes"></a>
                        </div>
                    </div>
                    <input id="btn-signup" type="submit" value="CADASTRE-SE">
                </form>
            </div>
        </div>
    </div>

@endsection