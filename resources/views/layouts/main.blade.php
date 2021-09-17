<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Prova+ @yield('title')</title>
		<link rel="stylesheet" href= @yield('css') type="text/css">
        <link rel="shortcut icon" href="/img/icone.ico">

        <script src="/js/jquery.js"></script>
        <script src="/js/jqueryUI/jquery-ui.js"></script>
        <script src="/js/jqueryMask/src/jquery.mask.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.3.0/jquery.form.min.js"></script>
        <script src= @yield('js') ></script>
        @yield('quill')
        
	</head>
	<body>
        {{-- Previne que HTML cru seja mostrado antes do CSS carregar --}}
        <div id="loading-overlay" style="background: #F00; position: absolute; height: 100%; width: 100%;"></div>
        @yield('banner')
        @yield('content')

    </body>
</html>