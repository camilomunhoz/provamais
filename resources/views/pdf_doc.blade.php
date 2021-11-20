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
                    <span>- Google Chrome ou Opera</span>
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
                    <span>- Mozilla Firefox</span>
                    <div class="arrow-down"></div>
                    <div class="browser-instruction">
                        <span>1) Vá até a barra lateral de configurações</span>
                        <img src="/img/instructions/firefox_1.png" alt="Vá na caixa de diálogo">
                        <span>2) Defina as configurações como na foto</span>
                        <img src="/img/instructions/firefox_2.png" alt="Mude o destino e desmarque cabeçalhos e rodapés">
                        <span>3) Clique em salvar</span>
                        <img src="/img/instructions/firefox_3.png" alt="Clique em salvar">
                    </div>
                </div>
                <div class="browser simple-box">
                    <span>- Microsoft Edge</span>
                    <div class="arrow-down"></div>
                    <div class="browser-instruction">
                        <span>1) Vá até a barra lateral de configurações</span>
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

        {{-- <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem rerum nesciunt enim hic maxime inventore unde modi autem velit tenetur beatae esse error magni veritatis magnam, et, consequuntur eos! Earum asperiores saepe, nesciunt nostrum in enim, deserunt illo aliquam sit similique qui odio. Illo, corrupti aliquid, deserunt porro natus, ipsam officiis pariatur ullam nisi amet maxime distinctio earum tempore ducimus libero consequuntur quaerat. Maiores perferendis cumque repellat nisi asperiores facilis dignissimos, voluptates quisquam error tempore accusantium! Cumque eaque voluptates cum rerum iusto fugiat pariatur mollitia esse placeat, quaerat magnam nemo architecto culpa reprehenderit error tenetur! Nulla reprehenderit odit sunt, alias porro explicabo, quisquam molestias dolor voluptate reiciendis saepe, dicta soluta? Omnis, ducimus sapiente iusto cumque numquam eveniet vel enim eius facere dolore sunt unde error temporibus, placeat quisquam quibusdam totam maxime, incidunt in quod porro. Repudiandae et nemo quaerat ipsam. Repudiandae asperiores rerum omnis nisi voluptatem nobis. Ut temporibus eaque amet vero eum expedita reprehenderit aliquam consequuntur, provident corporis sit aut accusamus. Soluta repellendus qui rem aspernatur consectetur deleniti natus beatae excepturi est magni accusamus obcaecati sapiente ipsa praesentium mollitia assumenda provident eveniet aliquid quod, labore animi eos error vero. Excepturi accusamus ipsum quis voluptatibus aliquid magnam eius mollitia dolores est quas minus, facilis repellat architecto ducimus quasi recusandae quo? Porro praesentium suscipit ad. Blanditiis reiciendis magni reprehenderit laudantium labore expedita perspiciatis assumenda consectetur officiis eveniet vel doloribus recusandae ipsum dolores fuga velit enim ullam corporis sint dolore totam nam, perferendis aspernatur soluta? Ea qui quae odit ratione nobis totam consequuntur quo suscipit, exercitationem, voluptate laboriosam voluptatem minima? Aliquid delectus laboriosam quibusdam voluptas voluptates recusandae, temporibus rerum quas consequuntur perferendis iure distinctio quo ut corrupti odit amet fugit cum quasi sapiente cumque quaerat consectetur deserunt! Reprehenderit velit repellat magnam nulla exercitationem labore necessitatibus impedit consequuntur expedita. Quaerat aliquam molestiae modi sequi provident officia voluptas temporibus, ipsum tempore assumenda nostrum beatae. Fuga praesentium harum omnis magni ullam illo porro, sit sint ab, nulla, sequi architecto! Repellat, animi velit laboriosam nulla vel numquam ea eveniet pariatur obcaecati odit temporibus nesciunt hic libero, voluptatibus sequi tenetur iusto! Temporibus iusto magni architecto aut ad quasi quaerat atque quis dignissimos illum, soluta placeat quas recusandae perspiciatis facilis eligendi facere earum deserunt a nam dolore explicabo libero enim minima. Incidunt cum aliquid pariatur deserunt animi perferendis voluptas, similique ratione iure! Consectetur cupiditate, voluptas, delectus tempore libero nihil velit, distinctio laborum aliquam non repellat ab perferendis quas consequuntur reprehenderit accusamus vitae eos nemo veritatis numquam. Nihil, a quos omnis non aut vero porro iste earum officia dolore dolorem eveniet tempore cumque facilis rem reiciendis incidunt dignissimos minima doloremque eaque quae. Voluptas qui possimus numquam ullam, est cupiditate cum quasi quo nobis? Sit itaque suscipit laudantium nulla temporibus neque natus dolorum magni dicta voluptatem alias pariatur blanditiis repellendus aspernatur quisquam, omnis doloremque at! Nulla, vel architecto omnis dolore sed repellendus facilis consequuntur magni impedit. Id vitae eveniet optio et fugiat, cum reiciendis similique explicabo velit odio incidunt obcaecati tempore beatae dolore molestias modi recusandae saepe voluptate dignissimos aliquid. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae veniam, aliquam error cupiditate deserunt at tempora sed fugit accusantium! Qui beatae eveniet vitae repudiandae, quisquam, molestiae nisi amet nemo sit accusantium saepe error iusto voluptate atque deleniti. Qui numquam alias maxime facilis incidunt harum. Eaque quas nesciunt excepturi provident natus vel, officiis veniam enim eius ea doloremque velit illo ratione dolor voluptatem, accusamus unde. Reiciendis officia quam nihil ipsa pariatur expedita. Necessitatibus amet labore possimus aperiam molestiae reiciendis, optio asperiores voluptas, quod quos sint? Facere ducimus, aliquid dolorum fugiat eveniet sint? Dolores quod non aliquam deserunt doloribus corrupti maxime consectetur ex, reprehenderit quis. Odit quos incidunt placeat dicta sit minima in quisquam repellat a? Distinctio tenetur aperiam perferendis. Odit quod consequuntur deleniti eaque iste eveniet, hic voluptatibus esse officia aperiam tempora, officiis eius maiores quibusdam possimus minus architecto tenetur? Aliquid, quos! Deleniti, quam et! Amet illo dicta quis? Modi minima, nisi praesentium dolore excepturi itaque quaerat facere natus vitae, magni aliquid voluptatum esse atque ad suscipit quidem iusto quis officia placeat, vel blanditiis dolorem voluptas earum hic. Vel ad eos omnis nobis perferendis, beatae ipsum dolores magnam commodi assumenda porro in dolorum ea officia cumque. Eum atque voluptatem officiis obcaecati voluptatibus dolorum repellat? Voluptatibus, accusantium nemo impedit dolores quos et fugit cumque, minima optio non reiciendis tenetur incidunt expedita sit animi recusandae suscipit! Reiciendis voluptatem quidem corrupti, cumque consectetur amet perspiciatis odit obcaecati dolorum laboriosam quasi, tempora nisi ut dolores voluptas iure exercitationem tenetur consequatur blanditiis? Amet, odit dignissimos rerum aspernatur reiciendis cumque consequatur praesentium placeat obcaecati ipsa eum nihil doloremque esse ipsam voluptatem modi pariatur recusandae repellat veniam ullam error libero. Provident cumque quisquam nihil labore delectus animi ratione, nemo facere. Repellat illo consequatur nulla quam dolores quis aut, nemo perspiciatis qui, error amet recusandae magnam! Earum illo quis unde beatae sint at vel! Repellat cum dolores impedit error dolorum, eveniet provident beatae officia ipsa rem unde earum minima vero itaque libero quam et ut hic odio iure dignissimos odit exercitationem illum? Animi possimus enim, unde reprehenderit numquam perspiciatis reiciendis debitis quos non obcaecati aperiam nesciunt accusamus eveniet laboriosam alias dolorem molestiae explicabo asperiores, aliquam voluptates excepturi laborum quae consectetur harum. Eum delectus magnam incidunt! Mollitia repellendus consequatur nulla. Hic, perferendis. Eligendi enim tempore porro distinctio incidunt voluptate minima tempora possimus pariatur repellat ex debitis facere omnis iste expedita, natus quia nemo. Ipsa quisquam eligendi officiis delectus ad quas magni dolores illo atque amet, neque ut, voluptas aliquid tempore quibusdam qui soluta modi explicabo repudiandae? Harum quo officia assumenda eius voluptatibus, adipisci, aliquid, vel omnis ducimus odio libero. Magnam iusto vero illum est vitae inventore officiis ratione assumenda adipisci. Blanditiis distinctio dolorum necessitatibus quod sapiente excepturi ipsa rerum at veritatis vitae nesciunt rem ducimus architecto, vel aspernatur voluptate aperiam quas et sequi. Accusantium, qui aperiam! Mollitia maiores eaque eum soluta, vitae magnam cumque. Dolore incidunt magni odit. Enim dolores ipsum nulla, expedita numquam vero iusto, vitae sed adipisci debitis quaerat quia! Quis laboriosam earum odit rem omnis a praesentium.</p> --}}
        
        {{-- Questões --}}
        <section id="questions">
            {{-- Aqui são inseridas as questões --}}
        </section>

    </div>


@endsection