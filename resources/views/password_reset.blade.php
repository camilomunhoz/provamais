@extends('layouts.main')
@section('title', '| Recuperação de senha')
{{-- @section('js', '/js/pdf.js') --}}
@section('css', '/css/reset_password.css')

@section('content')

    <div id="wrapper">

        <form action="/password/reset/validation" method="POST">
            @csrf
            <div id="logo"><img src="/img/logo.svg" alt="ProvA+"></div>

            <h1>Insira seu e-mail cadastrado</h1>
            <input class="simple-box" type="text" name="email" placeholder="E-mail" @if(session('status')) value="{{old('email')}}" @endif>
            @if(!session('status'))
                <span class="info">Um link para redefinição de senha será enviado ao e-mail informado.</span>
            @else
                {{-- <span class="info"> @error('email') {{$message}} @enderror</span> --}}
                <span class="info">
                    @if(session('status'))
                        {{session('status')}}
                    @endif
                </span>
            @endif
            <input type="submit" value="Recuperar acesso" class="save-btn confirmation-btn-hard">
        </form>

        <script>
            $('input[type=text]').on('input', (e) => {
                if (!$(e.currentTarget).val() || $(e.currentTarget).val().match(/^(\s+)$/)) {
                    $('.save-btn').css({
                        userSelect: 'none',
                        pointerEvents: 'none',
                        filter: 'grayscale(100%)',
                        opacity: '.6'
                    })
                    .removeAttr('type');
                }
                else {
                    $('.save-btn').css({
                        userSelect: 'all',
                        pointerEvents: 'all',
                        filter: 'none',
                        opacity: '1'
                    })
                    $('.save-btn').attr('type', 'submit');
                }
            });
        </script>
    </div>

@endsection