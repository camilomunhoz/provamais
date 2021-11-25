<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB; 
use App\Models\User;
use App\Models\Question;
use App\Models\Document;
use App\Models\DocumentQuestion;
use App\Models\FavoriteQuestion;

class DocQuestionsController extends Controller
{
    public function filter(Request $request) {
        
        // Caso todos os filtros não estejam selecionados
        if (!$request->all){

            $user_id = Auth::user()->id;
            $favorites = FavoriteQuestion::where('user_id', $user_id)->get();

            $sql = "SELECT * FROM questions WHERE";
            $concatenated = false; // Para saber se algo já foi concatenado

            // Questões de qualquer usuário
            if ($request->others_questions) {
                $sql .= " ((user_id <> $user_id AND private = 0)";
                if (!($request->my_questions || $request->private || $request->favorite)) {
                    $sql .= ")";
                }
                $concatenated = true;
            }

            // Minhas questões públicas
            if ($request->my_questions) {
                $concatenated ? $sql .= " OR (user_id = $user_id AND private = 0)" : $sql .= " ((user_id = $user_id AND private = 0)";
                if (!($request->private || $request->favorite)) {
                    $sql .= ")";
                }
                $concatenated = true;
            }

            // Minhas questões privadas
            if ($request->private) {
                if ($concatenated && $request->favorite) {
                    $sql .= " OR (user_id = $user_id AND private = 1)";
                }
                else if ($concatenated && !$request->favorite) {
                    $sql .= " OR (user_id = $user_id AND private = 1))";
                } 
                else if (!$concatenated && !$request->favorite) {
                    $sql .= " ((user_id = $user_id AND private = 1))";
                } 
                else if (!$concatenated && $request->favorite) {
                    $sql .= " ((user_id = $user_id AND private = 1)";
                } 
                $concatenated = true;
            }

            // Questões favoritas
            if ($request->favorite && !$concatenated) { // Caso apenas o filtro "Favoritas" esteja selecionado, muda a query inicial

                $sql = "SELECT * FROM questions WHERE ";

                $favorites = FavoriteQuestion::where('user_id', $user_id)->get();

                if (count($favorites) > 0) {
                    foreach ($favorites as $key => $fav) {
                        if ($key == 0) $sql .= " (id = $fav->question_id";
                        else $sql .= " OR id = $fav->question_id";
                        if ($key == count($favorites)-1) $sql .= ')';
                    }
                } else {
                    echo json_encode([]);
                    die;
                }
            }
            else if ($request->favorite) { // Se não, apenas concatena
                $favorites = FavoriteQuestion::where('user_id', $user_id)->get();
                foreach ($favorites as $key => $fav) {
                    if ($key == 0) $sql .= " OR (id = $fav->question_id";
                    else $sql .= " OR id = $fav->question_id";
                    if ($key == count($favorites)-1) $sql .= '))';
                }
            }
            
            // Disciplinas
            if ($request->subjects) {
                $subjects = $request->subjects;

                foreach ($subjects as $key => $subject) {
                    if ($key == 0) {
                        $sql .= " AND (subject_id = $subject";
                    }
                    else {
                        $sql .= " OR subject_id = $subject";
                    }
                    if ($key == count($subjects)-1) {
                        $sql .= ")";
                    }
                }
            }
            else {
                echo json_encode([]);
                die;
            }

            // Tipos das questões
            if ($request->types) {
                $types = $request->types;

                if (count($types) == 2) {
                    $sql .= " AND (type LIKE 'Dissertativa' OR type LIKE 'Objetiva')";
                }
                else if (count($types) == 1) {
                    $sql .= " AND type LIKE '$types[0]'";
                }
            }
            else {
                echo json_encode([]);
                die;
            }

            // Caso tenha termo de busca
            if ($request->search) {
                $sql .= " AND (statement LIKE '%$request->search%' OR content LIKE '%$request->search%')";
            }

            // Resgatando as questões
            $questions = DB::select($sql);

            // Transformando o resultado em uma Collection para melhor manipulação
            $questions = Question::hydrate($questions);

            // Inserindo dados das chaves estrangeiras. Acesso direto por causa da relação.
            foreach ($questions as $q) {
                $q['subject_name'] = $q->subject->name;
                $q['options'] = $q->options;
                
                // Se ela não é uma duplicata, ainda tem que conferir quem é o dono pois pode ser uma favoritada
                if (!$q->duplicated_from_user) {
                    if ($q->user_id === Auth::id()) {
                        $q->owner = 'você mesmo';
                    }
                    else {
                        $owner_name = explode(' ', $q->user->name);
                        $q->owner = $owner_name[0];
                    }
                }
                // Se ela é uma duplicata, é imprescindível conferir quem é o dono: o logado ou outro user
                else {
                    $creator = User::firstWhere('id', $q->duplicated_from_user);
                    if ($creator->id === Auth::id()) {
                        $q->owner = 'você mesmo';
                    }
                    else {
                        $creator_name = explode(' ', $creator->name);
                        $q->owner = $creator_name[0];
                    }
                    $q->user->profile_pic = $creator->profile_pic;
                }

                if(!$q->user->profile_pic){
                    $q->user->profile_pic = 'user_pic_placeholder.png';
                }

                // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
                unset($q->user['name']);
                unset($q->user['cpf']);
                unset($q->user['password']);
                unset($q->user['pix']);
                unset($q->user['email']);
                unset($q->user['description']);
                unset($q->user['created_at']);
                unset($q->user['updated_at']);
            }
        }

        // Caso todos os filtros estejam selecionados
        else if ($request->all){

            $user_id = Auth::user()->id;
            $favorites = FavoriteQuestion::where('user_id', $user_id)->get();

            $sql = "SELECT * FROM questions WHERE (private = 0 OR user_id = $user_id)";
            if ($request->search) $sql .= " AND (statement LIKE '%$request->search%' OR content LIKE '%$request->search%')";

            // Resgatando as questões
            $questions = DB::select($sql);

            // Transformando o resultado em uma Collection para melhor manipulação
            $questions = Question::hydrate($questions);

            // Inserindo dados das chaves estrangeiras. Acesso direto por causa da relação.
            foreach ($questions as $q) {
                $q['subject_name'] = $q->subject->name;
                $q['options'] = $q->options;
                
                // Se ela não é uma duplicata, ainda tem que conferir quem é o dono pois pode ser uma favoritada
                if (!$q->duplicated_from_user) {
                    if ($q->user_id === Auth::id()) {
                        $q->owner = 'você mesmo';
                    }
                    else {
                        $owner_name = explode(' ', $q->user->name);
                        $q->owner = $owner_name[0];
                    }
                }
                // Se ela é uma duplicata, é imprescindível conferir quem é o dono: o logado ou outro user
                else {
                    $creator = User::firstWhere('id', $q->duplicated_from_user);
                    if ($creator->id === Auth::id()) {
                        $q->owner = 'você mesmo';
                    }
                    else {
                        $creator_name = explode(' ', $creator->name);
                        $q->owner = $creator_name[0];
                    }
                    $q->user->profile_pic = $creator->profile_pic;
                }

                if(!$q->user->profile_pic){
                    $q->user->profile_pic = 'user_pic_placeholder.png';
                }

                // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
                unset($q->user['name']);
                unset($q->user['cpf']);
                unset($q->user['password']);
                unset($q->user['pix']);
                unset($q->user['email']);
                unset($q->user['description']);
                unset($q->user['created_at']);
                unset($q->user['updated_at']);
            }
        }
        
        echo json_encode(['questions' => $questions, 'favorites' => $favorites]);
    }

    public function get(Request $request) {

        $sql = "SELECT * FROM questions WHERE";

        $ids = explode(';', $request->ids);
        array_pop($ids);

        foreach ($ids as $key => $id) {
            if ($key == 0){
                $sql .= " identifier = '$id'";
            }
            else {
                $sql .= " OR identifier = '$id'";
            }
        }

        $questions = DB::select($sql);
        $questions = Question::hydrate($questions);

        foreach ($questions as $q) {
            $q->options;

            // Se ela não é uma duplicata, ainda tem que conferir quem é o dono pois pode ser uma favoritada
            if (!$q->duplicated_from_user) {
                if ($q->user_id === Auth::id()) {
                    $q->owner = 'você mesmo';
                }
                else {
                    $owner_name = explode(' ', $q->user->name);
                    $q->owner = $owner_name[0];
                }
            }
            // Se ela é uma duplicata, é imprescindível conferir quem é o dono: o logado ou outro user
            else {
                $creator = User::firstWhere('id', $q->duplicated_from_user);
                if ($creator->id === Auth::id()) {
                    $q->owner = 'você mesmo';
                }
                else {
                    $creator_name = explode(' ', $creator->name);
                    $q->owner = $creator_name[0];
                }
                $q->user->profile_pic = $creator->profile_pic;
            }

            if(!$q->user->profile_pic){
                $q->user->profile_pic = 'user_pic_placeholder.png';
            }
        }

        echo json_encode($questions);
    }

    public function store(Request $request) {

        $doc = new Document;

        $user = Auth::user();
        $doc->user_id = $user->id;

        $doc->name = $request->name;

        // Garante que não seja salvo um nome repetido. Concatena '(n)'.
        while (count(DB::select("SELECT * FROM documents WHERE user_id = $user->id AND name = '$doc->name'"))) {
            if (preg_match('/^\s\((\d+)\)$/', substr($doc->name, -4))) {
                $doc->name = substr($doc->name, 0, -4).' ('.(substr($doc->name, -2, -1) + 1).')';
            }
            else {
                $doc->name = $doc->name.' (1)';
            }
        }

        trim($doc->name);                                     // Tira espaços no início e fim
        $doc->name = preg_replace('/\s+/', ' ', $doc->name);  // Tira espaços múltiplos
        
        $doc->details = $request->details;
        trim($doc->details);                                        // Tira espaços no início e fim
        $doc->details = preg_replace('/\s+/', ' ', $doc->details);  // Tira espaços múltiplos

        $doc->question_enumerator = $request->question_enumerator;
        $doc->options_enumerator = $request->options_enumerator;

        $header_images = $user->header_images;
        $instructions = $user->instructions;

        // Verificando se os ids de header e instructions pertencem ao usuário
        $header_image_check = false;
        $instruction_check = false;
        foreach ($header_images as $h_i) {
            if ($h_i->id == $request->header_image) {
                $header_image_check = true;
                break;
            }
        }
        foreach ($instructions as $i) {
            if ($i->id == $request->instruction) {
                $instruction_check = true;
                break;
            }
        }
        $doc->header_image_id = $header_image_check ? $request->header_image : 1;
        $doc->instruction_id = $instruction_check ? $request->instruction : 1;

        $doc->save();

        $questions_ids = json_decode($request->questions);

        foreach ($questions_ids as $order => $q_identifier) {
            $relation = new DocumentQuestion;
            $q_id = Question::select('id')->where('identifier', $q_identifier)->first()->id;
            $relation->document_id = $doc->id;
            $relation->question_id = $q_id;
            $relation->order = $order;
            $relation->save();
        }
        return redirect('/my_docs');

    }

    public function update(Request $request) {

        $doc = Document::firstWhere('id', $request->doc_id);

        if($doc && $doc->user_id === Auth::id()) {

            $user = Auth::user();

            $name_was_changed = ($doc->name == $request->name) ? false : true ;

            // Se o nome foi mudado, garante que não seja salvo um nome repetido. Concatena '(n)'.
            if ($name_was_changed) {
                $was_equal = false;
                while (count(DB::select("SELECT * FROM documents WHERE user_id = $doc->user_id AND name = '$request->name'"))) {
                    
                    $was_equal = true;

                    if (preg_match('/^\s\((\d+)\)$/', substr($request->name, -4))) {
                        $doc->name = substr($request->name, 0, -4).' ('. (substr($request->name, -2, -1) + 1) .')';
                        $request->name = $doc->name;
                    }

                    else {
                        $doc->name = $request->name.' (1)';
                        $request->name = $doc->name;
                    }
                }
                if (!$was_equal) {
                    $doc->name = $request->name;
                }
                trim($doc->name);                                     // Tira espaços no início e fim
                $doc->name = preg_replace('/\s+/', ' ', $doc->name);  // Tira espaços múltiplos
            }
            $doc->details = $request->details;
            trim($doc->details);                                        // Tira espaços no início e fim
            $doc->details = preg_replace('/\s+/', ' ', $doc->details);  // Tira espaços múltiplos

            $doc->question_enumerator = $request->question_enumerator;
            $doc->options_enumerator = $request->options_enumerator;

            $header_images = $user->header_images;
            $instructions = $user->instructions;
    
            // Verificando se os ids de header e instructions pertencem ao usuário
            $header_image_check = false;
            $instruction_check = false;
            foreach ($header_images as $h_i) {
                if ($h_i->id == $request->header_image) {
                    $header_image_check = true;
                    break;
                }
            }
            foreach ($instructions as $i) {
                if ($i->id == $request->instruction) {
                    $instruction_check = true;
                    break;
                }
            }
            $doc->header_image_id = $header_image_check ? $request->header_image : 1;
            $doc->instruction_id = $instruction_check ? $request->instruction : 1;

            $doc->save();

            // Atualizando a relação document_question...

            $doc_quest = DocumentQuestion::where('document_id', $doc->id)->get();

            foreach ($doc_quest as $dc) {
                // Apaga as relações antigas
                DB::statement("DELETE FROM document_questions WHERE document_id = '$dc->document_id' AND question_id = '$dc->question_id'");
            }

            $questions_ids = json_decode($request->questions);

            foreach ($questions_ids as $order => $q_identifier) { // Cria as relações
                $relation = new DocumentQuestion;
                $q_id = Question::select('id')->where('identifier', $q_identifier)->first()->id;
                $relation->document_id = $doc->id;
                $relation->question_id = $q_id;
                $relation->order = $order;
                $relation->save();
            }
            return redirect('/my_docs');
        }
        else return redirect('/');
    }

}